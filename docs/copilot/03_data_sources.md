# Official Data Sources and Provider Registry

## Integrated National and Regional Providers
FloodGuard AI defines standardized adapter boundaries for national observation networks:

1. **India Meteorological Department (IMD)**:
   - Automated Weather Stations (AWS), Automated Rain Gauges (ARG), District Bulletins, Doppler Radar.
   - Status: Integration boundary implemented; requires official institutional credentials for live streaming.
2. **Central Water Commission (CWC)**:
   - Real-time telemetry river stages, Warning and Danger levels, HFL (Highest Flood Level) historical records.
   - Status: Standard schema defined; NOT_CONFIGURED by default in public demo mode.
3. **Open-Meteo Weather API**:
   - Open global precipitation, wind, humidity, and hourly forecast feeds.
   - Status: CONFIGURED and active as primary public forecast proxy.
4. **IoT Micro-Sensor Telemetry**:
   - Ultrasonic river level sensors, TDR soil moisture probes, tipping-bucket gauges, LoRaWAN mesh radios.
   - Status: Tested via simulator and hardware edge gateway.
