'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Layers, MapPin, Calendar, BookOpen, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function EventMemoryPage() {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  const eventDossiers = [
    {
      id: '2013_uttarakhand_kedarnath',
      name: '2013 Uttarakhand / Kedarnath Multi-Hazard Disaster',
      country: 'India',
      region: 'Rudraprayag / Garhwal Himalayas',
      date: 'June 15–17, 2013',
      type: 'FLASH_FLOOD & GLOF',
      status: 'VERIFIED',
      primaryCause: 'Synoptic collision of Western Disturbance with early Monsoon trough + Chorabari Lake moraine breach.',
      hazardChain: [
        'Multi-day extreme orographic rainfall (>325mm/24h) + rapid late-spring snowpack melt',
        'Saturation overland flow triggering widespread debris flows in Mandakini valley',
        'Moraine-dam failure at Chorabari Lake releasing ~0.4M m³ high-energy water pulse',
        'Hyper-concentrated debris flow devastating Kedarnath town and Rambara',
        'Downstream riverbed aggradation and bridge washouts along Alaknanda corridor',
      ],
      officialCasualties: '6,054 dead/missing (NDMA / Govt of Uttarakhand Official Gazette)',
      authoritativeSources: ['NDMA India', 'India Meteorological Department (IMD)', 'WIHG', 'NRSC / ISRO'],
      lessons: [
        'Need for micro-watershed antecedent precipitation tracking rather than regional averages',
        'Glacial moraine lakes require automated acoustic/satellite tripwires',
        'Evacuation plans must account for narrow valley road bottlenecks',
      ],
    },
    {
      id: '2021_chamoli_rishiganga',
      name: '2021 Chamoli Rock-Ice Avalanche & Debris Surge',
      country: 'India',
      region: 'Chamoli District, Uttarakhand',
      date: 'February 7, 2021',
      type: 'GLOF / CRYOSPHERIC AVALANCHE',
      status: 'VERIFIED',
      primaryCause: 'Catastrophic detachment of 27M m³ rock-ice wedge from Ronti peak (Zero rainfall trigger).',
      hazardChain: [
        'Permafrost warming and debuttressing of 5,600m rock-ice face on Ronti Peak',
        '1,800m vertical fall pulverizing ice into frictional slurry within minutes',
        'Hyper-velocity debris surge down Ronti Gad and Rishiganga (>20 m/s)',
        'Total destruction of Rishiganga 13.2 MW Small Hydro Project',
        'Surge inundating Tapovan Vishnugad 520 MW headrace tunnels',
      ],
      officialCasualties: '204 fatalities/missing (NDRF / SEOC Uttarakhand / NIDM)',
      authoritativeSources: ['Science / Nature (Shugar et al., 2021)', 'NIDM', 'NDRF', 'GSI', 'CSIR-NGRI'],
      lessons: [
        'Rainfall-only alert systems completely fail on cryospheric mass movements',
        'Seismic tremor pattern classification can provide 10-15 min lead times',
        'Hydropower projects require automated upstream radar barriers',
      ],
    },
    {
      id: '2021_nepal_melamchi',
      name: '2021 Nepal Melamchi Cascading Debris Flood',
      country: 'Nepal',
      region: 'Sindhupalchok District, Bagmati Province',
      date: 'June 15 – Aug 1, 2021',
      type: 'DEBRIS_FLOOD',
      status: 'VERIFIED',
      primaryCause: 'High pre-monsoon saturation + massive Bhemathang landslide dam failure.',
      hazardChain: [
        'Pre-monsoon soil saturation 129% above normal',
        'Bhemathang high plateau landslide dumping 10-15M m³ debris into upper Melamchi gorge',
        'Temporary river damming followed by explosive hydraulic breach',
        'Sediment burial at Ambathan headworks of Melamchi Water Supply Project',
        'Destruction of Melamchi Bazaar settlement and 18 bridges',
      ],
      officialCasualties: '21 dead/missing (DHM Nepal / MoHA Nepal / ICIMOD)',
      authoritativeSources: ['DHM Nepal', 'MoHA / NDRRMA Nepal', 'ICIMOD', 'World Bank GFDRR'],
      lessons: [
        'Sediment volume can vastly exceed water volume in high-altitude cascades',
        'Post-earthquake weakened slopes require continuous SAR monitoring',
        'Transboundary and upper catchment alerts save lives downstream',
      ],
    },
    {
      id: '2023_nepal_events',
      name: '2023 Nepal Flash Flood Multi-Event Catalog',
      country: 'Nepal',
      region: 'Eastern Nepal (Sankhuwasabha) & Mustang (Kagbeni)',
      date: 'June – August 2023',
      type: 'FLASH_FLOOD & LDOF',
      status: 'VERIFIED',
      primaryCause: 'Early monsoon steep cloudbursts (Hewa Khola) + Rain-shadow scree LDOF (Kagbeni).',
      hazardChain: [
        'Localized cloudburst on Hewa Khola causing 33 casualties at Super Hewa HEP',
        'Scree collapse in Jhong Khola canyon triggering Kagbeni barrier outburst',
        'Zero Kagbeni casualties due to rapid community phone chain warning',
        'Fluvial plain inundation in Western Nepal (Sudurpashchim)',
      ],
      officialCasualties: '33 in Hewa Khola (5 confirmed, 28 missing); 0 in Kagbeni (NDRRMA)',
      authoritativeSources: ['NDRRMA Nepal', 'DHM Nepal', 'IPPAN', 'Kathmandu Post'],
      lessons: [
        'Low absolute rainfall (25-40mm) in arid scree zones can trigger destructive LDOFs',
        'Early-monsoon workforce camps require localized hydro-meteorological tripwires',
      ],
    },
    {
      id: '2026_nepal_bhote_koshi',
      name: '2026 Nepal Bhote Koshi / Rasuwa Cascading Disaster',
      country: 'Nepal (Origin: Tibet)',
      region: 'Rasuwa District, Bagmati Province',
      date: 'August 26–28, 2026 (Active)',
      type: 'TRANSBOUNDARY GLOF',
      status: 'PRELIMINARY',
      primaryCause: 'Catastrophic ~600m rock-ice avalanche in Lhende Khola (Tibet) triggering barrier breach into Bhote Koshi.',
      hazardChain: [
        'High-altitude Tibetan wedge detachment into Lhende Khola gorge',
        'Temporary high-head barrier lake formation and violent burst',
        'Transboundary surge crossing border at Rasuwagadhi (~08:40 AM)',
        'Destruction of Miteri Bridge, border dry port, and Timure police post',
        'Surge wave propagating 8-12m high downstream into Trishuli corridor',
      ],
      officialCasualties: '547+ reported dead/missing (Preliminary / Active SAR Operation)',
      authoritativeSources: ['DHM Nepal', 'NDRRMA Nepal', 'Nepal Army', 'ICIMOD', 'USGS'],
      lessons: [
        'Sudden sensor communication termination must trigger an automated CRITICAL alarm',
        'Cross-border telemetry data exchange is vital for Himalayan gorge safety',
        'Downstream evacuation lead time strictly governed by gorge flow velocities (15-25 m/s)',
      ],
    },
  ];

  const current = eventDossiers[selectedEventIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="HISTORICAL" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="events" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3a506b] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                  KNOWLEDGE BASE
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  HISTORICAL EVENT MEMORY & CASE DOSSIERS
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Verified empirical case studies, hazard chains, official casualty counts, and model lessons
              </p>
            </div>
            <DataModeBadge mode="HISTORICAL" />
          </div>

          {/* Event Selector Horizontal Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-1 text-xs">
            {eventDossiers.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventIndex(idx)}
                className={`px-3.5 py-2.5 rounded-lg border shrink-0 transition font-medium text-left ${
                  selectedEventIndex === idx
                    ? 'bg-blue-600/30 border-cyan-400 text-cyan-200 font-bold shadow-md'
                    : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400">{ev.country} • {ev.date}</div>
                <div className="text-xs font-semibold mt-0.5">{ev.name.split(' ')[0]} {ev.name.split(' ')[1]}</div>
              </button>
            ))}
          </div>

          {/* Active Event Dossier Details */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-4 gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{current.country} • {current.region}</span>
                <h2 className="text-lg font-bold text-slate-100 mt-0.5">{current.name}</h2>
                <div className="text-xs text-slate-400 font-mono mt-1">Event Type: {current.type} | Date: {current.date}</div>
              </div>
              <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                current.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {current.status}
              </span>
            </div>

            {/* Primary Cause & Casualties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px]">Primary Physical Cause:</div>
                <p className="text-slate-200 leading-relaxed">{current.primaryCause}</p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="font-semibold text-rose-400 uppercase tracking-wider text-[11px]">Official Impact / Casualties:</div>
                <p className="text-slate-200 font-mono text-xs leading-relaxed">{current.officialCasualties}</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Sources: {current.authoritativeSources.join(', ')}
                </div>
              </div>
            </div>

            {/* Hazard Chain */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Physical Hazard Chain Sequence:
              </div>
              <div className="space-y-1.5">
                {current.hazardChain.map((step, i) => (
                  <div key={i} className="bg-slate-900/70 p-2.5 rounded border border-slate-800 text-slate-200 font-mono text-[11px]">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Model Lessons */}
            <div className="bg-[#141d38] p-4 rounded-lg border border-slate-700/80 space-y-2 text-xs">
              <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Scientific & Operational Lessons for FloodGuard AI:
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside leading-relaxed text-xs">
                {current.lessons.map((ls, idx) => (
                  <li key={idx}>{ls}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
