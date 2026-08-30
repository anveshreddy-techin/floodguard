# FloodGuard AI — Weather Intelligence Module

## Purpose

The Weather Intelligence Module provides truthful, location-aware meteorological data to all FloodGuard AI roles: citizen safety guidance, district EOC operational briefings, GIS/ML analyst deep-dives, and national NDMA situational overviews.

All weather outputs carry explicit **data mode labels** (`DEMO`, `LIVE`, `SIMULATION`, `UPLOAD`, `HISTORICAL`). No forecast is presented as an official government warning unless it originates from a properly authorized IMD or CWC statutory source.

---

## Module Architecture

```
apps/web/src/app/weather/page.tsx              ← Main Weather Intelligence Page (Next.js)
apps/web/src/components/ui/weather/
├── WeatherBadges.tsx                          ← Rainfall intensity and condition badges
├── CurrentWeatherCard.tsx                     ← Present-time atmospheric observation panel
├── HourlyForecastChart.tsx                    ← 24h interactive SVG hydrograph
├── DailyForecastCard.tsx                      ← 7-day synoptic outlook cards
├── WeatherAlertCard.tsx                       ← Multi-hazard alert recommendation panels
├── SourceComparisonPanel.tsx                  ← Multi-provider data comparison matrix
├── CommunityReportCard.tsx                    ← Citizen & field hazard report stream
├── CommunityReportModal.tsx                   ← Citizen report submission form
├── WeatherQualityPanel.tsx                    ← Provider quality & freshness audit
└── WeatherUploadModal.tsx                     ← CSV weather data uploader

apps/api/src/
├── models/weather.py                          ← Pydantic schemas
├── providers/weather_provider.py              ← Open-Meteo & IMD adapters
├── services/weather_service.py               ← Core intelligence service
├── services/community_service.py             ← Community report lifecycle
└── routers/weather.py + community.py         ← FastAPI endpoints
```

---

## Role-Adaptive Views

| Role | Visible Panels |
|---|---|
| Citizen | Current conditions, Rainfall intensity badge, Hourly outlook (24h), Community report submission |
| Village Operator | + Daily forecast, Weather alerts, Community reports stream |
| Field Responder | + Source comparison, GPS-triggered location refresh |
| District EOC Operator | + Multi-source matrix, Operator verification queue, Telemetry quality audit |
| State/National NDMA | + All panels, Full India state selector, Cross-district comparison |
| GIS / ML Analyst | + All panels, Provider sync, CSV upload, Quality audit |

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/weather/current` | GET | Current atmospheric conditions + rainfall intensity |
| `/api/v1/weather/hourly` | GET | 24–72h hourly forecast with cumulative hydrograph |
| `/api/v1/weather/daily` | GET | 7–14 day daily synoptic outlook |
| `/api/v1/weather/alerts` | GET | Multi-hazard alert recommendations |
| `/api/v1/weather/sources` | GET | Multi-provider comparison with agreement matrix |
| `/api/v1/weather/quality` | GET | Telemetry quality and freshness audit |
| `/api/v1/weather/uploads` | POST | Upload custom weather CSV |
| `/api/v1/community/reports` | GET | List community reports |
| `/api/v1/community/reports` | POST | Submit citizen/field hazard report |
| `/api/v1/community/reports/{id}/verify` | POST | Operator verification |
| `/api/v1/community/reports/{id}/reject` | POST | Operator rejection |

---

## Data Modes

- **DEMO**: Pre-seeded deterministic Chamoli heavy-rain scenario. Always clearly labeled.
- **LIVE**: Real-time Open-Meteo NWP. Labels `PUBLIC FORECAST PROVIDER`.
- **REAL_PILOT**: IMD/CWC authorized feeds (requires MoU and API credentials).
- **UPLOAD**: User-supplied CSV data. Never presented as official observation.
- **SIMULATION**: What-if scenario runs. Always labeled `SIMULATION`.
- **HISTORICAL**: Past-event replay from hindcast engine.

---

## Truthfulness Rules

1. Community reports are always `UNVERIFIED` at submission until corroborated by IoT sensor cross-check or operator review.
2. IMD provider status is `NOT_CONFIGURED` until credentials and MoU are present — never fabricated.
3. Alert recommendations always display `NOT_AN_OFFICIAL_WARNING` unless sourced from authorized statutory feeds.
4. Source comparison panel always renders divergence explicitly when providers disagree.
