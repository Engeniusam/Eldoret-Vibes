import React, { useState, useEffect } from 'react';
import { faroService, FaroTelemetryEvent } from '../services/faro';

interface FaroConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaroConfigModal: React.FC<FaroConfigModalProps> = ({ isOpen, onClose }) => {
  const [collectorUrl, setCollectorUrl] = useState(faroService.getCollectorUrl() || '');
  const [events, setEvents] = useState<FaroTelemetryEvent[]>(faroService.getHistory());
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sdkStatus, setSdkStatus] = useState<boolean>(faroService.isSdkLoaded());

  useEffect(() => {
    const unsub = faroService.subscribe((newEvents) => {
      setEvents(newEvents);
      setSdkStatus(faroService.isSdkLoaded());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const sampleSnippet = `<!-- 1. Include Grafana Faro Web SDK CDN script in your <head> or <body> -->
<script src="https://unpkg.com/@grafana/faro-web-sdk@^1.4.0/dist/bundle/faro.iife.js"></script>

<!-- 2. Initialize Faro with your Grafana Cloud / OTel Endpoint -->
<script>
  if (window.GrafanaFaroWebSdk) {
    window.faro = window.GrafanaFaroWebSdk.initializeFaro({
      url: "${collectorUrl || 'https://faro-collector-prod-eu-west-0.grafana.net/collect/<your_app_key>'}",
      app: {
        name: "eldoret-kapsabet-vibes",
        version: "1.0.0",
        environment: "production"
      }
    });
    console.info("[Grafana Faro] Initialized RUM Web SDK");
  }
</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestInject = async () => {
    if (!collectorUrl.trim()) return;
    setLoading(true);
    const success = await faroService.injectFaroCDN(collectorUrl.trim());
    setLoading(false);
    setSdkStatus(success);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#1b1c1c] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004ccd]/20 border border-[#004ccd]/40 flex items-center justify-center text-[#96f8a1]">
              <span className="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Grafana Faro Web SDK Ready</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sdkStatus
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {sdkStatus ? '🟢 Faro SDK Active (Live)' : '🟡 Ready for Manual CDN Script'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Frontend Real User Monitoring (RUM) &amp; OpenTelemetry Traces
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Instructions */}
          <div className="bg-[#f5f3f3] p-3.5 rounded-xl text-slate-700 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#004ccd] text-base">code</span>
              How to add the Grafana Faro CDN Script Manually
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600">
              <li>
                Open <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-900 font-mono">/index.html</code>.
              </li>
              <li>
                In the <code className="font-mono text-slate-900">&lt;head&gt;</code> section, uncomment the prepared Grafana Faro SDK script block.
              </li>
              <li>
                Paste your Grafana Cloud Faro Collector URL into <code className="font-mono text-slate-900">window.GRAFANA_FARO_CONFIG.url</code>.
              </li>
              <li>
                Once loaded, every destination modal click, filter change, and telemetry simulation emits structured Faro telemetry events!
              </li>
            </ol>
          </div>

          {/* Snippet box */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-200">
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-mono">Grafana Faro CDN Integration Snippet</span>
              <button
                onClick={copySnippet}
                type="button"
                className="inline-flex items-center gap-1 bg-[#004ccd] hover:bg-[#0f62fe] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-3.5 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
              {sampleSnippet}
            </pre>
          </div>

          {/* Test Live Injection in Browser */}
          <div className="border border-slate-200 p-3.5 rounded-xl space-y-2 bg-[#fbf9f8]">
            <h4 className="font-bold text-xs text-[#1b1c1c] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006527] text-base">bolt</span>
              Optional: Test Live Injection in this Session
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://faro-collector-prod-eu-west-0.grafana.net/collect/YOUR_APP_KEY"
                value={collectorUrl}
                onChange={(e) => setCollectorUrl(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#004ccd]"
              />
              <button
                type="button"
                onClick={handleTestInject}
                disabled={loading}
                className="bg-[#004ccd] hover:bg-[#0f62fe] text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">input</span>
                )}
                <span>Inject CDN</span>
              </button>
            </div>
          </div>

          {/* Live Emitted Events Log */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <span>Telemetry Spans Dispatched ({events.length})</span>
              <span className="text-[10px] text-[#004ccd]">Auto-synced with UI</span>
            </div>
            <div className="bg-[#f5f3f3] rounded-xl p-2.5 max-h-44 overflow-y-auto space-y-1.5 font-mono text-[11px]">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-bold text-[#004ccd]">{ev.name}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-slate-700 truncate">
                    {JSON.stringify(ev.attributes)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#f5f3f3] border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1b1c1c] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
