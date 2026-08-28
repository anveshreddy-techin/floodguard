'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { Layers, MapPin, Calendar, BookOpen, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function EventMemoryPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  useEffect(() => {
    setPage('events');
    setMode('HINDCAST');
  }, [setPage, setMode]);

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
      name: '2021 Melamchi Debris Cascade & Headworks Inundation',
      country: 'Nepal',
      region: 'Sindhupalchok District (Bagmati Province)',
      date: 'June 15 & August 1, 2021',
      type: 'DEBRIS FLOW & LANDSLIDE DAM BURST',
      status: 'VERIFIED',
      primaryCause: 'Bhemathang landslide damming Melamchi River followed by cascading breach pulses.',
      hazardChain: [
        'Pre-monsoon extreme rainfall soaking high glacial deposits in upper basin',
        'Massive slope collapse creating temporary debris dam at Bhemathang',
        'Breaching of dam sending multiple sediment-laden pulses downstream',
        'Burial of Melamchi Water Supply Project intake tunnel structure',
        'Severe damage to Melamchi Bazaar bridges and settlements',
      ],
      officialCasualties: '25+ dead/missing, extensive economic displacement (DHM Nepal / ICIMOD)',
      authoritativeSources: ['ICIMOD Assessment Report', 'Department of Hydrology and Meteorology (DHM Nepal)', 'MoHA Nepal'],
      lessons: [
        'Upstream landslide damming poses delayed-surge risk hours after rainfall ends',
        'Critical water/power infrastructure requires multi-tier sediment tripwires',
      ],
    },
    {
      id: '2023_nepal_events',
      name: '2023 Nepal Multi-Event Monsoon Catalog',
      country: 'Nepal',
      region: 'Koshi, Gandaki & Karnali Basins',
      date: 'June–August 2023',
      type: 'MULTI-BASIN FLASH FLOODS',
      status: 'VERIFIED',
      primaryCause: 'Severe localized convective storm cells along the Himalayan front.',
      hazardChain: [
        'Localized cloudburst events (>100mm/1h) in steep catchments',
        'Fast-response flash flooding in ungauged tributaries',
        'Secondary mudflows blocking rural transit corridors',
      ],
      officialCasualties: '70+ casualties across multiple localized flash flood incidents (MoHA Nepal / NDMA)',
      authoritativeSources: ['NDRRMA Nepal', 'ReliefWeb', 'DHM Nepal', 'ICIMOD'],
      lessons: [
        'Ungauged mountain tributaries require physics-based DEM runoff estimation',
        'Decentralized community-level alert beacons are critical where cellular coverage is intermittent',
      ],
    },
    {
      id: '2026_nepal_bhote_koshi',
      name: '2026 Nepal Bhote Koshi / Rasuwa Disaster',
      country: 'Nepal',
      region: 'Rasuwa / Bagmati Province',
      date: 'August 2026 (Preliminary)',
      type: 'TRANS-BOUNDARY GLACIAL OUTBURST',
      status: 'PRELIMINARY',
      primaryCause: 'High-elevation glacial lake expansion and tributary debris pulse.',
      hazardChain: [
        'Anomalous summer isotherm elevation accelerating proglacial lake melt',
        'Lateral moraine slumping into moraine-dammed lake',
        'High-velocity flood wave propagating across international highway border crossing',
      ],
      officialCasualties: 'Preliminary reports under evaluation (Versioned Catalog)',
      authoritativeSources: ['DHM Nepal (Preliminary Bulletins)', 'ICIMOD Cryosphere Monitor'],
      lessons: [
        'Transboundary high-altitude watersheds require cross-border telemetry exchange',
        'Versioned preliminary records must prevent speculative figures from polluting models',
      ],
    },
  ];

  const current = eventDossiers[selectedEventIndex];

  return (
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="HINDCAST" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="events" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-hist">AUTHORITATIVE CORPUS</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  HISTORICAL EVENT MEMORY & PHYSICAL DOSSIERS
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Authoritative disaster catalog powering FloodGuard AI's hindcast validation and continuous learning
              </p>
            </div>
            <DataModeBadge mode="HINDCAST" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Event Selector List (4 Cols) */}
            <div className="lg:col-span-4 space-y-2.5">
              {eventDossiers.map((ev, idx) => {
                const isSelected = selectedEventIndex === idx;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventIndex(idx)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'fp-historical ring-2 ring-purple-400 shadow-xl scale-[1.01]'
                        : 'fp hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-300">{ev.date}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        ev.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">{ev.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ev.region}</div>
                  </button>
                );
              })}
            </div>

            {/* Event Detail View (8 Cols) */}
            <div className="lg:col-span-8 fp fp-historical rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">{current.type}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono text-slate-400">{current.region}</span>
                </div>
                <h2 className="text-xl font-black text-white">{current.name}</h2>
              </div>

              {/* Primary Cause */}
              <div className="fp p-4 rounded-2xl space-y-1 text-xs">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">PRIMARY CAUSAL MECHANISM</span>
                <p className="text-slate-200 leading-relaxed font-sans">{current.primaryCause}</p>
              </div>

              {/* Physical Hazard Chain */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block">
                  PHYSICAL HAZARD PROPAGATION SEQUENCE
                </span>
                <div className="space-y-2 text-xs font-mono">
                  {current.hazardChain.map((step, i) => (
                    <div key={i} className="fp p-3 rounded-xl text-slate-200 flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold shrink-0">0{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Casualties & Sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="fp p-4 rounded-2xl space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">OFFICIAL CASUALTIES (GOVT GAZETTE)</div>
                  <div className="text-slate-200 font-bold">{current.officialCasualties}</div>
                </div>
                <div className="fp p-4 rounded-2xl space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">AUTHORITATIVE SOURCES</div>
                  <div className="text-cyan-300">{current.authoritativeSources.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
