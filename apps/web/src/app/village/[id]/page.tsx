import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  MapPin, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Home, 
  Waves, 
  CloudRain, 
  Mountain, 
  History, 
  Radio, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export async function generateStaticParams() {
  return [
    { id: 'demo-village-001' },
    { id: 'demo-village-002' },
    { id: 'demo-village-003' },
    { id: 'demo-village-004' },
    { id: 'demo-village-005' },
  ];
}

export default function VillageDossierPage({ params }: { params: { id: string } }) {
  const villageData = {
    id: params.id || 'demo-village-003',
    name: 'Sunderbans Nagar',
    region: 'Upper Himalayan Catchment (Sector 4)',
    lat: 30.5050,
    lon: 79.1550,
    elevation: '1,240 m ASL',
    population: 3400,
    riskScore: 68.5,
    riskLevel: 'HIGH' as const,
    trend: '+14.2 pts (Rising)',
    why: 'Intense orographic precipitation (48mm in 3h) descending on steep 28° slopes with 82% pre-saturated colluvium.',
    primaryDriver: 'Rainfall Accumulation (3h)',
    telemetry: {
      rainfall3h: '48.0 mm',
      soilSaturation: '82% (Critical)',
      riverStage: '3.80 m (+0.40 m/h)',
      catchmentArea: '85.4 km²',
      leadTimeMinutes: 42,
    },
    shelters: [
      { name: 'Community High School Shelter', distance: '1.4 km', elevation: '+120m', status: 'READY', capacity: 450 },
      { name: 'Upper Panchayat Bhavan Center', distance: '2.1 km', elevation: '+85m', status: 'STANDBY', capacity: 300 },
    ],
    incidentHistory: [
      { date: 'Aug 2023', type: 'Flash Flood Watch', outcome: 'River reached 3.9m warning stage; zero casualties.' },
      { date: 'July 2021', type: 'Debris Flow Advisory', outcome: 'Tributary channel aggraded 1.2m; culvert cleared.' },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="village" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  LOCAL DOSSIER
                </span>
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  {villageData.name} — DIGITAL INTELLIGENCE DOSSIER
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {villageData.region} • Elevation: {villageData.elevation} • Population: {villageData.population.toLocaleString()} residents
              </p>
            </div>

            <div className="flex items-center gap-2">
              <RiskBadge level={villageData.riskLevel} />
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* Master Dossier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Risk, Terrain & Telemetry */}
            <div className="lg:col-span-8 space-y-6">
              {/* Risk Overview Hero */}
              <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black font-mono text-slate-100">
                      {villageData.riskScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">ESTIMATED RISK</div>
                      <div className="text-xs font-mono text-orange-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> {villageData.trend}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lead Time: ~{villageData.telemetry.leadTimeMinutes} min</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-mono font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                    WHY IS RISK ELEVATED IN THIS LOCALITY?
                  </div>
                  <p className="text-slate-200 leading-relaxed text-xs">{villageData.why}</p>
                </div>

                {/* 4 In-Situ Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-[#070d1e] p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">3h Rainfall</div>
                    <div className="text-base font-bold text-cyan-300 mt-0.5">{villageData.telemetry.rainfall3h}</div>
                  </div>
                  <div className="bg-[#070d1e] p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Soil Saturation</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">{villageData.telemetry.soilSaturation}</div>
                  </div>
                  <div className="bg-[#070d1e] p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">River Stage</div>
                    <div className="text-base font-bold text-blue-400 mt-0.5">{villageData.telemetry.riverStage}</div>
                  </div>
                  <div className="bg-[#070d1e] p-3 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Catchment Basin</div>
                    <div className="text-base font-bold text-slate-200 mt-0.5">{villageData.telemetry.catchmentArea}</div>
                  </div>
                </div>
              </div>

              {/* Incident & Historical Memory */}
              <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-xl space-y-3 text-xs">
                <div className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2 border-b border-slate-800 pb-2">
                  <History className="w-4 h-4 text-purple-400" />
                  HISTORICAL LOCAL INCIDENTS & MEMORY
                </div>
                <div className="space-y-2">
                  {villageData.incidentHistory.map((inc, i) => (
                    <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-cyan-400 text-[10px] font-bold">{inc.date}</span>
                        <div className="font-semibold text-slate-200 text-xs mt-0.5">{inc.type}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{inc.outcome}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Candidate Shelters & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-5 space-y-4 shadow-2xl text-xs">
                <div className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  DESIGNATED CANDIDATE SHELTERS
                </div>

                <div className="space-y-3">
                  {villageData.shelters.map((sh, idx) => (
                    <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-100 text-xs">{sh.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono text-[9px] font-bold">
                          {sh.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Distance: {sh.distance} • Elevation: {sh.elevation} • Cap: {sh.capacity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <Link
                    href="/safety"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg text-xs"
                  >
                    <Compass className="w-4 h-4" />
                    <span>LAUNCH MY SAFETY ESCAPE HUD</span>
                  </Link>

                  <Link
                    href="/ledger"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg font-mono text-[11px] flex items-center justify-center gap-1.5 transition text-center"
                  >
                    INSPECT PREDICTION LEDGER
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
