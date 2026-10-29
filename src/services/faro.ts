import { faro } from '@grafana/faro-react';

export interface FaroTelemetryEvent {
  id: string;
  timestamp: string;
  name: string;
  attributes: Record<string, any>;
  source: 'live_faro_sdk' | 'synthetic_rum';
}

class FaroService {
  private collectorUrl = '';
  private listeners: ((events: FaroTelemetryEvent[]) => void)[] = [];
  private eventHistory: FaroTelemetryEvent[] = [
    {
      id: 'trace_init_001',
      timestamp: new Date().toLocaleTimeString(),
      name: 'faro_sdk_ready',
      attributes: {
        app: 'eldoret-kapsabet-vibes',
        collector_state: 'npm_sdk',
        environment: 'production'
      },
      source: 'synthetic_rum'
    }
  ];

  public isSdkLoaded(): boolean {
    return !!faro.api;
  }

  public getCollectorUrl(): string {
    return this.collectorUrl;
  }

  public setCollectorUrl(url: string) {
    this.collectorUrl = url;
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

    if (isLive) {
      try {
        faro.api?.pushEvent(name, this.stringifyAttributes(attributes));
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
    if (this.isSdkLoaded()) {
      try {
        faro.api?.pushMeasurement({
          type: name,
          values: { value }
        });
      } catch (err) {
        console.warn('[Grafana Faro] Error pushing measurement:', err);
      }
    }
  }

  public trackError(err: Error | string) {
    if (this.isSdkLoaded()) {
      try {
        faro.api?.pushError(typeof err === 'string' ? new Error(err) : err);
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

  public async injectFaroCDN(collectorUrl: string): Promise<boolean> {
    this.setCollectorUrl(collectorUrl);
    const isLive = this.isSdkLoaded();
    if (isLive) {
      this.trackEvent('faro_collector_url_set', { collector_url: collectorUrl });
    }
    return isLive;
  }

  private stringifyAttributes(attributes: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    Object.entries(attributes).forEach(([key, value]) => {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    });
    return result;
  }
}

export const faroService = new FaroService();
