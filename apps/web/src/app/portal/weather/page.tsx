'use client';

import React, { useState } from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { GovernmentStyleTable, TableColumn } from '@/design-system/components';
import {
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Compass,
  AlertCircle,
  Clock,
  Info,
  Thermometer,
} from 'lucide-react';

interface WeatherStationData {
  id: string;
  stationName: string;
  district: string;
  state: string;
  observedRainfall1h: string;
  observedRainfall24h: string;
  forecastRainfall24h: string;
  soilSaturationPct: string;
  stationStatus: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  telemetrySource: string;
  lastUpdated: string;
}

const WEATHER_STATIONS: WeatherStationData[] = [
  {
    id: 'AWS-UK-001',
    stationName: 'Joshimath Automatic Weather Station (AWS)',
    district: 'Chamoli',
    state: 'Uttarakhand',
    observedRainfall1h: '14.2 mm',
    observedRainfall24h: '78.5 mm',
    forecastRainfall24h: '95 - 120 mm',
    soilSaturationPct: '84%',
    stationStatus: 'ONLINE',
    telemetrySource: 'IMD Telemetry Network',
    lastUpdated: '14:45 IST',
  },
  {
    id: 'AWS-UK-002',
    stationName: 'Govindghat AWS (Valley of Flowers Entry)',
    district: 'Chamoli',
    state: 'Uttarakhand',
    observedRainfall1h: '8.6 mm',
    observedRainfall24h: '56.0 mm',
    forecastRainfall24h: '60 - 80 mm',
    soilSaturationPct: '76%',
    stationStatus: 'ONLINE',
    telemetrySource: 'IMD AWS Station 42118',
    lastUpdated: '14:30 IST',
  },
  {
    id: 'AWS-HP-001',
    stationName: 'Manali Snow & Avalanche Study Est (SASE)',
    district: 'Kullu',
    state: 'Himachal Pradesh',
    observedRainfall1h: '12.0 mm',
    observedRainfall24h: '62.4 mm',
    forecastRainfall24h: '75 - 110 mm',
    soilSaturationPct: '81%',
    stationStatus: 'ONLINE',
    telemetrySource: 'Open-Meteo & IMD Grid',
    lastUpdated: '14:15 IST',
  },
  {
    id: 'AWS-AS-001',
    stationName: 'Tezpur Airport Synoptic Station',
    district: 'Sonitpur',
    state: 'Assam',
    observedRainfall1h: '3.4 mm',
    observedRainfall24h: '42.8 mm',
    forecastRainfall24h: '40 - 65 mm',
    soilSaturationPct: '68%',
    stationStatus: 'ONLINE',
    telemetrySource: 'IMD Synoptic Network',
    lastUpdated: '14:00 IST',
  },
  {
    id: 'AWS-SK-001',
    stationName: 'Chungthang Hydrometric Observational Post',
    district: 'North Sikkim (Mangan)',
    state: 'Sikkim',
    observedRainfall1h: '18.5 mm',
    observedRainfall24h: '112.0 mm',
    forecastRainfall24h: '130 - 160 mm',
    soilSaturationPct: '91%',
    stationStatus: 'DEGRADED',
    telemetrySource: 'State Hydrology Telemetry',
    lastUpdated: '13:50 IST (Late Packet)',
  },
];

export default function PublicWeatherPage() {
  const { hierarchy } = useAdaptive();
  const [selectedState, setSelectedState] = useState<string>(hierarchy.state || 'ALL');

  const filteredStations = WEATHER_STATIONS.filter((st) => {
    if (selectedState !== 'ALL' && st.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    return true;
  });

  const columns: TableColumn<WeatherStationData>[] = [
    {
      key: 'stationName',
      header: 'Station & District',
      render: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.stationName}</div>
          <div className="text-[11px] text-slate-500 font-mono">{item.id} · {item.district}, {item.state}</div>
        </div>
      ),
    },
    {
      key: 'observedRainfall1h',
      header: 'Observed (1h)',
      className: 'font-mono text-xs font-bold text-blue-900',
    },
    {
      key: 'observedRainfall24h',
      header: 'Observed (24h)',
      className: 'font-mono text-xs text-slate-800',
    },
    {
      key: 'forecastRainfall24h',
      header: 'Forecast QPF (24h)',
      className: 'font-mono text-xs font-semibold text-amber-800',
    },
    {
      key: 'soilSaturationPct',
      header: 'Soil Saturation',
      align: 'center',
      render: (item) => (
        <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
          parseInt(item.soilSaturationPct) > 80
            ? 'bg-red-100 text-red-900'
            : parseInt(item.soilSaturationPct) > 60
            ? 'bg-amber-100 text-amber-900'
            : 'bg-emerald-100 text-emerald-900'
        }`}>
          {item.soilSaturationPct}
        </span>
      ),
    },
    {
      key: 'telemetrySource',
      header: 'Data Provenance',
      className: 'text-xs text-slate-600',
    },
    {
      key: 'lastUpdated',
      header: 'Last Signal',
      className: 'font-mono text-[11px] text-slate-500 whitespace-nowrap',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-700" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Catchment Rainfall & Meteorological Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Strictly segregated physical ground observations vs. numerical weather model quantitative forecasts.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <label htmlFor="weather-state-select" className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">
              Filter by State
            </label>
            <select
              id="weather-state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All States (Pan-India)</option>
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Segregation Banner: Observed vs Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: Observed Facts */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Droplets className="w-4 h-4 text-blue-700" />
              <span className="uppercase tracking-wider">Ground-Truth Physical Observations</span>
            </div>
            <p className="text-blue-900 text-[11px] leading-relaxed">
              Tipping-bucket rain gauges and acoustic stage sensors directly measure real cumulative precipitation. These measurements represent physically verified telemetry.
            </p>
            <div className="text-[10px] font-mono text-blue-800 bg-white/80 px-2 py-1 rounded border border-blue-200">
              Provenance: Regional AWS stations & CWC automated gauges
            </div>
          </div>

          {/* Box 2: Numerical Model Estimates */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Compass className="w-4 h-4 text-amber-700" />
              <span className="uppercase tracking-wider">24h Quantitative Forecast (QPF)</span>
            </div>
            <p className="text-amber-900 text-[11px] leading-relaxed">
              Numerical Weather Prediction (NWP) rainfall fields are statistical projections. They provide early planning guidance but carry inherent uncertainty in rugged mountain topography.
            </p>
            <div className="text-[10px] font-mono text-amber-800 bg-white/80 px-2 py-1 rounded border border-amber-200">
              Provenance: Open-Meteo GFS/ECMWF Ensembles & IMD WRF
            </div>
          </div>
        </div>
      </div>

      {/* Station Table */}
      <section aria-labelledby="stations-table-heading" className="space-y-3">
        <h3 id="stations-table-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Automated Hydrometeorological Station Observations
        </h3>
        <GovernmentStyleTable
          data={filteredStations}
          columns={columns}
          searchPlaceholder="Search station name, district, or telemetry source..."
          pageSize={5}
        />
      </section>

      {/* Meteorological Disclaimer */}
      <div className="bg-slate-50 border border-slate-300 rounded p-4 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Info className="w-4 h-4 text-blue-700" />
          <span>Himalayan Orographic Precipitation Note</span>
        </div>
        <p className="leading-relaxed">
          Cloudburst events (defined as &gt;100 mm/h over a limited geographical footprint) often evade coarse satellite grids. FloodGuard utilizes multi-sensor fusion including antecedent soil moisture saturation indices to detect rapid runoff preconditions before gauges register the full rainfall volume.
        </p>
      </div>
    </div>
  );
}
