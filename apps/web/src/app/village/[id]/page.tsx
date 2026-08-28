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
      { date: 'Jul 2021', type: 'Debris Flow Advisory', outcome: 'Precautionary evacuation of 120 residents along riverbank.' },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="village" />

        <main className="flex-1 p-5 lg:p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-demo">MICRO-WATERSHED DOSSIER</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  {villageData.name} ({villageData.id})
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {villageData.region} • Elevation: {villageData.elevation} • Population: {villageData.population.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <RiskBadge level={villageData.riskLevel} />
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* Master 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Risk & Physical Drivers (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="fp fp-operational rounded-3xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">REAL-TIME RISK ENGINE</span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">{villageData.trend}</span>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">COMPOSITE RISK INDEX</div>
                  <div className="text-4xl font-black text-white font-mono">{villageData.riskScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
                  <div className="text-xs font-mono text-amber-300 font-bold">HIGH FLASH SURGE THRESHOLD</div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="text-cyan-300 font-bold uppercase text-[10px]">WHY IS RISK ELEVATED?</div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">{villageData.why}</p>
                </div>
              </div>

              {/* Physical Telemetry Grid */}
              <div className="fp rounded-3xl p-6 space-y-3 shadow-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                  IN-SITU HYDRO-METEOROLOGICAL TELEMETRY
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">Rainfall (3h)</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">{villageData.telemetry.rainfall3h}</div>
                  </div>
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">Soil Saturation</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">{villageData.telemetry.soilSaturation}</div>
                  </div>
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">River Stage</div>
                    <div className="text-blue-300 font-bold text-sm mt-0.5">{villageData.telemetry.riverStage}</div>
                  </div>
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">Lead Time Advance</div>
                    <div className="text-emerald-300 font-bold text-sm mt-0.5">{villageData.telemetry.leadTimeMinutes} min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Candidate Shelters & Historical Precedents (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="fp fp-operational rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Home className="w-4 h-4 text-cyan-400" />
                    CANDIDATE ELEVATED SHELTERS
                  </h3>
                  <Link href="/safety" className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1 font-bold">
                    <span>VIEW ROUTES</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {villageData.shelters.map((sh, idx) => (
                    <div key={idx} className="fp p-4 rounded-2xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-white text-sm">{sh.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          Distance: {sh.distance} • Gradient: {sh.elevation} • Cap: {sh.capacity}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-lg font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                        {sh.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Precedents */}
              <div className="fp rounded-3xl p-6 space-y-3 shadow-2xl">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  HISTORICAL DISASTER PRECEDENTS
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  {villageData.incidentHistory.map((inc, i) => (
                    <div key={i} className="fp p-3 rounded-2xl space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{inc.type}</span>
                        <span className="text-purple-300 font-bold">{inc.date}</span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs">{inc.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
