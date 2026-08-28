# Deployment & Operations Runbook

## Docker Compose Stack
- **Database:** `postgis/postgis:15-3.4` on port `5432`.
- **API Backend:** Python 3.11 / FastAPI on port `8000`.
- **Web Frontend:** Next.js 14 Standalone on port `3000`.

## Commands
```bash
docker compose up -d    # Start all services
python3 -m src.db.seed  # Seed demo database
python3 scripts/healthcheck.py # Run automated verification
```
