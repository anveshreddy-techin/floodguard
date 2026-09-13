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
    color: 'text-rose-700 border-rose-200 bg-rose-50',
    desc: 'Tactical SAR grid coordinates, boat & drone tracking, live SOS dispatch queue, and triage checklist.',
    statutoryAgency: 'National Disaster Response Force (NDRF) / State SDRF',
  },
  {
    id: 'DISTRICT_OPERATOR',
    title: 'District EOC Operator (DEOC)',
    badge: '🏢 DISTRICT EOC',
    icon: Activity,
    color: 'text-blue-700 border-blue-200 bg-blue-50',
    desc: 'Block-wise risk aggregation, CAP alert distribution, inter-departmental relief coordination, and shelter quotas.',
    statutoryAgency: 'District Disaster Management Authority (DDMA)',
  },
  {
    id: 'STATE_OPERATOR',
    title: 'State SEOC Commander',
    badge: '🏛️ STATE SEOC',
    icon: Globe,
    color: 'text-indigo-700 border-indigo-200 bg-indigo-50',
    desc: 'Inter-district resource balancing, major reservoir spillway release clearance, and Chief Minister executive briefs.',
    statutoryAgency: 'State Disaster Management Authority (SDMA / SEOC)',
  },
  {
    id: 'MEDICAL_OFFICER',
    title: 'MO (Medical Officer / Health Command)',
    badge: '🏥 MEDICAL OFFICER',
    icon: Stethoscope,
    color: 'text-pink-700 border-pink-200 bg-pink-50',
    desc: 'Hospital & ICU bed surge tracking, post-flood water-borne disease surveillance, casualty triaging, and mobile medical units.',
    statutoryAgency: 'Directorate of Health Services & Integrated Disease Surveillance (IDSP)',
  },
  {
    id: 'NATIONAL_OPERATOR',
    title: 'National NDMA Commander',
    badge: '🇮🇳 NATIONAL NDMA',
    icon: Zap,
    color: 'text-amber-700 border-amber-200 bg-amber-50',
    desc: 'Pan-India multi-hazard threat dashboard, 16 NDRF battalions mobilization, and transboundary river basin sync.',
    statutoryAgency: 'National Disaster Management Authority (NDMA / NEOC, MHA)',
  },
  {
    id: 'ANALYST',
    title: 'GIS / ML Analyst',
    badge: '📊 GIS/ML ANALYST',
    icon: Brain,
    color: 'text-purple-700 border-purple-200 bg-purple-50',
    desc: 'SAR flood inundation rasters, SHAP feature importance, radar QPE gauge calibration, and slope morphometry.',
    statutoryAgency: 'NRSC/ISRO, IMD Research, & Flood Modeling Cell',
  },
  {
    id: 'RESEARCHER',
    title: 'Hydrology / Climate Researcher',
    badge: '🔬 RESEARCHER',
    icon: Database,
    color: 'text-blue-700 border-blue-200 bg-blue-50',
    desc: 'Historical hindcast back-testing (Kedarnath/Chamoli/Teesta), extreme stress lab simulations, and dataset exports.',
    statutoryAgency: 'Academic Research & National Institute of Hydrology (NIH)',
  },
  {
    id: 'ADMIN',
    title: 'System Administrator',
    badge: '⚙️ ADMIN GOVERNANCE',
    icon: ShieldCheck,
    color: 'text-slate-700 border-slate-200 bg-slate-100',
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
      <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              <h2 className="text-sm font-black font-mono uppercase tracking-wider text-slate-900">
                Location-Adaptive Mission Control Interface
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              📍 Synchronized to: <strong className="text-slate-800">{locName}</strong> ({locState} · {locRegion.split('(')[0]})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500">ACTIVE ROLE:</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-black border border-blue-300 bg-blue-50 text-blue-700">
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
                    ? 'bg-blue-600 text-white shadow-lg font-black border border-blue-700'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{r.title.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded text-white font-bold shrink-0">VERIFIED</span>
        </div>
      )}

      {/* ── DYNAMIC ROLE CONTENT ── */}

      {/* 1. CITIZEN / PUBLIC VIEWER */}
      {(role === 'CITIZEN' || role === 'VIEWER') && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                  {locState.toUpperCase()} CITIZEN SAFETY HUD
                </span>
                <h3 className="text-lg font-black text-slate-900">{locName} · High-Ground Guidance</h3>
              </div>
              <span className={`px-3 py-1 rounded-xl font-mono text-xs font-black ${
                locRisk === 'EXTREME' ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
              }`}>
                {locRisk} RISK ({locScore}/100)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-mono font-bold">RECOMMENDED HIGH-GROUND SHELTER</span>
                <div className="text-base font-bold text-slate-900 mt-1">{locName.split('/')[0]} Community Shelter</div>
                <div className="text-xs text-emerald-700 font-mono font-semibold mt-0.5">{locElevation} · +120m Elevation Gain</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-mono font-bold">PRIMARY LOCAL THREAT</span>
                <div className="text-sm font-bold text-amber-900 mt-1">{locHazard}</div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">River: {locRiver}</div>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                <span className="text-[10px] text-red-800 font-mono font-bold">{locState.toUpperCase()} DISASTER HELPLINE</span>
                <div className="text-sm font-bold text-red-900 mt-1">State SDRF Desk: 1070</div>
                <div className="text-xs text-red-700 font-mono font-bold mt-0.5">Emergency All-India: 112</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/safety"
                className="flex-1 min-w-[200px] py-3 rounded-2xl btn-primary text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
              >
                <Compass className="w-4 h-4 text-white" />
                <span>OPEN INTERACTIVE ESCAPE MAP FOR {locName.toUpperCase()}</span>
              </Link>
              <button
                onClick={() => triggerRoleAction(`Broadcast Vernacular Voice Siren across ${locName}`)}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold border border-amber-600 flex items-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Radio className="w-4 h-4 text-slate-950" />
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">ASSIGNED VILLAGE / WARD</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">{locName.split('/')[0]}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Pop: {locPop} ({locState})</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">LOCAL RIVER / DRAINAGE STAGE</span>
              <div className="text-xl font-black text-red-600 mt-1">{locRiver}</div>
              <div className="text-[10px] text-red-700 font-semibold">Rainfall: {locRain} in 3h</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">RELIEF SHELTER MUSTER</span>
              <div className="text-xl font-black text-emerald-700 mt-1">180 / 450</div>
              <div className="text-[10px] text-slate-600">Panchayat Bhavan Hall (40% Full)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">LOCAL PA SYSTEM SIRENS</span>
              <div className="text-base font-bold text-blue-700 mt-1">4 / 4 ONLINE</div>
              <div className="text-[10px] text-slate-600">Solar + Battery Backup OK</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Building className="w-4 h-4 text-blue-600" />
              Village / Ward Operator Operational Actions ({locState})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Trigger Village PA Warning Siren for ${locName}`)}
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                TRIGGER PA SIREN (AUDIO ALERT)
              </button>
              <button
                onClick={() => triggerRoleAction(`Log Physical Staff Gauge Reading for ${locName}`)}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                LOG MANUAL GAUGE STICK
              </button>
              <button
                onClick={() => triggerRoleAction(`Open Primary Shelter Muster at ${locName.split('/')[0]}`)}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">ASSIGNED RESPONSE BATTALION</span>
              <div className="text-base font-bold text-slate-900 mt-1">{infra.sdrf.split('&')[0]}</div>
              <div className="text-[10px] text-red-700 font-semibold">{locState} Rapid Action Unit</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">INFLATABLE WATER RESCUE BOATS</span>
              <div className="text-xl font-black text-blue-700 mt-1">8 DEPLOYED</div>
              <div className="text-[10px] text-slate-600">High-power outboard motors ready</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">TACTICAL SEARCH GRIDS</span>
              <div className="text-xl font-black text-amber-700 mt-1">Sector 1 &amp; 2</div>
              <div className="text-[10px] text-amber-800 font-semibold">{locRegion.split('(')[0]} Inundation Zone</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">RESCUE HELPLINE DISPATCH</span>
              <div className="text-xl font-black text-red-600 mt-1">3 ACTIVE</div>
              <div className="text-[10px] text-slate-600">Local emergency priority queue</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Tactical Field Responder Actions ({locState} Sector)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Dispatch Rescue Boat Squad to ${locName.split('/')[0]}`)}
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Zap className="w-4 h-4" />
                DISPATCH BOAT TEAM ALPHA
              </button>
              <Link
                href="/incidents"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Activity className="w-4 h-4" />
                INCIDENT TASK CHECKLIST
              </Link>
              <Link
                href="/incidents"
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Users className="w-4 h-4" />
                TACTICAL INCIDENT LOGS
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. DISTRICT EOC OPERATOR */}
      {role === 'DISTRICT_OPERATOR' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">DISTRICT EOC DESK</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">{locRegion.split('(')[0]} DEOC</div>
              <div className="text-[10px] text-blue-700 font-semibold">{locAgency}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">EVACUATION CENTERS</span>
              <div className="text-xl font-black text-emerald-700 mt-1">16 ACTIVE</div>
              <div className="text-[10px] text-slate-600">Total Sheltered: 4,120 / 9,500</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">DISTRICT THREAT LEVEL</span>
              <div className="text-xl font-black text-red-600 mt-1">{locRisk} ({locScore}/100)</div>
              <div className="text-[10px] text-red-700 font-semibold">{locHazard}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">COMMON ALERT PROTOCOL (CAP)</span>
              <div className="text-base font-bold text-amber-700 mt-1">CAP GATEWAY ACTIVE</div>
              <div className="text-[10px] text-slate-600">SMS + Cell Broadcast enabled</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              District EOC Commander Actions ({locRegion.split('(')[0]}, {locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Transmit CAP Cell Broadcast SMS across ${locRegion.split('(')[0]}`)}
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Radio className="w-4 h-4" />
                BROADCAST CAP DISTRICT SMS
              </button>
              <button
                onClick={() => triggerRoleAction(`Re-allocate 4 SDRF Teams across ${locRegion.split('(')[0]}`)}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                RE-ALLOCATE SDRF RESOURCES
              </button>
              <Link
                href="/incidents"
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">STATE EOC COMMAND</span>
              <div className="text-base font-bold text-slate-900 mt-1">{locState} SDMA SEOC</div>
              <div className="text-[10px] text-blue-700 font-semibold">State Disaster Operations Room</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">DAM SPILLWAY CLEARANCE</span>
              <div className="text-base font-bold text-amber-700 mt-1 truncate">{infra.dam.split('·')[0]}</div>
              <div className="text-[10px] text-slate-600">{infra.dam.split('·')[1] || 'Sluice Outflow Protocol'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">STATE RELIEF FUND (SDRF)</span>
              <div className="text-xl font-black text-emerald-700 mt-1">₹50.0 Cr</div>
              <div className="text-[10px] text-slate-600">Emergency Allocation Released</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">AIR FORCE HELI-LIFT</span>
              <div className="text-base font-bold text-blue-700 mt-1">2 MI-17 HELIS READY</div>
              <div className="text-[10px] text-slate-600">{locState} Air Base Staging</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              State SEOC Executive Authorization ({locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Authorize Controlled Spillway Release for ${infra.dam.split('·')[0]}`)}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Droplets className="w-4 h-4" />
                APPROVE DAM SPILLWAY RELEASE
              </button>
              <button
                onClick={() => triggerRoleAction(`Generate ${locState} Executive SitRep for Chief Secretary & Cabinet`)}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Download className="w-4 h-4 text-blue-600" />
                EXPORT {locState.toUpperCase()} SITREP PDF
              </button>
              <Link
                href={`/state/${locState.toLowerCase().slice(0, 2)}`}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">DESIGNATED DISTRICT HOSPITAL</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">{infra.hospital.split('/')[0]}</div>
              <div className="text-[10px] text-pink-700 font-semibold">120 ICU Beds · 24 Ventilators</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">MOBILE MEDICAL UNITS</span>
              <div className="text-xl font-black text-blue-700 mt-1">6 DISPATCHED</div>
              <div className="text-[10px] text-slate-600">{locRegion.split('(')[0]} Sector</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">CHLORINE &amp; ANTI-VENOM</span>
              <div className="text-xl font-black text-emerald-700 mt-1">3,500 KITS</div>
              <div className="text-[10px] text-emerald-800 font-semibold">Water Disinfection Buffer OK</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">EPIDEMIC SURVEILLANCE</span>
              <div className="text-base font-bold text-amber-700 mt-1">{locState} IDSP WATCH</div>
              <div className="text-[10px] text-slate-600">Zero Cholera outbreaks reported</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Stethoscope className="w-4 h-4 text-pink-600" />
              Medical Command &amp; Casualty Triage Actions ({locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerRoleAction(`Deploy 2 Mobile Health Units to ${locName.split('/')[0]}`)}
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <HeartPulse className="w-4 h-4" />
                DISPATCH MOBILE HEALTH UNITS
              </button>
              <button
                onClick={() => triggerRoleAction(`Distribute 15,000 Chlorine Tablets across ${locRegion.split('(')[0]}`)}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Droplets className="w-4 h-4" />
                DISTRIBUTE CHLORINE TABLETS
              </button>
              <button
                onClick={() => triggerRoleAction(`Update ${locState} IDSP Water-Borne Disease Early Warning Registry`)}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">NATIONAL NEOC TIER</span>
              <div className="text-base font-bold text-slate-900 mt-1">NDMA New Delhi (MHA)</div>
              <div className="text-[10px] text-amber-700 font-semibold">{selectedLocation.zone} Desk</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">NDRF BATTALIONS ACTIVE</span>
              <div className="text-xl font-black text-blue-700 mt-1">16 BATTALIONS</div>
              <div className="text-[10px] text-slate-600">12,000 Trained Responders</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">MONITORED BASINS</span>
              <div className="text-xl font-black text-red-600 mt-1">9 BASINS</div>
              <div className="text-[10px] text-red-700 font-semibold">{locState} Priority: {locRisk}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">NATIONAL THREAT LEVEL</span>
              <div className="text-base font-bold text-red-600 mt-1">{locRisk} SURGE</div>
              <div className="text-[10px] text-slate-600">Monsoon Hydrological Desk</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              National Commander Strategic Directives (Focus: {locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/river-basins"
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Waves className="w-4 h-4" />
                PAN-INDIA RIVER BASIN MAP
              </Link>
              <Link
                href="/cross-border"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Globe className="w-4 h-4" />
                CROSS-BORDER MONITORING
              </Link>
              <button
                onClick={() => triggerRoleAction(`Mobilize 2 Reserve NDRF Battalions to ${locState}`)}
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">ACTIVE REGIONAL MODEL</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">{regionalModel.split(' (')[0]}</div>
              <div className="text-[10px] text-purple-700 font-semibold">{locState} Zone Engine</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">3-HOUR PRECIPITATION</span>
              <div className="text-base font-bold text-blue-700 mt-1">{locRain}</div>
              <div className="text-[10px] text-slate-600">Soil Moisture: {locSoil}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">SAR SATELLITE PASS</span>
              <div className="text-base font-bold text-emerald-700 mt-1">Sentinel-1A (12m)</div>
              <div className="text-[10px] text-slate-600">{locRegion.split('(')[0]} Grid</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">GIS COORDINATES</span>
              <div className="text-base font-bold text-slate-900 mt-1">
                {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lon.toFixed(4)}°E
              </div>
              <div className="text-[10px] text-blue-700 font-semibold">{locElevation}</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Brain className="w-4 h-4 text-purple-600" />
              GIS &amp; Machine Learning Analysis Tools ({locName})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/map"
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Layers className="w-4 h-4" />
                3D HIGH-RESOLUTION GIS
              </Link>
              <Link
                href="/model-monitoring"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Brain className="w-4 h-4" />
                MODEL DRIFT &amp; SHAP
              </Link>
              <Link
                href="/cascade"
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">DISASTER APPLICATION</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">{selectedLocation.application}</div>
              <div className="text-[10px] text-blue-700 font-semibold">{locState} Hydrology</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">EARLY WARNING LEAD TIME</span>
              <div className="text-xl font-black text-blue-700 mt-1">+{selectedLocation.leadTimeMinutes} MIN</div>
              <div className="text-[10px] text-slate-600">Forecast Lead Window</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">PROVENANCE LEDGER</span>
              <div className="text-base font-bold text-emerald-700 mt-1">SHA-256 LOCKED</div>
              <div className="text-[10px] text-slate-600">Zero Future-Data Peeking</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">STRESS LAB SCENARIOS</span>
              <div className="text-base font-bold text-amber-700 mt-1">150 mm/h Surge</div>
              <div className="text-[10px] text-slate-600">{locHazard.split(' ')[0]} Simulator</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Database className="w-4 h-4 text-blue-600" />
              Scientific Research &amp; Forensic Backtesting ({locName})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/hindcast"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Clock className="w-4 h-4" />
                HISTORICAL HINDCAST REPLAY
              </Link>
              <Link
                href="/simulation"
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Zap className="w-4 h-4" />
                SCENARIO STRESS LAB
              </Link>
              <Link
                href="/ledger"
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">HARDWARE TELEMETRY NODES</span>
              <div className="text-base font-bold text-slate-900 mt-1">24 / 25 ONLINE</div>
              <div className="text-[10px] text-blue-700 font-semibold">{locRegion.split('(')[0]} LoRaWAN Gateways</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">DATA PROVIDER BOUNDARIES</span>
              <div className="text-base font-bold text-amber-700 mt-1">8 REGISTERED</div>
              <div className="text-[10px] text-slate-600">IMD, CWC, NRSC, Open-Meteo</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">RBAC GOVERNANCE</span>
              <div className="text-base font-bold text-emerald-700 mt-1">10 ROLES ENFORCED</div>
              <div className="text-[10px] text-slate-600">Active Tier: {role}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold">SYSTEM LATENCY</span>
              <div className="text-xl font-black text-blue-700 mt-1">12 ms</div>
              <div className="text-[10px] text-emerald-700 font-semibold">FastAPI Edge Proxy OK</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              System Administration &amp; Governance ({locState})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/admin"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                ADMIN GOVERNANCE CONSOLE
              </Link>
              <Link
                href="/data-sources"
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Database className="w-4 h-4" />
                PROVIDER REGISTRY TABLE
              </Link>
              <Link
                href="/ingestion"
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
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
