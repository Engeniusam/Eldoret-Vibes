import { initializeFaro, getWebInstrumentations } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { ReplayInstrumentation } from '@grafana/faro-instrumentation-replay';

initializeFaro({
  url: 'https://faro-collector-prod-us-west-0.grafana.net/collect/bd122a65b7438427227bb68f29b06c3d',
  app: {
    name: 'Eldoret Vibes',
    version: '0.0.0',
    environment: import.meta.env.MODE,
  },
  instrumentations: [
    ...getWebInstrumentations(),
    new TracingInstrumentation(),
    new ReplayInstrumentation({
      blockSelector: '.grafana-block, img, picture, svg, video, audio, canvas, iframe, object, embed, input[type="hidden"]',
      ignoreSelector: '.grafana-ignore',
    }),
  ],
  ignoreErrors: [
    /^ResizeObserver loop limit exceeded$/,
    /^ResizeObserver loop completed with undelivered notifications$/,
    /^Script error\.$/,
    /chrome-extension:\/\//,
    /moz-extension:\/\//,
  ],
  experimental: {
    trackNavigation: true,
  },
});
