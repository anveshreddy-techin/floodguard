'use client';

import React, { useState } from 'react';
import { useAdaptive, UserRole } from '@/context/AdaptiveContext';
import {
  ShieldAlert, Compass, Activity, Users, Building, Globe,
  HeartPulse, Brain, Database, ShieldCheck, PhoneCall, Radio,
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap,
  Droplets, Waves, Stethoscope, RefreshCw, Send, Download,
  Layers, MapPin, Search, Check, Flame, Clock, Lock
} from 'lucide-react';
import Link from 'next/link';

export const ROLE_DEFINITIONS: {
  id: UserRole;
  title: string;
  badge: string;
  icon: any;
  color: string;
  desc: string;
  statutoryAgency: string;
}[] = [
  {
    id: 'CITIZEN',
    title: 'Public Viewer / Citizen',
    badge: '🏠 CITIZEN',
    icon: Compass,
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
    desc: 'Hyper-local safety instructions, nearest elevated high ground, and 1-tap offline emergency calling.',
    statutoryAgency: 'Gram Panchayat & Citizen Self-Protection Tier',
  },
  {
    id: 'VILLAGE_OPERATOR',
    title: 'Village Operator / Sarpanch',
    badge: '🌾 VILLAGE OPERATOR',
    icon: Building,
    color: 'text-lime-400 border-lime-500/40 bg-lime-950/20',
    desc: 'Local staff gauge logging, automated vernacular PA speaker siren triggers, and village shelter muster.',
    statutoryAgency: 'Village Disaster Management Committee (VDMC)',
  },
  {
    id: 'FIELD_RESPONDER',
    title: 'Field Responder (NDRF / SDRF / QRT)',
    badge: '🚒 FIELD RESPONDER',
    icon: ShieldAlert,
    color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
    desc: 'Tactical SAR grid coordinates, boat & drone tracking, live SOS dispatch queue, and triage checklist.',
    statutoryAgency: 'National Disaster Response Force (NDRF) / State SDRF',
  },
  {
    id: 'DISTRICT_OPERATOR',
    title: 'District EOC Operator (DEOC)',
    badge: '🏢 DISTRICT EOC',
    icon: Activity,
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
    desc: 'Block-wise risk aggregation, CAP alert distribution, inter-departmental relief coordination, and shelter quotas.',
    statutoryAgency: 'District Disaster Management Authority (DDMA)',
  },
  {
    id: 'STATE_OPERATOR',
    title: 'State SEOC Commander',
    badge: '🏛️ STATE SEOC',
    icon: Globe,
    color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20',
    desc: 'Inter-district resource balancing, major reservoir spillway release clearance, and Chief Minister executive briefs.',
    statutoryAgency: 'State Disaster Management Authority (SDMA / SEOC)',
  },
  {
    id: 'MEDICAL_OFFICER',
    title: 'MO (Medical Officer / Health Command)',
    badge: '🏥 MEDICAL OFFICER',
    icon: Stethoscope,
    color: 'text-pink-400 border-pink-500/40 bg-pink-950/20',
    desc: 'Hospital & ICU bed surge tracking, post-flood water-borne disease surveillance, casualty triaging, and mobile medical units.',
    statutoryAgency: 'Directorate of Health Services & Integrated Disease Surveillance (IDSP)',
  },
  {
    id: 'NATIONAL_OPERATOR',
    title: 'National NDMA Commander',
    badge: '🇮🇳 NATIONAL NDMA',
    icon: Zap,
    color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
    desc: 'Pan-India multi-hazard threat dashboard, 16 NDRF battalions mobilization, and transboundary river basin sync.',
    statutoryAgency: 'National Disaster Management Authority (NDMA / NEOC, MHA)',
  },
  {
    id: 'ANALYST',
    title: 'GIS / ML Analyst',
    badge: '📊 GIS/ML ANALYST',
    icon: Brain,
    color: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
    desc: 'SAR flood inundation rasters, SHAP feature importance, radar QPE gauge calibration, and slope morphometry.',
    statutoryAgency: 'NRSC/ISRO, IMD Research, & Flood Modeling Cell',
  },
  {
    id: 'RESEARCHER',
    title: 'Hydrology / Climate Researcher',
    badge: '🔬 RESEARCHER',
    icon: Database,
    color: 'text-blue-400 border-blue-500/40 bg-blue-950/20',
    desc: 'Historical hindcast back-testing (Kedarnath/Chamoli/Teesta), extreme stress lab simulations, and dataset exports.',
    statutoryAgency: 'Academic Research & National Institute of Hydrology (NIH)',
  },
  {
    id: 'ADMIN',
    title: 'System Administrator',
    badge: '⚙️ ADMIN GOVERNANCE',
    icon: ShieldCheck,
    color: 'text-slate-300 border-slate-700 bg-slate-900/50',
    desc: 'Provider API key quotas, IoT LoRaWAN hardware heartbeats, RBAC governance, and audit trails.',
    statutoryAgency: 'NIC Disaster Tech Division & FloodGuard Ops',
  },
];

export const RoleWorkspaceView: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { role, setRole, operatingMode, language } = useAdaptive();
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Active Role Object
  const currentRoleObj = ROLE_DEFINITIONS.find((r) => r.id === role) || ROLE_DEFINITIONS[3];

  const triggerRoleAction = (actionName: string) => {
    setActionFeedback(`Executing: "${actionName}"... Status: SUCCESS (Audit logged under ${role})`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className={`space-y-6 select-none font-sans ${className}`}>
      
      {/* ── Top Role Switcher Header ── */}
      <div className="fp fp-operational p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="text-sm font-black font-mono uppercase tracking-wider text-white">
                Role-Adaptive Mission Control Interface
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Tailored workspaces for 10 statutory disaster management tiers in India
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-400">ACTIVE ROLE:</span>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${currentRoleObj.color}`}>
              {currentRoleObj.badge}
            </span>
          </div>
        </div>

        {/* 10 Role Selector Horizontal Buttons */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {ROLE_DEFINITIONS.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition flex items-center gap-2 active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{r.title.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
          <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-300 font-bold">VERIFIED</span>
        </div>
      )}

      {/* ── DYNAMIC ROLE CONTENT ── */}

      {/* 1. CITIZEN / PUBLIC VIEWER */}
      {(role === 'CITIZEN' || role === 'VIEWER') && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">CITIZEN SAFETY HUD</span>
                <h3 className="text-lg font-black text-white">Immediate Escape & High Ground Guidance</h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-black animate-pulse">
                SAFE ROUTE ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">RECOMMENDED DESTINATION</span>
                <div className="text-base font-bold text-white mt-1">Community High School Shelter</div>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">+120m Elevation · 500m distance</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">ESTIMATED EVACUATION TIME</span>
                <div className="text-xl font-black text-cyan-300 mt-1 font-mono">8 - 12 MIN</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">North Ridge Trail (Avoid Riverbank)</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-900/50">
                <span className="text-[10px] text-rose-300 font-mono">EMERGENCY ASSISTANCE</span>
                <div className="text-sm font-bold text-white mt-1">SDRF Field Helpline: 1070</div>
                <div className="text-xs text-rose-400 font-mono mt-0.5">National Emergency: 112</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/safety"
                className="flex-1 min-w-[200px] py-3 rounded-2xl btn-primary text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
              >
                <Compass className="w-4 h-4 text-cyan-300" />
                <span>OPEN FULL INTERACTIVE ESCAPE MAP</span>
              </Link>
              <button
                onClick={() => triggerRoleAction('Audio Siren Broadcast in Local Language')}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 flex items-center gap-2 active:scale-95 transition"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>🔊 PLAY VERNACULAR AUDIO ALERT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VILLAGE OPERATOR */}
      {role === 'VILLAGE_OPERATOR' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">VILLAGE TARGET</span>
              <div className="text-base font-bold text-white mt-1">Raini Village (Chamoli)</div>
              <div className="text-[10px] text-lime-400">Pop: 1,420 · 284 Households</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RIVER STAFF GAUGE</span>
              <div className="text-xl font-black text-rose-400 mt-1">3.80 m</div>
              <div className="text-[10px] text-rose-300">+0.40m in last 1 hour (RISING)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">VILLAGE SHELTER CAPACITY</span>
              <div className="text-xl font-black text-emerald-400 mt-1">120 / 250</div>
              <div className="text-[10px] text-slate-400">Panchayat Bhavan (48% Full)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">PA SYSTEM SIRENS</span>
              <div className="text-base font-bold text-cyan-300 mt-1">4 / 4 ONLINE</div>
              <div className="text-[10px] text-slate-400">Solar + Battery Backup OK</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-lime-500/30 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Building className="w-4 h-4 text-lime-400" />
              Village Operator Operational Actions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction('Trigger All 4 Village PA Speakers with High Surge Siren')}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                TRIGGER PA SIREN (AUDIO ALERT)
              </button>
              <button
                onClick={() => triggerRoleAction('Log Physical River Staff Gauge Reading (3.85m)')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <RefreshCw className="w-4 h-4" />
                LOG MANUAL GAUGE STICK
              </button>
              <button
                onClick={() => triggerRoleAction('Open Panchayat Bhavan Primary Shelter Muster')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                ACTIVATE SHELTER MUSTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FIELD RESPONDER */}
      {role === 'FIELD_RESPONDER' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">ASSIGNED BATTALION</span>
              <div className="text-base font-bold text-white mt-1">NDRF 8th Battalion</div>
              <div className="text-[10px] text-rose-400">Team Alpha (35 Rescuers)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">INFLATABLE BOATS</span>
              <div className="text-xl font-black text-cyan-300 mt-1">6 DEPLOYED</div>
              <div className="text-[10px] text-slate-400">Oars + Outboard Motors OK</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">TACTICAL SEARCH GRIDS</span>
              <div className="text-xl font-black text-amber-400 mt-1">Sector 2 &amp; 3</div>
              <div className="text-[10px] text-amber-300">Active Mudflow Perimeter</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RESCUE HELPLINE DISPATCH</span>
              <div className="text-xl font-black text-rose-400 mt-1">3 PENDING</div>
              <div className="text-[10px] text-slate-400">Helicopter winch requested</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-rose-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Tactical Field Responder Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction('Dispatch NDRF Team Bravo to Inundated Culvert KM 0.6')}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Zap className="w-4 h-4" />
                DISPATCH BOAT TEAM BRAVO
              </button>
              <Link
                href="/incidents"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Activity className="w-4 h-4" />
                INCIDENT TASK CHECKLIST
              </Link>
              <Link
                href="/missing-persons"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Users className="w-4 h-4" />
                SEARCH &amp; RESCUE GRID LOGS
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. DISTRICT EOC OPERATOR */}
      {role === 'DISTRICT_OPERATOR' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DISTRICT EOC</span>
              <div className="text-base font-bold text-white mt-1">Chamoli DEOC (Joshimath)</div>
              <div className="text-[10px] text-cyan-400">7 Sub-Divisions · 18 Blocks</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">EVACUATION CENTERS</span>
              <div className="text-xl font-black text-emerald-400 mt-1">14 ACTIVE</div>
              <div className="text-[10px] text-slate-400">Total Sheltered: 3,450 / 8,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">BLOCKS AT CRITICAL RISK</span>
              <div className="text-xl font-black text-rose-400 mt-1">3 BLOCKS</div>
              <div className="text-[10px] text-rose-300">Joshimath, Ghat, Dasholi</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">COMMON ALERT PROTOCOL</span>
              <div className="text-base font-bold text-amber-300 mt-1">CAP GATEWAY READY</div>
              <div className="text-[10px] text-slate-400">SMS + Cell Broadcast enabled</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              District EOC Commander Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction('Transmit District-Wide CAP Cell Broadcast Warning')}
                className="p-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Radio className="w-4 h-4" />
                BROADCAST CAP DISTRICT SMS
              </button>
              <button
                onClick={() => triggerRoleAction('Re-allocate 4 SDRF Teams from Gairsain to Tapovan')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                RE-ALLOCATE SDRF RESOURCES
              </button>
              <Link
                href="/incidents"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <ArrowRight className="w-4 h-4" />
                OPEN DEOC INCIDENT DESK
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. STATE SEOC COMMANDER */}
      {role === 'STATE_OPERATOR' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">STATE EOC TIER</span>
              <div className="text-base font-bold text-white mt-1">Uttarakhand USDMA SEOC</div>
              <div className="text-[10px] text-indigo-400">Dehradun State Operations Room</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DAM SPILLWAY CLEARANCE</span>
              <div className="text-base font-bold text-amber-400 mt-1">TEHRI DAM (THDC)</div>
              <div className="text-[10px] text-slate-400">Cleared for 1,200 cumecs release</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">STATE DISASTER RELIEF FUND</span>
              <div className="text-xl font-black text-emerald-400 mt-1">₹45.0 Cr</div>
              <div className="text-[10px] text-slate-400">Emergency Corpus Active</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">AIR FORCE HELI-LIFT</span>
              <div className="text-base font-bold text-cyan-300 mt-1">2 MI-17 ON STANDBY</div>
              <div className="text-[10px] text-slate-400">Jolly Grant Air Base</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-indigo-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              State SEOC Executive Authorization
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction('Authorize Controlled Dam Spillway Discharge at Tehri')}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Droplets className="w-4 h-4" />
                APPROVE DAM SPILLWAY RELEASE
              </button>
              <button
                onClick={() => triggerRoleAction('Generate Executive SitRep for Chief Secretary & Cabinet')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                EXPORT STATE SITREP PDF
              </button>
              <Link
                href="/state/uk"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Building className="w-4 h-4" />
                STATE SEOC DASHBOARD
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. MEDICAL OFFICER (MO) */}
      {role === 'MEDICAL_OFFICER' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DISTRICT HOSPITALS</span>
              <div className="text-base font-bold text-white mt-1">District Hospital Gopeshwar</div>
              <div className="text-[10px] text-pink-400">85 ICU Beds · 12 Ventilators</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">MOBILE MEDICAL UNITS</span>
              <div className="text-xl font-black text-cyan-300 mt-1">4 DISPATCHED</div>
              <div className="text-[10px] text-slate-400">Tapovan, Raini, Joshimath</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">ANTI-VENOM &amp; CHLORINE</span>
              <div className="text-xl font-black text-emerald-400 mt-1">2,400 KITS</div>
              <div className="text-[10px] text-emerald-300">Water Disinfection Stock OK</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">EPIDEMIC SURVEILLANCE</span>
              <div className="text-base font-bold text-amber-300 mt-1">IDSP WATCH ACTIVE</div>
              <div className="text-[10px] text-slate-400">Zero Cholera outbreaks reported</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-pink-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-pink-400" />
              Medical Command &amp; Casualty Triage Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction('Deploy 2 Mobile Health Units with Trauma Kits to Sector 1')}
                className="p-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <HeartPulse className="w-4 h-4" />
                DISPATCH MOBILE HEALTH UNITS
              </button>
              <button
                onClick={() => triggerRoleAction('Dispatch 10,000 Water Purification Chlorine Tablets to Shelters')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Droplets className="w-4 h-4" />
                DISTRIBUTE CHLORINE TABLETS
              </button>
              <button
                onClick={() => triggerRoleAction('Update IDSP Water-Borne Disease Early Warning Registry')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                LOG IDSP EPIDEMIC WATCH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. NATIONAL NDMA COMMANDER */}
      {role === 'NATIONAL_OPERATOR' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">NATIONAL NEOC TIER</span>
              <div className="text-base font-bold text-white mt-1">NDMA New Delhi (MHA)</div>
              <div className="text-[10px] text-amber-400">Pan-India Multi-Hazard Desk</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">NDRF BATTALIONS ACTIVE</span>
              <div className="text-xl font-black text-cyan-300 mt-1">16 BATTALIONS</div>
              <div className="text-[10px] text-slate-400">12,000 Trained Responders</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">TRANSBOUNDARY BASINS</span>
              <div className="text-xl font-black text-rose-400 mt-1">4 MONITORED</div>
              <div className="text-[10px] text-rose-300">Kosi, Gandak, Brahmaputra, Teesta</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">NATIONAL THREAT LEVEL</span>
              <div className="text-base font-bold text-rose-400 mt-1">ELEVATED RED</div>
              <div className="text-[10px] text-slate-400">Monsoon Surge Convergence</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-amber-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              National Commander Strategic Directives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/river-basins"
                className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Waves className="w-4 h-4" />
                PAN-INDIA RIVER BASIN MAP
              </Link>
              <Link
                href="/cross-border"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Globe className="w-4 h-4" />
                CROSS-BORDER NEPAL/BHUTAN
              </Link>
              <button
                onClick={() => triggerRoleAction('Mobilize 2 Reserve Battalions from Bhatinda to Assam/Uttarakhand')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                MOBILIZE RESERVE NDRF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. GIS / ML ANALYST */}
      {role === 'ANALYST' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">ACTIVE ML ENSEMBLE</span>
              <div className="text-base font-bold text-white mt-1">HydraGradient-v9.4</div>
              <div className="text-[10px] text-purple-400">LightGBM + LSTM Hydrodynamic</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">TOP SHAP FEATURE</span>
              <div className="text-base font-bold text-cyan-300 mt-1">Antecedent Moisture (35%)</div>
              <div className="text-[10px] text-slate-400">3h Rain: 30% · Slope: 20%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">SAR SATELLITE PASS</span>
              <div className="text-base font-bold text-emerald-400 mt-1">Sentinel-1A (12m)</div>
              <div className="text-[10px] text-slate-400">VV/VH Dual Polarimetric</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RADAR QPE CALIBRATION</span>
              <div className="text-base font-bold text-white mt-1">r² = 0.912</div>
              <div className="text-[10px] text-cyan-400">Bias Corrected via AWS gauges</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-purple-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              GIS &amp; Machine Learning Analysis Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/map"
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Layers className="w-4 h-4" />
                3D HIGH-RESOLUTION GIS
              </Link>
              <Link
                href="/model-monitoring"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Brain className="w-4 h-4" />
                MODEL DRIFT &amp; SHAP
              </Link>
              <Link
                href="/cascade"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Zap className="w-4 h-4" />
                UPSTREAM CASCADE GRAPH
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 9. RESEARCHER */}
      {role === 'RESEARCHER' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">BENCHMARKED EVENTS</span>
              <div className="text-base font-bold text-white mt-1">5 Major Historicals</div>
              <div className="text-[10px] text-blue-400">Kedarnath, Chamoli, Teesta</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">HINDCAST LEAD TIME</span>
              <div className="text-xl font-black text-cyan-300 mt-1">+48 MIN</div>
              <div className="text-[10px] text-slate-400">Prior to Chamoli bridge breach</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">PROVENANCE LEDGER</span>
              <div className="text-base font-bold text-emerald-400 mt-1">SHA-256 LOCKED</div>
              <div className="text-[10px] text-slate-400">Zero Future-Data Peeking</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">STRESS LAB SCENARIOS</span>
              <div className="text-base font-bold text-amber-300 mt-1">150 mm/h Cloudburst</div>
              <div className="text-[10px] text-slate-400">Synthetic GLOF wave generator</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-blue-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Scientific Research &amp; Forensic Backtesting
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/hindcast"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Clock className="w-4 h-4" />
                HISTORICAL HINDCAST REPLAY
              </Link>
              <Link
                href="/simulation"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Zap className="w-4 h-4" />
                SCENARIO STRESS LAB
              </Link>
              <Link
                href="/ledger"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Database className="w-4 h-4" />
                PREDICTION AUDIT LEDGER
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 10. SYSTEM ADMINISTRATOR */}
      {role === 'ADMIN' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">IOT HARDWARE NODES</span>
              <div className="text-base font-bold text-white mt-1">24 / 25 ONLINE</div>
              <div className="text-[10px] text-cyan-400">LoRaWAN + GSM Gateways</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DATA PROVIDER BOUNDARIES</span>
              <div className="text-base font-bold text-amber-300 mt-1">8 REGISTERED</div>
              <div className="text-[10px] text-slate-400">IMD, CWC, NRSC, Open-Meteo</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RBAC GOVERNANCE</span>
              <div className="text-base font-bold text-emerald-400 mt-1">10 ROLES ENFORCED</div>
              <div className="text-[10px] text-slate-400">PII Masking &amp; Token Audit</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">SYSTEM LATENCY</span>
              <div className="text-xl font-black text-cyan-300 mt-1">12 ms</div>
              <div className="text-[10px] text-emerald-300">FastAPI Edge Proxy OK</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-700 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              System Administration &amp; Governance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/admin"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                ADMIN GOVERNANCE CONSOLE
              </Link>
              <Link
                href="/data-sources"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Database className="w-4 h-4" />
                PROVIDER REGISTRY TABLE
              </Link>
              <Link
                href="/ingestion"
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <RefreshCw className="w-4 h-4" />
                INGESTION JOBS MONITOR
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
