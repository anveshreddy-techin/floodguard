# FloodGuard AI — Deployment & Operations Guide

## 1. Quick Local Setup
```bash
# Clone and setup repository
git clone https://github.com/anveshreddy-techin/floodguard.git
cd floodguard

# Setup environment
cp .env.example .env

# Run full automated test suite
make test

# Launch local services with Docker Compose (PostGIS + FastAPI + Next.js)
make docker-up

# Run development mode directly
make run
```

## 2. Production Static Frontend Build
```bash
# Build Next.js static export
cd apps/web
npm install
npm run build

# Deploy to CDN / Surge
npx surge --project out --domain floodguard-ai.surge.sh
```

## 3. SIH Finals Demo Credentials
- **Admin**: `admin@floodguard.demo` / `FloodGuard2026!`
- **Operator**: `operator@floodguard.demo` / `Operator2026!`
- **Viewer**: `viewer@floodguard.demo` / `Viewer2026!`
