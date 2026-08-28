import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Home, Compass, CloudRain, Waves } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { RiskBadge } from '@/components/ui/Badges';

// Required for next static export — pre-renders known demo village IDs
export function generateStaticParams() {
  return [
    { id: 'demo-village-001' },
    { id: 'demo-village-002' },
    { id: 'demo-village-003' },
    { id: 'demo-village-004' },
    { id: 'demo-village-005' },
  ];
}

export default function VillageIntelligencePage({ params }: { params: { id: string } }) {
  const villageData = {
    id: params.id || 'demo-village-003',
    name: 'Sunderbans Nagar (Exposure Target)',
    district: 'Demo Hill District',
    state: 'Demo Himalayan State',
    elevation: '720m ASL',
    slope: '12° (Valley Base)',
    population: 3400,
    riskScore: 68.5,
    riskLevel: 'HIGH' as const,
    whyChanged:
      'Precipitation upstream reached 48mm in 3h on pre-saturated slopes (82% soil moisture), accelerating runoff toward the valley channel.',
    observedData: [
      { param: 'Rainfall (3h)', value: '48.0 mm', state: 'OBSERVED' },
      { param: 'River Gauge Level', value: '3.80 m (+0.40m/h)', state: 'OBSERVED' },
      { param: 'Soil Saturation', value: '82%', state: 'MODEL_INFERRED' },
      { param: 'Catchment Area', value: '85.4 km²', state: 'OBSERVED DEM' },
    ],
    shelters: [
      { name: 'Community High School Shelter', capacity: 450, elevation: '840m', status: 'READY' },
      { name: 'Panchayat Bhavan Center', capacity: 250, elevation: '1260m', status: 'STANDBY' },
    ],
    candidateRoutes: [
      { name: 'North Ridge Trail', status: 'CANDIDATE', note: 'Candidate route — safety not verified (inspect KM 0.6 culvert)' },
      { name: 'Riverbed Bypass NH Link', status: 'BLOCKED', note: 'High Inundation Risk — River Surge Zone' },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="map" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <Link href="/map/" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="w-4 h-4" /> Back to GIS Map
          </Link>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1c2541] border border-[#3a506b] rounded-xl p-5 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-400" />
                <h1 className="text-lg font-bold text-slate-100">{villageData.name}</h1>
                <RiskBadge level={villageData.riskLevel} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {villageData.district}, {villageData.state} | Population: {villageData.population.toLocaleString()} |
                Elevation: {villageData.elevation}
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950 border border-cyan-800 px-3 py-1.5 rounded">
              RISK: {villageData.riskScore}/100
            </span>
          </div>

          {/* Situation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-4 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Current Situation:</div>
              <p className="text-slate-200 leading-relaxed">
                Village is situated on an alluvial cone at the outlet of a 85.4 km² steep catchment. Active flash flood watch is in effect due to rapid hydrograph rise upstream.
              </p>
            </div>
            <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-4 space-y-2 text-xs">
              <div className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">Why It Changed:</div>
              <p className="text-slate-200 leading-relaxed">{villageData.whyChanged}</p>
            </div>
          </div>

          {/* Telemetry Matrix */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Observed & Inferred Telemetry</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {villageData.observedData.map((d, i) => (
                <div key={i} className="bg-slate-900/80 p-3 rounded border border-slate-800">
                  <div className="text-slate-400 text-[11px]">{d.param}</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 my-0.5">{d.value}</div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{d.state}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shelters & Routes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Home className="w-4 h-4" /> Designated Relief Shelters
              </h3>
              <div className="space-y-2">
                {villageData.shelters.map((sh, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-200">{sh.name}</div>
                      <div className="text-[11px] text-slate-400">Cap: {sh.capacity} | Elev: {sh.elevation}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px]">
                      {sh.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Candidate Evacuation Paths
              </h3>
              <div className="space-y-2">
                {villageData.candidateRoutes.map((rt, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-200">{rt.name}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                          rt.status === 'CANDIDATE'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {rt.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">{rt.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
