# IMD (India Meteorological Department) Integration Architecture

## 1. Scope & Data Products
The IMD adapter interface (`apps/api/src/providers/imd_adapter.py`) defines the technical integration contract for all official IMD observational and numerical weather prediction products:
- **Station AWS/ARG Telemetry**: Hourly and 15-minute rainfall rate, temperature, humidity, wind vector.
- **District Rainfall Summaries**: Gridded rainfall accumulation (24h, 72h, weekly departures).
- **Quantitative Precipitation Forecasts (QPF)**: Basin-level 6h to 24h precipitation guidance.
- **Extreme Weather Bulletins & Color Alerts**: Red / Orange / Yellow meteorological advisories.

## 2. Institutional Authorization & Configuration Requirements
- **Endpoint**: `https://api.imd.gov.in` / `https://internal.imd.gov.in` (National Data Center, Pune).
- **Security Prerequisite**: Static public IP whitelisting + institutional MoU with IMD Director General.
- **Environment Variable**: `RAINFALL_API_KEY` in `.env`.

## 3. Truthfulness & Fallback Policy
In accordance with FloodGuard AI Truthfulness Guidelines:
- When `RAINFALL_API_KEY` is not provided or `RAINFALL_PROVIDER != 'imd'`, the adapter explicitly reports `status: "NOT_CONFIGURED"`.
- It **never fabricates live IMD API connections** or generates fake live readings claiming to originate from IMD.
- Instead, the platform falls back to deterministic DEMO data or Open-Meteo live forecasts, tagging all outputs with `data_mode: "DEMO"`.
- Field personnel can manually ingest verified IMD AWS records using `data/templates/rainfall_template.csv` in the Upload Center.
