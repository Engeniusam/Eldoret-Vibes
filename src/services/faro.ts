export interface FaroTelemetryEvent {
  id: string;
  timestamp: string;
  name: string;
  attributes: Record<string, any>;
  source: 'live_faro_sdk' | 'synthetic_rum';
}

declare global {
  interface Window {
    GRAFANA_FARO_CONFIG?: {
      enabled: boolean;
      url: string;
      appName: string;
      appVersion: string;
      environment: string;
    };
    faro?: {
      api: {
        pushEvent: (name: string, attributes?: Record<string, any>) => void;
        pushMeasurement: (payload: { type: string; values: Record<string, number> }) => void;
        pushError: (error: Error | string) => void;
      };
    };
    GrafanaFaroWebSdk?: {
      initializeFaro: (config: any) => any;
    };
  }
}

class FaroService {
  private listeners: ((events: FaroTelemetryEvent[]) => void)[] = [];
  private eventHistory: FaroTelemetryEvent[] = [
    {
      id: 'trace_init_001',
      timestamp: new Date().toLocaleTimeString(),
      name: 'faro_sdk_ready',
      attributes: {
        app: 'eldoret-kapsabet-vibes',
        collector_state: 'ready_for_cdn',
        environment: 'production'
      },
      source: 'synthetic_rum'
    }
  ];

  public isSdkLoaded(): boolean {
    return typeof window !== 'undefined' && !!window.faro;
  }

  public getCollectorUrl(): string {
    if (typeof window === 'undefined') return '';
    return window.GRAFANA_FARO_CONFIG?.url || '';
  }

  public setCollectorUrl(url: string) {
    if (typeof window !== 'undefined') {
      window.GRAFANA_FARO_CONFIG = window.GRAFANA_FARO_CONFIG || {
        enabled: false,
        url: '',
        appName: 'eldoret-kapsabet-vibes',
        appVersion: '1.0.0',
        environment: 'production'
      };
      window.GRAFANA_FARO_CONFIG.url = url;
    }
  }

  public trackEvent(name: string, attributes: Record<string, any> = {}) {
    const isLive = this.isSdkLoaded();
    const event: FaroTelemetryEvent = {
      id: 'trace_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      name,
      attributes: {
        ...attributes,
        client_timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'node'
      },
      source: isLive ? 'live_faro_sdk' : 'synthetic_rum'
    };

    // If real Grafana Faro SDK is active on window, dispatch real telemetry!
    if (isLive && window.faro) {
      try {
        window.faro.api.pushEvent(name, attributes);
      } catch (err) {
        console.warn('[Grafana Faro] Error pushing live event:', err);
      }
    }

    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 25) {
      this.eventHistory.pop();
    }
    this.notify();
    return event;
  }

  public trackMeasurement(name: string, value: number) {
    if (this.isSdkLoaded() && window.faro) {
      try {
        window.faro.api.pushMeasurement({
          type: name,
          values: { value }
        });
      } catch (err) {
        console.warn('[Grafana Faro] Error pushing measurement:', err);
      }
    }
  }

  public trackError(err: Error | string) {
    if (this.isSdkLoaded() && window.faro) {
      try {
        window.faro.api.pushError(err);
      } catch (e) {
        console.warn('[Grafana Faro] Error pushing error:', e);
      }
    }
    this.trackEvent('client_error', {
      error_message: typeof err === 'string' ? err : err.message
    });
  }

  public getHistory(): FaroTelemetryEvent[] {
    return [...this.eventHistory];
  }

  public subscribe(listener: (events: FaroTelemetryEvent[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.getHistory()));
  }

  /**
   * Dynamically loads the Grafana Faro Web SDK CDN script if user injects it via UI
   */
  public async injectFaroCDN(collectorUrl: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    this.setCollectorUrl(collectorUrl);

    if (window.faro) {
      return true;
    }

    return new Promise((resolve) => {
      // Check if already injected
      const existingScript = document.getElementById('grafana-faro-cdn-script');
      if (existingScript) {
        if (window.GrafanaFaroWebSdk) {
          window.faro = window.GrafanaFaroWebSdk.initializeFaro({
            url: collectorUrl,
            app: {
              name: 'eldoret-kapsabet-vibes',
              version: '1.0.0',
              environment: 'production'
            }
          });
          this.trackEvent('faro_initialized_live', { url: collectorUrl });
          return resolve(true);
        }
      }

      const script = document.createElement('script');
      script.id = 'grafana-faro-cdn-script';
      script.src = 'https://unpkg.com/@grafana/faro-web-sdk@^1.4.0/dist/bundle/faro.iife.js';
      script.async = true;

      script.onload = () => {
        if (window.GrafanaFaroWebSdk) {
          window.faro = window.GrafanaFaroWebSdk.initializeFaro({
            url: collectorUrl,
            app: {
              name: 'eldoret-kapsabet-vibes',
              version: '1.0.0',
              environment: 'production'
            }
          });
          this.trackEvent('faro_sdk_injected_successfully', {
            collector_url: collectorUrl
          });
          resolve(true);
        } else {
          resolve(false);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Grafana Faro CDN script');
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }
}

export const faroService = new FaroService();
