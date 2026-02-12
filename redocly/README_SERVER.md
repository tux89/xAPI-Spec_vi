# xAPI Documentation Server

Combines **Redocly** (for linting and bundling OpenAPI specs) with **Swagger UI** (for interactive API testing) on a single Express server.

## Project Structure

```
redocly/
├── openapi.yaml              # Source OpenAPI specification
├── redocly.yaml              # Redocly config for linting/docs
├── bundle.redocly.yaml       # Redocly config for bundling
├── package.json
├── src/
│   └── server.js             # Express server with Swagger UI
├── dist/
│   ├── bundled.yaml          # Bundled OpenAPI spec (generated)
│   └── redoc/
│       └── index.html        # Static Redoc documentation (generated)
└── public/                   # Static assets (optional)
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Express Server                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /redoc      → Serves Redocly static HTML            │   │
│  │  /api-docs   → Serves Swagger UI                     │   │
│  │  /api-json   → Returns bundled spec as JSON          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ loads
                            ▼
┌─────────────────────────────────────────────────────────────┐
│            bundled.yaml (via Redocly CLI)                   │
│              Bundled & validated OpenAPI spec               │
└─────────────────────────────────────────────────────────────┘
```

## Installation

```bash
# Navigate to the redocly directory
cd redocly

# Install dependencies
pnpm install
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `pnpm run lint` | Lint OpenAPI spec with Redocly |
| `pnpm run bundle` | Bundle OpenAPI spec (resolve $refs) |
| `pnpm build` | Bundle spec + build Redoc static HTML |
| `pnpm run dev` | Start Redocly preview server (port 8080) |
| `pnpm start` | Start Express server (port 3000) |
| `pnpm run dev:server` | Start Express with hot reload |

## Usage

### 1. Lint the OpenAPI specification

```bash
pnpm run lint
```

### 2. Bundle the OpenAPI specification

This resolves all `$ref` pointers and outputs a single `dist/bundled.yaml` file:

```bash
pnpm run bundle
```

### 3. Build static documentation

```bash
pnpm build
```

This creates:
- `dist/bundled.yaml` - Bundled OpenAPI spec for Swagger UI
- `dist/redoc/index.html` - Static Redoc documentation

### 4. Start the server

```bash
# Production mode
pnpm start

# Development mode (with hot reload)
pnpm run dev:server
```

The server will start on port 3000 (configurable via `PORT` env var):

```
╔═══════════════════════════════════════════════════════════╗
║           xAPI Documentation Server Running              ║
╠═══════════════════════════════════════════════════════════╣
║  Swagger UI:    http://localhost:3000/api-docs
║  Redoc:         http://localhost:3000/redoc
║  API Spec JSON: http://localhost:3000/api-json
║  Health:        http://localhost:3000/health
╚═══════════════════════════════════════════════════════════╝
```

## API Endpoints

| Route | Description |
|-------|-------------|
| `/` | Landing page with links to both docs |
| `/api-docs` | Swagger UI interactive documentation |
| `/redoc` | Static Redoc documentation |
| `/api-json` | Raw OpenAPI spec as JSON |
| `/health` | Health check endpoint |

## Configuration Files

### `redocly.yaml` - Linting & Preview Config

```yaml
extends:
  - recommended

theme:
  openapi:
    hideReplay: false  # Enable "Try it" panel
```

### `bundle.redocly.yaml` - Bundling Config

```yaml
extends:
  - recommended

bundle:
  dereference: true              # Resolve all $refs
  removeUnusedComponents: true    # Clean up unused definitions
```

## Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
```

## Development Workflow

```bash
# 1. Make changes to openapi.yaml
# 2. Lint to validate
pnpm run lint

# 3. Build both bundled spec and Redoc docs
pnpm build

# 4. Start the server
pnpm start
```

## Why Both Redoc and Swagger UI?

| Feature | Redoc | Swagger UI |
|---------|-------|------------|
| Clean, modern design | ✅ | ❌ |
| "Try it" functionality | ✅ | ✅ |
| Better for sharing static docs | ✅ | ❌ |
| More customizable | ✅ | ✅ |
| Industry standard | ❌ | ✅ |

Having both gives you the best of both worlds:
- **Redoc**: Beautiful, reference documentation for stakeholders
- **Swagger UI**: Interactive testing for developers
