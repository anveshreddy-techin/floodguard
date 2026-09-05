'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdaptive } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import {
  SourceAlertList,
  GovernmentStyleTable,
  TableColumn,
  SAMPLE_PUBLIC_ALERTS,
  PublicAlertItem,
  SachetAlertBanner,
} from '@/design-system/components';
import {
  AlertTriangle,
  Filter,
  Map,
  List,
  ShieldAlert,
  Clock,
  ExternalLink,
  Info,
  CheckCircle2,
  FileCode,
  Radio,
} from 'lucide-react';

export default function PublicAlertsPage() {
  const { hierarchy } = useAdaptive();
  const [selectedState, setSelectedState] = useState<string>(hierarchy.state || 'ALL');
  const [selectedHazard, setSelectedHazard] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP_VIEW'>('LIST');

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return SAMPLE_PUBLIC_ALERTS.filter((alert) => {
      if (selectedState !== 'ALL' && alert.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      if (selectedHazard !== 'ALL' && alert.hazardType !== selectedHazard) {
        return false;
      }
      if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) {
        return false;
      }
      return true;
    });
  }, [selectedState, selectedHazard, selectedSeverity]);

  const alertColumns: TableColumn<PublicAlertItem>[] = [
    {
      key: 'id',
      header: 'Alert ID',
      className: 'font-mono text-xs font-bold text-blue-900',
    },
    {
      key: 'severity',
      header: 'Severity',
      align: 'center',
      render: (item) => {
        const color =
          item.severity === 'WARNING'
            ? 'bg-red-100 text-red-900 border-red-300'
            : item.severity === 'ALERT'
            ? 'bg-orange-100 text-orange-900 border-orange-300'
            : 'bg-amber-100 text-amber-900 border-amber-300';
        return (
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${color}`}>
            {item.severity}
          </span>
        );
      },
    },
    {
      key: 'title',
      header: 'Hazard Advisory & Scope',
      render: (item) => (
        <div>
          <div className="font-bold text-slate-900">{item.title}</div>
          <div className="text-[11px] text-slate-500">{item.location} ({item.district}, {item.state})</div>
        </div>
      ),
    },
    {
      key: 'sourceAgency',
      header: 'Attribution Source',
      className: 'text-xs text-slate-600',
    },
    {
      key: 'issuedAt',
      header: 'Issued (IST)',
      className: 'font-mono text-[11px] text-slate-500 whitespace-nowrap',
    },
    {
      key: 'actionGuidance',
      header: 'Action Guidance',
      className: 'text-xs text-slate-700 max-w-xs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── SACHET NDMA BILINGUAL CAP v1.2 WARNING BANNER ── */}
      <SachetAlertBanner district={selectedState !== 'ALL' ? selectedState : 'Chamoli'} state={selectedState !== 'ALL' ? selectedState : 'Uttarakhand'} severity="RED" />

      {/* Header section */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                National Flash Flood &amp; Cascade Risk Advisories (SACHET OASIS CAP v1.2)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Public safety advisories, meteorological flood watches, and model-estimated slope warnings across Indian catchments.
            </p>
          </div>

          {/* View toggle and CAP XML Link */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/v1/alerts/cap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-700" />
              <span>OASIS CAP XML Feed</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>

            <div className="flex items-center border border-slate-300 rounded overflow-hidden text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('LIST')}
                className={`px-3 py-1.5 font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'LIST' ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List &amp; Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('MAP_VIEW')}
                className={`px-3 py-1.5 font-semibold flex items-center gap-1.5 border-l border-slate-300 transition cursor-pointer ${
                  viewMode === 'MAP_VIEW' ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Catchment Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* State filter */}
          <div>
            <label htmlFor="alerts-state-select" className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
              State / Territory
            </label>
            <select
              id="alerts-state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All States & Territories</option>
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hazard category filter */}
          <div>
            <label htmlFor="alerts-hazard-select" className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
              Hazard Type
            </label>
            <select
              id="alerts-hazard-select"
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Hazard Categories</option>
              <option value="FLASH_FLOOD">Flash Flood / High Inundation</option>
              <option value="RIVER_SURGE">River Stage Surge</option>
              <option value="LANDSLIDE">Landslide / Debris Slope</option>
              <option value="CLOUDBURST">Cloudburst / High-Intensity Rain</option>
              <option value="DAM_RELEASE">Reservoir / Dam Gate Release</option>
            </select>
          </div>

          {/* Severity filter */}
          <div>
            <label htmlFor="alerts-severity-select" className="block font-semibold text-slate-700 uppercase text-[10px] mb-1">
              Alert Severity Level
            </label>
            <select
              id="alerts-severity-select"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Severity Levels</option>
              <option value="WARNING">WARNING (Red - Imminent / Action Required)</option>
              <option value="ALERT">ALERT (Orange - High Preparedness)</option>
              <option value="WATCH">WATCH (Yellow - Advisory Monitoring)</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Switch: MAP_VIEW vs LIST */}
      {viewMode === 'MAP_VIEW' ? (
        <div className="bg-white border border-slate-300 rounded p-6 text-center space-y-4 shadow-xs">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              National Catchment Risk Graphic Map
            </h3>
            <p className="text-xs text-slate-600">
              Schematic geographical distribution of active basin advisories across Northern Himalayan and Western Ghats corridors.
            </p>
          </div>

          {/* Accessible SVG Map schematic */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50 flex items-center justify-center max-w-3xl mx-auto">
            <svg
              viewBox="0 0 600 360"
              className="w-full h-auto max-h-[360px]"
              role="img"
              aria-label="Schematic map of India showing regional disaster hazard zones and active alert nodes"
            >
              {/* Background outline */}
              <rect x="0" y="0" width="600" height="360" fill="#f1f5f9" rx="4" />

              {/* Schematic River Channels */}
              <path d="M 120,40 Q 240,90 320,130 T 480,180" fill="none" stroke="#93c5fd" strokeWidth="6" />
              <path d="M 280,110 Q 320,180 340,260 T 360,330" fill="none" stroke="#93c5fd" strokeWidth="4" />

              {/* Mountainous Ridge Silhouette */}
              <path d="M 60,80 L 140,30 L 220,70 L 300,20 L 380,60 L 460,25 L 540,70" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />

              {/* Alert Nodes */}
              {/* Node 1: Chamoli (Warning) */}
              <g transform="translate(240, 75)">
                <circle cx="0" cy="0" r="14" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                <text x="14" y="4" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">Chamoli (WARNING)</text>
              </g>

              {/* Node 2: Kullu (Alert) */}
              <g transform="translate(180, 55)">
                <circle cx="0" cy="0" r="12" fill="#f97316" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="7" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                <text x="12" y="4" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">Kullu (ALERT)</text>
              </g>

              {/* Node 3: Sonitpur (Watch) */}
              <g transform="translate(470, 110)">
                <circle cx="0" cy="0" r="10" fill="#f59e0b" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="6" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                <text x="12" y="4" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">Sonitpur (WATCH)</text>
              </g>

              {/* Node 4: Sikkim (Alert) */}
              <g transform="translate(390, 85)">
                <circle cx="0" cy="0" r="12" fill="#f97316" fillOpacity="0.2" />
                <circle cx="0" cy="0" r="7" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                <text x="12" y="4" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">North Sikkim (ALERT)</text>
              </g>

              {/* Legend */}
              <g transform="translate(20, 310)">
                <rect x="0" y="0" width="320" height="36" fill="#ffffff" stroke="#e2e8f0" rx="3" />
                <circle cx="20" cy="18" r="5" fill="#dc2626" />
                <text x="32" y="22" fontSize="10" fill="#334155" fontFamily="sans-serif">Warning (Red)</text>
                <circle cx="120" cy="18" r="5" fill="#ea580c" />
                <text x="132" y="22" fontSize="10" fill="#334155" fontFamily="sans-serif">Alert (Orange)</text>
                <circle cx="220" cy="18" r="5" fill="#d97706" />
                <text x="232" y="22" fontSize="10" fill="#334155" fontFamily="sans-serif">Watch (Yellow)</text>
              </g>
            </svg>
          </div>

          <p className="text-xs text-slate-500">
            Click on &quot;List &amp; Table&quot; above to view detailed tabular action items and local EOC contacts.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Detailed Alert Cards */}
          <section aria-labelledby="cards-view-heading" className="space-y-3">
            <h3 id="cards-view-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Detailed Advisory Action Cards ({filteredAlerts.length} matching)
            </h3>
            <SourceAlertList />
          </section>

          {/* Master Table View */}
          <section aria-labelledby="table-view-heading" className="space-y-3">
            <h3 id="table-view-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Advisories Tabular Master Registry
            </h3>
            <GovernmentStyleTable
              data={filteredAlerts}
              columns={alertColumns}
              searchPlaceholder="Search by alert ID, district, hazard or river..."
              pageSize={5}
            />
          </section>
        </div>
      )}

      {/* Disclaimers & Emergency Contact Box */}
      <div className="bg-slate-50 border border-slate-300 rounded p-4 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-blue-700" />
          <span>Attribution & Decision-Support Classification Notice</span>
        </div>
        <p className="leading-relaxed">
          Alerts labeled <strong>Official Verified</strong> reflect bulletins released by IMD, CWC, or respective State Disaster Management Authorities. Alerts labeled <strong>Model-Estimated</strong> are real-time algorithmic inferences computed by the FloodGuard multi-hazard ensemble pipeline for pilot catchments.
        </p>
        <p className="leading-relaxed font-semibold text-slate-800">
          In all instances, administrative curfew, road closure, or evacuation directives issued by the District Magistrate or State EOC take absolute precedence.
        </p>
      </div>
    </div>
  );
}
