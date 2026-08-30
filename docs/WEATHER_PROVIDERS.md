# FloodGuard AI — Weather Providers Guide

## Priority Hierarchy

```
IMD Official AWS/ARG (when authorized) > Open-Meteo NWP (default) > IoT Rain Gauges > FloodGuard Fusion > DEMO
```

---

## 1. Open-Meteo (Default Live Provider)

- **Provider ID**: `open_meteo`
- **Type**: Public, free, open-source NWP model aggregator
- **Base URL**: `https://api.open-meteo.com/v1/forecast`
- **Variables**: temperature_2m, relative_humidity_2m, precipitation, cloudcover, wind_speed_10m, surface_pressure, weathercode
- **Forecast Horizon**: 7 days, 1-hour resolution
- **Refresh Rate**: ~15-minute model update cycle
- **Coverage**: Global
- **Authentication**: None required
- **Status When Unconfigured**: `OPERATIONAL` (always publicly accessible)

### WMO Code Mapping

| WMO Code | FloodGuard Condition |
|---|---|
| 0–1 | CLEAR_SUNNY |
| 2 | PARTLY_CLOUDY |
| 3 | CLOUDY |
| 45–48 | HAZE_FOG |
| 51–57 | DRIZZLE |
| 61 | LIGHT_RAIN |
| 63 | MODERATE_RAIN |
| 65 | HEAVY_RAIN |
| 71–77 | SNOW |
| 80–81 | LIGHT_RAIN |
| 82 | VERY_HEAVY_RAIN |
| 95 | THUNDERSTORM |
| 96–99 | HAZARDOUS_THUNDERSTORM |

---

## 2. IMD (India Meteorological Department)

- **Provider ID**: `imd_weather`
- **Type**: Official Government of India statutory weather authority
- **Status**: `NOT_CONFIGURED` until official credentials and MoU with IMD are established
- **Activation**: Set `IMD_API_KEY` and `IMD_API_BASE_URL` in environment config
- **Data Products**: IMD AWS telemetry, District Rainfall Normals, Cyclone warnings, State-level bulletins
- **Official Status**: `OFFICIAL_IMD_OBSERVATION` when active

### Required Configuration

```env
IMD_API_KEY=<your_key_from_IMD>
IMD_API_BASE_URL=https://dsp.imd.gov.in/api/
IMD_DISTRICT_ID=<district_code>
```

---

## 3. IoT Rain Gauges / AWS Sensors

- **Provider ID**: `iot_rain_gauge`
- **Type**: LoRaWAN/MQTT-connected tipping bucket rain gauges
- **Update Rate**: Real-time (30-second telemetry bursts)
- **Coverage**: Deployed districts with physical IoT infrastructure
- **Used For**: Corroborating community reports and cross-checking NWP

---

## 4. FloodGuard Multi-Hazard Fusion Model

- **Provider ID**: `floodguard_fusion`
- **Type**: AI-synthesized product combining NWP + IoT + slope-soil data
- **Inputs**: Open-Meteo rainfall, IoT rain gauge, DEM slope classification, soil saturation index
- **Output**: Unified precipitation probability with hazard escalation tags
- **Official Status**: `MODEL_ESTIMATED_RECOMMENDATION` — not a government warning
