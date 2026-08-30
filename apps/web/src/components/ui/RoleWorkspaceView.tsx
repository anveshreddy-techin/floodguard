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

// State-Specific Dams, Hospitals & SDRF Battalions
const STATE_INFRA_REGISTRY: Record<string, { dam: string; hospital: string; sdrf: string }> = {
  Telangana: {
    dam: 'Kaleshwaram Barrage & Medigadda / Srisailam · 42 Gates Regulated',
    hospital: 'Osmania & Gandhi Hospital / Bhadrachalam Area Hospital',
    sdrf: 'TS-SDRF 1st Battalion & 10th NDRF Vijayawada Unit',
  },
  Kerala: {
    dam: 'Idukki & Mullaperiyar Dams · Blue Alert Buffer Protocol',
    hospital: 'Wayanad District Hospital Mananthavady & Kozhikode MCH',
    sdrf: 'Kerala Fire & Rescue SDRF & 4th NDRF Arakkonam Unit',
  },
  Maharashtra: {
    dam: 'Koyna & Khadakwasla Reservoirs · 18,500 cumecs Controlled Outflow',
    hospital: 'KEM Hospital Mumbai & Chiplun Sub-District Civil Hospital',
    sdrf: 'Maharashtra SDRF & 5th NDRF Pune Battalion',
  },
  Assam: {
    dam: 'Ranganadi & Subansiri Lower Dams · Surcharge Buffer Active',
    hospital: 'Gauhati Medical College (GMCH) & Assam Medical College Dibrugarh',
    sdrf: 'Assam SDRF Riverine Rescue & 1st NDRF Guwahati Battalion',
  },
  Uttarakhand: {
    dam: 'Tehri Dam (THDC) · Cleared for 1,200 cumecs Controlled Spill',
    hospital: 'District Hospital Gopeshwar & AIIMS Rishikesh Trauma Wing',
    sdrf: 'Uttarakhand SDRF High-Altitude Team & 8th NDRF Battalion',
  },
  'Himachal Pradesh': {
    dam: 'Bhakra & Pong Dams (BBMB) · 45,000 cusecs Regulated Outflow',
    hospital: 'IGMC Shimla & Kullu Zonal Hospital',
    sdrf: 'HP-SDRF Mountain Rescue & 14th NDRF Jaspur Battalion',
  },
  'Jammu & Kashmir': {
    dam: 'Salal & Baglihar Hydel Dams (NHPC) · Spillway Calibrated',
    hospital: 'SMHS Hospital Srinagar & GMC Jammu',
    sdrf: 'J&K SDRF Quick Reaction & 13th NDRF Ladpura Battalion',
  },
  Sikkim: {
    dam: 'Teesta-V & Chungthang Barrage · Stage Level Automated Warning',
    hospital: 'STNM Multi-Speciality Hospital Gangtok & Mangan District Hospital',
    sdrf: 'Sikkim SDRF Mountain Rescue & 2nd NDRF Siliguri Base',
  },
  Odisha: {
    dam: 'Hirakud Dam (28 Gates Opened) · 4.5 Lakh cusecs Discharge',
    hospital: 'SCB Medical College Cuttack & AIIMS Bhubaneswar',
    sdrf: 'ODRAF (Odisha Disaster Rapid Action Force) & 3rd NDRF Mundali',
  },
  Bihar: {
    dam: 'Kosi Barrage Birpur (56 Gates) · 3.2 Lakh cusecs Wave Routing',
    hospital: 'PMCH Patna & Darbhanga Medical College Hospital (DMCH)',
    sdrf: 'Bihar SDRF Inflatable Boat Fleet & 9th NDRF Bihta Battalion',
  },
  'West Bengal': {
    dam: 'Durgapur Barrage & DVC Dams · Surcharge Inundation Routing',
    hospital: 'Diamond Harbour District Hospital & SSKM Hospital Kolkata',
    sdrf: 'West Bengal Disaster Management SDRF & 2nd NDRF Haringhata',
  },
  Karnataka: {
    dam: 'KRS & Almatti Reservoirs · Regulated Downstream Discharge',
    hospital: 'Victoria Hospital Bengaluru & Madikeri District Hospital',
    sdrf: 'Karnataka State SDRF & 10th NDRF Regional Unit',
  },
  'Tamil Nadu': {
    dam: 'Mettur Dam & Chembarambakkam Sluices · Estuary Lock Protocol',
    hospital: 'Rajiv Gandhi Government General Hospital (RGGGH) Chennai',
    sdrf: 'Tamil Nadu SDRF Coastal Team & 4th NDRF Arakkonam Battalion',
  },
  'Madhya Pradesh': {
    dam: 'Indira Sagar & Omkareshwar (NHDC) · Sluice Discharge Protocol',
    hospital: 'Hamidia Hospital Bhopal & Hoshangabad District Hospital',
    sdrf: 'MP-SDRF Riverine Unit & 11th NDRF Varanasi Base',
  },
};

export const RoleWorkspaceView: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    role,
    setRole,
    operatingMode,
    language,
    hierarchy,
    selectedLocation,
    activeHazards,
    regionalModel
  } = useAdaptive();

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Active Role Object
  const currentRoleObj = ROLE_DEFINITIONS.find((r) => r.id === role) || ROLE_DEFINITIONS[3];

  // Location-specific variables
  const locName = selectedLocation.name;
  const locState = selectedLocation.state;
  const locRegion = selectedLocation.region;
  const locElevation = selectedLocation.elevation;
  const locPop = selectedLocation.population.toLocaleString('en-IN');
  const locRisk = selectedLocation.riskLevel;
  const locScore = selectedLocation.riskScore;
  const locRiver = selectedLocation.riverStage;
  const locRain = selectedLocation.rainfall3h;
  const locSoil = selectedLocation.soilMoisture;
  const locHazard = selectedLocation.primaryHazard;
  const locAgency = selectedLocation.authoritativeAgency;

  // Infrastructure lookup with dynamic fallback
  const infra = STATE_INFRA_REGISTRY[locState] || {
    dam: `${locState} Principal River Barrage · Sluice Protocol Active`,
    hospital: `${locRegion.split('(')[0]} District Civil & Trauma Hospital`,
    sdrf: `${locState} SDRF & NDRF Quick Response Battalion`,
  };

  const triggerRoleAction = (actionName: string) => {
    setActionFeedback(`Executing for [${locName} (${locState})]: "${actionName}"... Status: SUCCESS (Audit logged under ${role})`);
    setTimeout(() => setActionFeedback(null), 4500);
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
                Location-Adaptive Mission Control Interface
              </h2>
            </div>
            <p className="text-xs text-cyan-300 mt-0.5 font-mono">
              📍 Synchronized to: <strong className="text-white">{locName}</strong> ({locState} · {locRegion.split('(')[0]})
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
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-300 font-bold shrink-0">VERIFIED</span>
        </div>
      )}

      {/* ── DYNAMIC ROLE CONTENT ── */}

      {/* 1. CITIZEN / PUBLIC VIEWER */}
      {(role === 'CITIZEN' || role === 'VIEWER') && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  {locState.toUpperCase()} CITIZEN SAFETY HUD
                </span>
                <h3 className="text-lg font-black text-white">{locName} · High-Ground Guidance</h3>
              </div>
              <span className={`px-3 py-1 rounded-xl font-mono text-xs font-black animate-pulse ${
                locRisk === 'EXTREME' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
              }`}>
                {locRisk} RISK ({locScore}/100)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">RECOMMENDED HIGH-GROUND SHELTER</span>
                <div className="text-base font-bold text-white mt-1">{locName.split('/')[0]} Community Shelter</div>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">{locElevation} · +120m Elevation Gain</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">PRIMARY LOCAL THREAT</span>
                <div className="text-sm font-bold text-rose-300 mt-1">{locHazard}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">River: {locRiver}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-900/50">
                <span className="text-[10px] text-rose-300 font-mono">{locState.toUpperCase()} DISASTER HELPLINE</span>
                <div className="text-sm font-bold text-white mt-1">State SDRF Desk: 1070</div>
                <div className="text-xs text-rose-400 font-mono mt-0.5">Emergency All-India: 112</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/safety"
                className="flex-1 min-w-[200px] py-3 rounded-2xl btn-primary text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
              >
                <Compass className="w-4 h-4 text-cyan-300" />
                <span>OPEN INTERACTIVE ESCAPE MAP FOR {locName.toUpperCase()}</span>
              </Link>
              <button
                onClick={() => triggerRoleAction(`Broadcast Vernacular Voice Siren across ${locName}`)}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 flex items-center gap-2 active:scale-95 transition"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>🔊 PLAY LOCALIZED AUDIO ALERT</span>
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
              <span className="text-[10px] text-slate-400">ASSIGNED VILLAGE / WARD</span>
              <div className="text-base font-bold text-white mt-1 truncate">{locName.split('/')[0]}</div>
              <div className="text-[10px] text-lime-400">Pop: {locPop} ({locState})</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">LOCAL RIVER / DRAINAGE STAGE</span>
              <div className="text-xl font-black text-rose-400 mt-1">{locRiver}</div>
              <div className="text-[10px] text-rose-300">Rainfall: {locRain} in 3h</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RELIEF SHELTER MUSTER</span>
              <div className="text-xl font-black text-emerald-400 mt-1">180 / 450</div>
              <div className="text-[10px] text-slate-400">Panchayat Bhavan Hall (40% Full)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">LOCAL PA SYSTEM SIRENS</span>
              <div className="text-base font-bold text-cyan-300 mt-1">4 / 4 ONLINE</div>
              <div className="text-[10px] text-slate-400">Solar + Battery Backup OK</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-lime-500/30 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Building className="w-4 h-4 text-lime-400" />
              Village / Ward Operator Operational Actions ({locState})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Trigger Village PA Warning Siren for ${locName}`)}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                TRIGGER PA SIREN (AUDIO ALERT)
              </button>
              <button
                onClick={() => triggerRoleAction(`Log Physical Staff Gauge Reading for ${locName}`)}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <RefreshCw className="w-4 h-4" />
                LOG MANUAL GAUGE STICK
              </button>
              <button
                onClick={() => triggerRoleAction(`Open Primary Shelter Muster at ${locName.split('/')[0]}`)}
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
              <span className="text-[10px] text-slate-400">ASSIGNED RESPONSE BATTALION</span>
              <div className="text-base font-bold text-white mt-1">{infra.sdrf.split('&')[0]}</div>
              <div className="text-[10px] text-rose-400">{locState} Rapid Action Unit</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">INFLATABLE WATER RESCUE BOATS</span>
              <div className="text-xl font-black text-cyan-300 mt-1">8 DEPLOYED</div>
              <div className="text-[10px] text-slate-400">High-power outboard motors ready</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">TACTICAL SEARCH GRIDS</span>
              <div className="text-xl font-black text-amber-400 mt-1">Sector 1 &amp; 2</div>
              <div className="text-[10px] text-amber-300">{locRegion.split('(')[0]} Inundation Zone</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RESCUE HELPLINE DISPATCH</span>
              <div className="text-xl font-black text-rose-400 mt-1">3 ACTIVE</div>
              <div className="text-[10px] text-slate-400">Local emergency priority queue</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-rose-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Tactical Field Responder Actions ({locState} Sector)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Dispatch Rescue Boat Squad to ${locName.split('/')[0]}`)}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Zap className="w-4 h-4" />
                DISPATCH BOAT TEAM ALPHA
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
              <span className="text-[10px] text-slate-400">DISTRICT EOC DESK</span>
              <div className="text-base font-bold text-white mt-1 truncate">{locRegion.split('(')[0]} DEOC</div>
              <div className="text-[10px] text-cyan-400">{locAgency}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">EVACUATION CENTERS</span>
              <div className="text-xl font-black text-emerald-400 mt-1">16 ACTIVE</div>
              <div className="text-[10px] text-slate-400">Total Sheltered: 4,120 / 9,500</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DISTRICT THREAT LEVEL</span>
              <div className="text-xl font-black text-rose-400 mt-1">{locRisk} ({locScore}/100)</div>
              <div className="text-[10px] text-rose-300">{locHazard}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">COMMON ALERT PROTOCOL (CAP)</span>
              <div className="text-base font-bold text-amber-300 mt-1">CAP GATEWAY ACTIVE</div>
              <div className="text-[10px] text-slate-400">SMS + Cell Broadcast enabled</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              District EOC Commander Actions ({locRegion.split('(')[0]}, {locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Transmit CAP Cell Broadcast SMS across ${locRegion.split('(')[0]}`)}
                className="p-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Radio className="w-4 h-4" />
                BROADCAST CAP DISTRICT SMS
              </button>
              <button
                onClick={() => triggerRoleAction(`Re-allocate 4 SDRF Teams across ${locRegion.split('(')[0]}`)}
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
              <span className="text-[10px] text-slate-400">STATE EOC COMMAND</span>
              <div className="text-base font-bold text-white mt-1">{locState} SDMA SEOC</div>
              <div className="text-[10px] text-indigo-400">State Disaster Operations Room</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DAM SPILLWAY CLEARANCE</span>
              <div className="text-base font-bold text-amber-400 mt-1 truncate">{infra.dam.split('·')[0]}</div>
              <div className="text-[10px] text-slate-400">{infra.dam.split('·')[1] || 'Sluice Outflow Protocol'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">STATE RELIEF FUND (SDRF)</span>
              <div className="text-xl font-black text-emerald-400 mt-1">₹50.0 Cr</div>
              <div className="text-[10px] text-slate-400">Emergency Allocation Released</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">AIR FORCE HELI-LIFT</span>
              <div className="text-base font-bold text-cyan-300 mt-1">2 MI-17 HELIS READY</div>
              <div className="text-[10px] text-slate-400">{locState} Air Base Staging</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-indigo-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              State SEOC Executive Authorization ({locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Authorize Controlled Spillway Release for ${infra.dam.split('·')[0]}`)}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Droplets className="w-4 h-4" />
                APPROVE DAM SPILLWAY RELEASE
              </button>
              <button
                onClick={() => triggerRoleAction(`Generate ${locState} Executive SitRep for Chief Secretary & Cabinet`)}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                EXPORT {locState.toUpperCase()} SITREP PDF
              </button>
              <Link
                href={`/state/${locState.toLowerCase().slice(0, 2)}`}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Building className="w-4 h-4" />
                {locState.toUpperCase()} STATE DASHBOARD
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
              <span className="text-[10px] text-slate-400">DESIGNATED DISTRICT HOSPITAL</span>
              <div className="text-base font-bold text-white mt-1 truncate">{infra.hospital.split('/')[0]}</div>
              <div className="text-[10px] text-pink-400">120 ICU Beds · 24 Ventilators</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">MOBILE MEDICAL UNITS</span>
              <div className="text-xl font-black text-cyan-300 mt-1">6 DISPATCHED</div>
              <div className="text-[10px] text-slate-400">{locRegion.split('(')[0]} Sector</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">CHLORINE &amp; ANTI-VENOM</span>
              <div className="text-xl font-black text-emerald-400 mt-1">3,500 KITS</div>
              <div className="text-[10px] text-emerald-300">Water Disinfection Buffer OK</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">EPIDEMIC SURVEILLANCE</span>
              <div className="text-base font-bold text-amber-300 mt-1">{locState} IDSP WATCH</div>
              <div className="text-[10px] text-slate-400">Zero Cholera outbreaks reported</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-pink-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-pink-400" />
              Medical Command &amp; Casualty Triage Actions ({locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Deploy 2 Mobile Health Units to ${locName.split('/')[0]}`)}
                className="p-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <HeartPulse className="w-4 h-4" />
                DISPATCH MOBILE HEALTH UNITS
              </button>
              <button
                onClick={() => triggerRoleAction(`Distribute 15,000 Chlorine Tablets across ${locRegion.split('(')[0]}`)}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Droplets className="w-4 h-4" />
                DISTRIBUTE CHLORINE TABLETS
              </button>
              <button
                onClick={() => triggerRoleAction(`Update ${locState} IDSP Water-Borne Disease Early Warning Registry`)}
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
              <div className="text-[10px] text-amber-400">{selectedLocation.zone} Desk</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">NDRF BATTALIONS ACTIVE</span>
              <div className="text-xl font-black text-cyan-300 mt-1">16 BATTALIONS</div>
              <div className="text-[10px] text-slate-400">12,000 Trained Responders</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">MONITORED BASINS</span>
              <div className="text-xl font-black text-rose-400 mt-1">9 BASINS</div>
              <div className="text-[10px] text-rose-300">{locState} Priority: {locRisk}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">NATIONAL THREAT LEVEL</span>
              <div className="text-base font-bold text-rose-400 mt-1">{locRisk} SURGE</div>
              <div className="text-[10px] text-slate-400">Monsoon Hydrological Desk</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-amber-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              National Commander Strategic Directives (Focus: {locState})
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
                CROSS-BORDER MONITORING
              </Link>
              <button
                onClick={() => triggerRoleAction(`Mobilize 2 Reserve NDRF Battalions to ${locState}`)}
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
              <span className="text-[10px] text-slate-400">ACTIVE REGIONAL MODEL</span>
              <div className="text-base font-bold text-white mt-1 truncate">{regionalModel.split(' (')[0]}</div>
              <div className="text-[10px] text-purple-400">{locState} Zone Engine</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">3-HOUR PRECIPITATION</span>
              <div className="text-base font-bold text-cyan-300 mt-1">{locRain}</div>
              <div className="text-[10px] text-slate-400">Soil Moisture: {locSoil}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">SAR SATELLITE PASS</span>
              <div className="text-base font-bold text-emerald-400 mt-1">Sentinel-1A (12m)</div>
              <div className="text-[10px] text-slate-400">{locRegion.split('(')[0]} Grid</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">GIS COORDINATES</span>
              <div className="text-base font-bold text-white mt-1">
                {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lon.toFixed(4)}°E
              </div>
              <div className="text-[10px] text-cyan-400">{locElevation}</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-purple-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              GIS &amp; Machine Learning Analysis Tools ({locName})
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
              <span className="text-[10px] text-slate-400">DISASTER APPLICATION</span>
              <div className="text-base font-bold text-white mt-1 truncate">{selectedLocation.application}</div>
              <div className="text-[10px] text-blue-400">{locState} Hydrology</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">EARLY WARNING LEAD TIME</span>
              <div className="text-xl font-black text-cyan-300 mt-1">+{selectedLocation.leadTimeMinutes} MIN</div>
              <div className="text-[10px] text-slate-400">Forecast Lead Window</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">PROVENANCE LEDGER</span>
              <div className="text-base font-bold text-emerald-400 mt-1">SHA-256 LOCKED</div>
              <div className="text-[10px] text-slate-400">Zero Future-Data Peeking</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">STRESS LAB SCENARIOS</span>
              <div className="text-base font-bold text-amber-300 mt-1">150 mm/h Surge</div>
              <div className="text-[10px] text-slate-400">{locHazard.split(' ')[0]} Simulator</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-blue-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Scientific Research &amp; Forensic Backtesting ({locName})
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
              <span className="text-[10px] text-slate-400">HARDWARE TELEMETRY NODES</span>
              <div className="text-base font-bold text-white mt-1">24 / 25 ONLINE</div>
              <div className="text-[10px] text-cyan-400">{locRegion.split('(')[0]} LoRaWAN Gateways</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">DATA PROVIDER BOUNDARIES</span>
              <div className="text-base font-bold text-amber-300 mt-1">8 REGISTERED</div>
              <div className="text-[10px] text-slate-400">IMD, CWC, NRSC, Open-Meteo</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">RBAC GOVERNANCE</span>
              <div className="text-base font-bold text-emerald-400 mt-1">10 ROLES ENFORCED</div>
              <div className="text-[10px] text-slate-400">Active Tier: {role}</div>
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
              System Administration &amp; Governance ({locState})
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
