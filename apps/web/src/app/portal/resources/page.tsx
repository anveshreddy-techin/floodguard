'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Database,
  Cpu,
  Code,
  ShieldCheck,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ResourceTemplate {
  name: string;
  format: string;
  size: string;
  description: string;
  targetFields: string;
}

const TEMPLATES: ResourceTemplate[] = [
  {
    name: 'Rainfall Observations CSV Template',
    format: 'CSV',
    size: '12 KB',
    description: 'Standardized hourly AWS tipping-bucket rainfall telemetry format.',
    targetFields: 'timestamp, lat, lon, station_id, rainfall_mm, duration_mins, intensity_mm_hr, source',
  },
  {
    name: 'River Water Level & Stage CSV Template',
    format: 'CSV',
    size: '14 KB',
    description: 'Acoustic and radar gauge hydrologic water level time series format.',
    targetFields: 'timestamp, station_id, river, basin, water_level_m, discharge_cumecs, warning_level_m, hfl_m',
  },
  {
    name: 'Soil Moisture & Saturation CSV Template',
    format: 'CSV',
    size: '11 KB',
    description: 'TDR probe volumetric soil water content and antecedent rain saturation index.',
    targetFields: 'timestamp, lat, lon, depth_cm, volumetric_pct, saturation_pct, antecedent_72h_rain_mm',
  },
  {
    name: 'IoT Mesh Sensor Node Telemetry CSV Template',
    format: 'CSV',
    size: '15 KB',
    description: 'Multi-parameter LoRaWAN environmental telemetry payload schema.',
    targetFields: 'timestamp, device_id, device_type, variable, value, unit, battery_pct, signal_rssi',
  },
  {
    name: 'Historical Flood Event GeoJSON Template',
    format: 'GeoJSON',
    size: '28 KB',
    description: 'Catchment boundary, breach origin polygon, and inundated runout corridor specification.',
    targetFields: 'event_id, title, basin, hazard_type, probable_cause, breach_coordinates, runout_polygon',
  },
  {
    name: 'Designated Relief Shelter Directory Template',
    format: 'CSV',
    size: '9 KB',
    description: 'Public shelter asset registry with capacity, elevation ASL, and utility backup metadata.',
    targetFields: 'shelter_id, name, lat, lon, state, district, capacity, occupancy, facilities, nodal_phone',
  },
];

export default function PublicResourcesPage() {
  const downloadTemplate = (tmpl: ResourceTemplate) => {
    alert(`Downloading sample data template: ${tmpl.name} (${tmpl.format})\n\nThis template complies with FloodGuard AI open ingestion schema v2.1.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-3">
          <Database className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Open Hydrologic Data, Schema Specifications & Sensor Hardware
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Open access data templates, IoT telemetry specifications, and REST API standards supporting Smart India Hackathon (SIH26192).
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          FloodGuard AI advocates interoperable early warning telemetry. All schema templates conform to Central Water Commission (CWC) and India Meteorological Department (IMD) metadata standards, enabling researchers and disaster authorities to ingest heterogeneous field datasets seamlessly.
        </p>
      </div>

      {/* Section 1: Downloadable Schema Templates */}
      <section aria-labelledby="templates-heading" className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <h3 id="templates-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Official Data Ingestion Templates
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Schema Version: v2.1.0-SIH</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-300 rounded p-4 shadow-xs flex flex-col justify-between text-xs space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {tmpl.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                    {tmpl.format}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                  {tmpl.description}
                </p>

                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-700 break-all">
                  <span className="font-bold text-slate-500">Headers: </span>
                  {tmpl.targetFields}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">{tmpl.size}</span>
                <button
                  type="button"
                  onClick={() => downloadTemplate(tmpl)}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded transition active:scale-95 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Sample</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Sensor Specs & Hardware Architecture */}
      <section aria-labelledby="hardware-heading" className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Cpu className="w-4 h-4 text-emerald-700" />
          <h3 id="hardware-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Ruggedized Himalayan Edge Sensor Specifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-800">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
            <span className="font-bold text-slate-900">LoRaWAN Mesh Telemetry</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Operating on India 865-867 MHz license-free ISM band. Multi-hop mesh relay capable of transmitting packets across steep ridges without cellular coverage.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
            <span className="font-bold text-slate-900">Ultrasonic / Radar River Stage</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Non-contact 24 GHz FMCW radar water level sensor with ±2mm measurement accuracy over a 0.5 to 30 meter range, immune to debris and surface turbulence.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
            <span className="font-bold text-slate-900">TDR Soil Moisture Saturation</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Multi-depth time-domain reflectometry probes measuring volumetric soil moisture at 20cm, 50cm, and 100cm depths to estimate slope slip risk.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: REST API & Integration Gateway */}
      <section aria-labelledby="api-heading" className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Code className="w-4 h-4 text-blue-700" />
          <h3 id="api-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Developer API & Provider Ingestion Boundary
          </h3>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Authorized disaster management centers, researchers, and NGOs can integrate through our RESTful endpoints:
        </p>

        <div className="space-y-2 font-mono text-[11px]">
          <div className="p-2 bg-slate-900 text-slate-200 rounded flex items-center justify-between">
            <span>GET /api/v1/hazard/risk-summary?state=Uttarakhand&district=Chamoli</span>
            <span className="text-emerald-400 font-bold">200 OK</span>
          </div>
          <div className="p-2 bg-slate-900 text-slate-200 rounded flex items-center justify-between">
            <span>GET /api/v1/providers/health</span>
            <span className="text-cyan-400 font-bold">REGISTRY</span>
          </div>
          <div className="p-2 bg-slate-900 text-slate-200 rounded flex items-center justify-between">
            <span>POST /api/v1/ingestion/jobs</span>
            <span className="text-amber-400 font-bold">AUTH REQ</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/data-sources"
            className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
          >
            <span>Inspect National Provider Health Registry</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
