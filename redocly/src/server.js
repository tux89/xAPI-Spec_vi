/**
 * Express server serving both Redocly and Swagger UI documentation
 *
 * Redocly is used for:
 *   - Linting OpenAPI specs
 *   - Bundling OpenAPI specs (resolving $refs)
 *   - Building static HTML documentation
 *
 * Swagger UI is served via Express for interactive API testing
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================================================
// Configuration
// ===================================================================
const BUNDLED_SPEC_PATH = path.join(__dirname, '../dist/bundled.yaml');
const REDOC_STATIC_PATH = path.join(__dirname, '../dist/redoc');

// ===================================================================
// Middleware
// ===================================================================
app.use(express.json());
app.use(express.static('public'));

// ===================================================================
// Health Check
// ===================================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===================================================================
// Route: /redoc - Serve Redocly static HTML
// ===================================================================
app.use('/redoc', express.static(REDOC_STATIC_PATH, {
  index: 'index.html'
}));

// ===================================================================
// Route: /api-docs - Serve Swagger UI
// ===================================================================
const loadBundledSpec = () => {
  try {
    const fileContents = fs.readFileSync(BUNDLED_SPEC_PATH, 'utf8');
    return YAML.load(fileContents);
  } catch (e) {
    console.error('Error loading bundled.yaml:', e.message);
    console.error('Make sure to run: pnpm run bundle');
    process.exit(1);
  }
};

// Swagger UI options
const swaggerOptions = {
  customSiteTitle: 'xAPI REST API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
  },
};

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(loadBundledSpec(), swaggerOptions));

// ===================================================================
// Route: /api-json - Serve bundled spec as JSON
// ===================================================================
app.get('/api-json', (req, res) => {
  try {
    const spec = loadBundledSpec();
    res.json(spec);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load spec', message: e.message });
  }
});

// ===================================================================
// Route: / - Landing page with links to both documentation
// ===================================================================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>xAPI Documentation</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 3rem;
          border-radius: 1rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 500px;
        }
        h1 { color: #333; margin-bottom: 0.5rem; }
        .subtitle { color: #666; margin-bottom: 2rem; }
        .doc-links { display: flex; flex-direction: column; gap: 1rem; }
        .btn {
          display: block;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-swagger {
          background: #4caf50;
          color: white;
          box-shadow: 0 4px 14px rgba(76, 175, 80, 0.4);
        }
        .btn-redoc {
          background: #f97316;
          color: white;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
        }
        .info { margin-top: 2rem; padding: 1rem; background: #f5f5f5; border-radius: 0.5rem; }
        .info code { background: #e0e0e0; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>xAPI REST API Documentation</h1>
        <p class="subtitle">Experience API (xAPI) - OpenAPI Specification v1.0.2</p>

        <div class="doc-links">
          <a href="/api-docs" class="btn btn-swagger">Swagger UI</a>
          <a href="/redoc" class="btn btn-redoc">Redoc</a>
        </div>

        <div class="info">
          <p>Built with Redocly CLI + Express + swagger-ui-express</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ===================================================================
// Start Server
// ===================================================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           xAPI Documentation Server Running              ║
╠═══════════════════════════════════════════════════════════╣
║  Swagger UI:    http://localhost:${PORT}/api-docs
║  Redoc:         http://localhost:${PORT}/redoc
║  API Spec JSON: http://localhost:${PORT}/api-json
║  Health:        http://localhost:${PORT}/health
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
