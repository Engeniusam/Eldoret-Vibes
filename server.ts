import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DESTINATIONS } from './src/data/destinations.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Port configuration: Defaults to 8080 for Google Cloud Run / production container,
// or falls back to 3000 in local dev environment.
const PORT = Number(process.env.PORT) || (isProduction ? 8080 : 3000);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/@') && !req.path.includes('node_modules')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// -------------------------------------------------------------
// HEALTH CHECK ENDPOINTS (for Google Cloud Run & Monitoring)
// -------------------------------------------------------------
app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'eldoret-kapsabet-vibes',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    faroWebSdkReady: true,
    totalDestinations: DESTINATIONS.length,
    kapsabetDestinations: DESTINATIONS.filter(d => d.region === 'kapsabet').length,
  });
});

// -------------------------------------------------------------
// REST API FOR DESTINATIONS (Mock data for Kapsabet & Eldoret)
// -------------------------------------------------------------
app.get('/api/destinations', (req: Request, res: Response) => {
  const { region, category, search } = req.query;
  let results = [...DESTINATIONS];

  if (typeof region === 'string' && region) {
    results = results.filter(d => d.region === region.toLowerCase());
  }

  if (typeof category === 'string' && category && category !== 'all') {
    results = results.filter(d => d.category === category.toLowerCase());
  }

  if (typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.locationDetails.toLowerCase().includes(q) ||
      d.county.toLowerCase().includes(q) ||
      d.highlights.some(h => h.toLowerCase().includes(q))
    );
  }

  res.json({
    total: results.length,
    destinations: results,
  });
});

app.get('/api/destinations/:id', (req: Request, res: Response) => {
  const destination = DESTINATIONS.find(d => d.id === req.params.id);
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  res.json(destination);
});

// -------------------------------------------------------------
// GRAFANA FARO WEB SDK STATUS & MOCK COLLECTOR
// -------------------------------------------------------------
app.get('/api/faro/status', (_req: Request, res: Response) => {
  res.json({
    sdkReady: true,
    cdnUrl: 'https://unpkg.com/@grafana/faro-web-sdk@^1.4.0/dist/bundle/faro.iife.js',
    recommendedConfig: {
      appName: 'eldoret-kapsabet-vibes',
      appVersion: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      instructions: 'Paste your Grafana Cloud Faro Collector URL in index.html or use the in-app configuration modal.',
    },
  });
});

// Mock collector endpoint to receive Faro events/spans if pointed to this backend
app.post(['/api/faro/collect', '/collect'], (req: Request, res: Response) => {
  console.log('[Faro Collector] Received beacon payload:', JSON.stringify(req.body).substring(0, 150) + '...');
  res.status(202).json({
    status: 'accepted',
    traceId: 'trace_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
  });
});

// Helper: Generate dynamic HTML layout
function generateDynamicHtml(): string {
  const faroUrl = process.env.GRAFANA_FARO_URL || '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Eldoret &amp; Kapsabet Vibes - Highland Explorer</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Grafana Faro Web SDK Ready Hook -->
  <script>
    window.GRAFANA_FARO_CONFIG = {
      url: "${faroUrl}",
      appName: "eldoret-kapsabet-vibes",
      appVersion: "1.0.0",
      environment: "${process.env.NODE_ENV || 'production'}"
    };
  </script>
</head>
<body class="bg-[#fbf9f8] text-[#1b1c1c] font-sans antialiased p-6">
  <div class="max-w-6xl mx-auto space-y-6">
    <header class="flex items-center justify-between border-b pb-4">
      <div>
        <h1 class="text-2xl font-bold text-[#004ccd]">Eldoret &amp; Kapsabet Vibes</h1>
        <p class="text-xs text-slate-500 uppercase tracking-wider">Highland Explorer • Google Cloud Run Ready (Port ${PORT})</p>
      </div>
      <a href="/" class="bg-[#004ccd] text-white text-xs font-semibold px-4 py-2 rounded-xl">Refresh View</a>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${DESTINATIONS.map(d => `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <img src="${d.imageUrl}" alt="${d.name}" class="w-full h-44 object-cover" />
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-bold ${d.region === 'kapsabet' ? 'text-[#006527]' : 'text-[#004ccd]'} uppercase">
                  ${d.region === 'kapsabet' ? '🌿 Kapsabet' : '📍 Eldoret'}
                </span>
                <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">${d.studentPrice}</span>
              </div>
              <h3 class="font-bold text-base text-[#1b1c1c]">${d.name}</h3>
              <p class="text-xs text-slate-500 mt-1">${d.distance}</p>
              <p class="text-xs text-slate-600 mt-2 line-clamp-2">${d.description}</p>
            </div>
            <div class="mt-4 pt-3 border-t flex items-center justify-between">
              <span class="text-xs text-slate-500 font-medium">★ ${d.rating} (${d.reviewsCount})</span>
              <a href="/?spot=${d.id}" class="text-xs bg-[#004ccd] text-white px-3 py-1.5 rounded-lg font-semibold">View Details</a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
}

// -------------------------------------------------------------
// DYNAMIC SERVER-RENDERED FRONTEND LAYOUT (Requirement 1)
// -------------------------------------------------------------
app.get('/dynamic', (_req: Request, res: Response) => {
  res.send(generateDynamicHtml());
});

// -------------------------------------------------------------
// FRONTEND SERVING (Vite in Dev, Express Static Files in Production)
// -------------------------------------------------------------
function resolveClientDist(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, 'dist'),
    __dirname,
    path.resolve(process.cwd(), 'public'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'index.html'))) {
      return c;
    }
  }
  return null;
}

async function setupFrontend() {
  if (!isProduction) {
    // Development mode: Mount Vite middleware for fast HMR and compilation
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production / Cloud Run mode: Serve pre-built static assets from dist
    const clientDist = resolveClientDist();
    if (clientDist) {
      console.log(`[Static] Serving frontend static assets from: ${clientDist}`);
      app.use(express.static(clientDist));

      app.get('*', (req: Request, res: Response, next) => {
        if (req.path.startsWith('/api') || req.path === '/health') {
          return next();
        }
        const indexPath = path.join(clientDist, 'index.html');
        res.sendFile(indexPath, (err) => {
          if (err) {
            console.error(`[Error] Failed to send ${indexPath}, falling back to dynamic HTML:`, err.message);
            res.send(generateDynamicHtml());
          }
        });
      });
    } else {
      console.warn('[Warning] No pre-built index.html found. Using dynamic SSR layout as fallback.');
      app.get('*', (req: Request, res: Response, next) => {
        if (req.path.startsWith('/api') || req.path === '/health') {
          return next();
        }
        res.send(generateDynamicHtml());
      });
    }
  }
}

setupFrontend().then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 Eldoret & Kapsabet Vibes Server is active!`);
    console.log(`📡 Listening on: http://0.0.0.0:${PORT}`);
    console.log(`🌐 Google Cloud Run Container Ready`);
    console.log(`📈 Grafana Faro Web SDK Ready for manual CDN script`);
    console.log(`🩺 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`====================================================`);
  });

  // Graceful shutdown for Cloud Run container lifecycle
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, gracefully terminating server...');
    server.close(() => {
      console.log('Server terminated successfully.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down...');
    server.close(() => {
      process.exit(0);
    });
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
