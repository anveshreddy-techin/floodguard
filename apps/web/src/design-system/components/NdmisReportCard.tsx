'use client';

import React, { useState } from 'react';
import {
  FileText,
  Users,
  Home,
  AlertCircle,
  Truck,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  Droplets,
  Zap,
} from 'lucide-react';

export interface NdmisAssessment {
  district: string;
  state: string;
  households_affected: number;
  population_at_risk: number;
  roads_blocked_km: number;
  bridges_culverts_damaged: number;
  relief_camps_active: number;
  camps_occupancy: number;
  agricultural_submerged_ha: number;
  reporting_authority: string;
  status: string;
}

export interface NdmisCamp {
  camp_id: string;
  name: string;
  district: string;
  sanctioned_capacity: number;
  current_occupancy: number;
  drinking_water: string;
  power_backup: string;
  medical_team: string;
  nodal_officer: string;
}

const SAMPLE_ASSESSMENTS: NdmisAssessment[] = [
  {
    district: 'Chamoli',
    state: 'Uttarakhand',
    households_affected: 240,
    population_at_risk: 4850,
    roads_blocked_km: 14.5,
    bridges_culverts_damaged: 3,
    relief_camps_active: 4,
    camps_occupancy: 320,
    agricultural_submerged_ha: 42.0,
    reporting_authority: 'Chamoli District Magistrate / DEOC',
    status: 'ACTIVE_INCIDENT',
  },
  {
    district: 'Uttarkashi',
    state: 'Uttarakhand',
    households_affected: 410,
    population_at_risk: 8200,
    roads_blocked_km: 28.0,
    bridges_culverts_damaged: 5,
    relief_camps_active: 6,
    camps_occupancy: 580,
    agricultural_submerged_ha: 85.0,
    reporting_authority: 'Uttarkashi District Magistrate / DEOC',
    status: 'ACTIVE_INCIDENT',
  },
  {
    district: 'Kullu',
    state: 'Himachal Pradesh',
    households_affected: 180,
    population_at_risk: 3600,
    roads_blocked_km: 8.0,
    bridges_culverts_damaged: 2,
    relief_camps_active: 3,
    camps_occupancy: 210,
    agricultural_submerged_ha: 30.0,
    reporting_authority: 'Kullu District Administration',
    status: 'MONITORING',
  },
];

const SAMPLE_CAMPS: NdmisCamp[] = [
  {
    camp_id: 'NDMIS-CAMP-UK-01',
    name: 'Govt Inter College (GIC) Joshimath',
    district: 'Chamoli',
    sanctioned_capacity: 650,
    current_occupancy: 140,
    drinking_water: 'Operational (RO)',
    power_backup: 'Solar + Genset',
    medical_team: 'Deputed (Dr. Rawat)',
    nodal_officer: 'Shri R. S. Negi (SDM)',
  },
  {
    camp_id: 'NDMIS-CAMP-UK-02',
    name: 'Panchayat Bhawan Pipalkoti',
    district: 'Chamoli',
    sanctioned_capacity: 350,
    current_occupancy: 45,
    drinking_water: 'Water Tanker',
    power_backup: 'Genset',
    medical_team: 'On-Call',
    nodal_officer: 'Smt. K. Rawat (BDO)',
  },
  {
    camp_id: 'NDMIS-CAMP-UK-03',
    name: 'Bhatwari Multi-Purpose Community Hall',
    district: 'Uttarkashi',
    sanctioned_capacity: 500,
    current_occupancy: 210,
    drinking_water: 'Operational (RO)',
    power_backup: 'Solar System',
    medical_team: 'Deputed (Dr. Semwal)',
    nodal_officer: 'Dr. V. K. Semwal',
  },
];

export const NdmisReportCard: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chamoli');

  const currentAssessment =
    SAMPLE_ASSESSMENTS.find((a) => a.district.toLowerCase() === selectedDistrict.toLowerCase()) ||
    SAMPLE_ASSESSMENTS[0];

  const relevantCamps = SAMPLE_CAMPS.filter(
    (c) => c.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  return (
    <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden text-slate-900 mb-6">
      {/* ── NDMIS OFFICIAL HEADER ── */}
      <div className="bg-[#1e3a8a] text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 border border-white/20">
            NDMIS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                National Disaster Management Information System (NDMIS)
              </h3>
              <span className="bg-amber-400 text-blue-950 font-black text-[9px] px-2 py-0.5 rounded font-mono">
                DAILY SITREP
              </span>
            </div>
            <p className="text-[11px] text-blue-100">
              Ministry of Home Affairs (MHA) · Disaster Management Division Official Sit-Report
            </p>
          </div>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-blue-200 text-[11px]">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-blue-950 border border-blue-600 text-white rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <option value="Chamoli">Chamoli (Uttarakhand)</option>
            <option value="Uttarkashi">Uttarkashi (Uttarakhand)</option>
            <option value="Kullu">Kullu (Himachal Pradesh)</option>
          </select>
        </div>
      </div>

      {/* ── DAMAGE & IMPACT ASSESSMENT KPI GRID ── */}
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              DISTRICT DAMAGE &amp; IMPACT ASSESSMENT (MHA STANDARD SitRep FORMAT)
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Auth: {currentAssessment.reporting_authority}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* KPI 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Affected Families</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {currentAssessment.households_affected}
              </div>
              <div className="text-[10px] text-slate-500">Households verified</div>
            </div>

            {/* KPI 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Population at Risk</div>
              <div className="text-xl font-black text-amber-700 font-mono mt-0.5">
                {currentAssessment.population_at_risk.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">Riparian corridor</div>
            </div>

            {/* KPI 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Blocked Roads</div>
              <div className="text-xl font-black text-red-700 font-mono mt-0.5">
                {currentAssessment.roads_blocked_km} <span className="text-xs font-normal">km</span>
              </div>
              <div className="text-[10px] text-slate-500">NH-58 &amp; State Links</div>
            </div>

            {/* KPI 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Culverts / Bridges</div>
              <div className="text-xl font-black text-red-700 font-mono mt-0.5">
                {currentAssessment.bridges_culverts_damaged}
              </div>
              <div className="text-[10px] text-slate-500">Structural damage</div>
            </div>

            {/* KPI 5 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Submerged Agri</div>
              <div className="text-xl font-black text-blue-900 font-mono mt-0.5">
                {currentAssessment.agricultural_submerged_ha} <span className="text-xs font-normal">ha</span>
              </div>
              <div className="text-[10px] text-slate-500">Terraced farmland</div>
            </div>

            {/* KPI 6 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Human Casualties</div>
              <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
                0
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">Timely evacuation</div>
            </div>
          </div>
        </div>

        {/* ── ACTIVE RELIEF CAMPS CAPACITY & AMENITIES TABLE ── */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              OPERATIONAL RELIEF CAMPS &amp; SHELTER AMENITIES LEDGER
            </div>
            <span className="text-[10px] text-blue-700 font-mono font-bold">
              {relevantCamps.length} Camps Monitored in {selectedDistrict}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase font-semibold border-b border-slate-200">
                  <th className="py-2 px-3">Camp ID &amp; Name</th>
                  <th className="py-2 px-3">Sanctioned Cap</th>
                  <th className="py-2 px-3">Occupancy</th>
                  <th className="py-2 px-3">Capacity Utilization</th>
                  <th className="py-2 px-3">Drinking Water</th>
                  <th className="py-2 px-3">Power Backup</th>
                  <th className="py-2 px-3">Medical Team</th>
                  <th className="py-2 px-3">Nodal Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {relevantCamps.map((camp) => {
                  const pct = Math.round((camp.current_occupancy / camp.sanctioned_capacity) * 100);
                  return (
                    <tr key={camp.camp_id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{camp.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{camp.camp_id}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                        {camp.sanctioned_capacity}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                        {camp.current_occupancy}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct > 80 ? 'bg-red-600' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-700">
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {camp.drinking_water}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {camp.power_backup}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {camp.medical_team}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        {camp.nodal_officer}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
