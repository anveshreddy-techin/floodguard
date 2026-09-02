# IoT Sensor Network & Edge Gateway Architecture

## Sensor Node Types
1. **Automated Weather Stations (AWS)**: Measures rainfall intensity, ambient temperature, relative humidity, and barometric pressure.
2. **Ultrasonic & Radar River Stage Gauges**: Non-contact water level measurement with sampling rates of 1-5 minutes during active flood watch.
3. **Time-Domain Reflectometry (TDR) Soil Probes**: Multi-depth volumetric soil moisture sensors tracking slope saturation.
4. **Geophone / Acoustic Vibration Sensors**: High-frequency acoustic sensors detecting debris flow and boulder collisions in upstream colluvial gullies.

## Telemetry Protocol & Resilience
- Nodes communicate over solar-powered LoRaWAN (865-867 MHz in India) or cellular NB-IoT.
- When wireless connectivity drops, edge gateways cache readings in local non-volatile flash memory and sync on reconnection.
