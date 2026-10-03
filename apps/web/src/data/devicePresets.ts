export const DEVICE_PRESETS: Record<string, { device_id: string; device_type: string; location: object; telemetry: object }> = {
  ULTRASONIC_STAGE: {
    device_id: 'DEV-ESP32-RISHI-001',
    device_type: 'ULTRASONIC_WATER_LEVEL',
    location: { village_id: 'uk-chamoli-raini', lat: 30.485, lon: 79.692, altitude_m: 1180 },
    telemetry: {
      water_distance_m: 3.42,
      calculated_stage_m: 4.80,
      rate_of_rise_m_per_h: 0.55,
      battery_voltage_v: 4.12,
      signal_rssi_dbm: -78,
      ambient_temp_c: 16.4,
    },
  },
  RAIN_GAUGE: {
    device_id: 'DEV-AWS-CHAMOLI-002',
    device_type: 'RAIN_GAUGE',
    location: { village_id: 'uk-chamoli-raini', lat: 30.485, lon: 79.692, altitude_m: 1180 },
    telemetry: {
      rainfall_1h_mm: 55.0,
      rainfall_3h_mm: 88.0,
      peak_intensity_mm_h: 70.0,
      tip_count_15m: 42,
      battery_voltage_v: 3.92,
      signal_rssi_dbm: -71,
    },
  },
  SOIL_TDR: {
    device_id: 'DEV-TDR-SLOPE-003',
    device_type: 'SOIL_TDR',
    location: { village_id: 'uk-chamoli-raini', lat: 30.485, lon: 79.692, altitude_m: 1180 },
    telemetry: {
      soil_saturation_index: 0.92,
      volumetric_water_content_pct: 47.8,
      sensor_depth_cm: 30,
      pore_water_pressure_kpa: 12.4,
      soil_temp_c: 18.2,
      battery_voltage_v: 3.85,
    },
  },
  LORAWAN_GATEWAY: {
    device_id: 'GW-LORA-ALAKNANDA-004',
    device_type: 'LORAWAN_GATEWAY',
    location: { village_id: 'uk-chamoli-raini', lat: 30.485, lon: 79.692, altitude_m: 1180 },
    telemetry: {
      geophone_debris_vibration_db: 42.0,
      culvert_backpressure_ratio: 0.82,
      connected_nodes: 8,
      gateway_rssi_dbm: -65,
      uplink_frequency_hz: 865100000,
    },
  },
};

export const INGESTION_LOCATION_PRESETS: Record<string, { name: string; lat: number; lon: number; state: string; hazard: string }> = {
  chamoli: { name: 'Chamoli / Raini (Rishiganga Basin)', lat: 30.485, lon: 79.692, state: 'Uttarakhand', hazard: 'GLOF & Debris Flow' },
  kedarnath: { name: 'Kedarnath (Mandakini Valley)', lat: 30.7346, lon: 79.0669, state: 'Uttarakhand', hazard: 'Cloudburst & Moraine Breach' },
  wayanad: { name: 'Wayanad / Meppadi (Chaliyar Catchment)', lat: 11.5544, lon: 76.1265, state: 'Kerala', hazard: 'Monsoon Landslide Deluge' },
  guwahati: { name: 'Guwahati (Brahmaputra Floodplain)', lat: 26.1445, lon: 91.7362, state: 'Assam', hazard: 'Riverbank Breach & Urban Deluge' },
  kullu: { name: 'Kullu (Beas River Mainstem)', lat: 31.9579, lon: 77.1095, state: 'Himachal Pradesh', hazard: 'River Surge & Flash Flood' },
  sangli: { name: 'Sangli (Krishna River Basin)', lat: 16.8524, lon: 74.5815, state: 'Maharashtra', hazard: 'Dam Backwater' },
  patna: { name: 'Patna (Ganga-Gandak Confluence)', lat: 25.5941, lon: 85.1376, state: 'Bihar', hazard: 'Embankment Flood' },
};
