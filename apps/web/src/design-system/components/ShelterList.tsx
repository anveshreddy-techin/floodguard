'use client';

import React, { useState } from 'react';
import { Home, MapPin, Users, CheckCircle2, ShieldAlert, ArrowUpRight, Phone } from 'lucide-react';

export interface ReliefShelter {
  id: string;
  name: string;
  state: string;
  district: string;
  location: string;
  elevation: string;
  facilityType: 'GOVT_COLLEGE' | 'COMMUNITY_HALL' | 'PANCHAYAT_BHAWAN' | 'SPORTS_STADIUM' | 'PRIMARY_HEALTH_CENTER';
  capacity: number;
  currentOccupancy: number;
  readinessStatus: 'OPERATIONAL_READY' | 'ACTIVE_RELIEF' | 'STANDBY_RESERVE';
  facilities: string[];
  contactOfficer: string;
  contactPhone: string;
}

export const SAMPLE_SHELTERS: ReliefShelter[] = [
  {
    id: 'SHL-UK-CH-01',
    name: 'Government Inter College (GIC) Joshimath Upper Campus',
    state: 'Uttarakhand',
    district: 'Chamoli',
    location: 'Upper Joshimath Ridge, Ward 3',
    elevation: '2,150 m ASL (Safe High Ground)',
    facilityType: 'GOVT_COLLEGE',
    capacity: 650,
    currentOccupancy: 140,
    readinessStatus: 'ACTIVE_RELIEF',
    facilities: ['Solar Microgrid', 'RO Potable Water', 'Auxiliary Genset', 'First Aid Center', 'Separate Sanitation'],
    contactOfficer: 'Shri R. S. Negi (Nodal Officer)',
    contactPhone: '01372-222145',
  },
  {
    id: 'SHL-UK-CH-02',
    name: 'Panchayat Bhawan & Community Center Pipalkoti',
    state: 'Uttarakhand',
    district: 'Chamoli',
    location: 'Pipalkoti Hill Terrace, NH-07 Bypass',
    elevation: '1,420 m ASL',
    facilityType: 'PANCHAYAT_BHAWAN',
    capacity: 350,
    currentOccupancy: 45,
    readinessStatus: 'OPERATIONAL_READY',
    facilities: ['Water Tanker Storage', 'Emergency Lanterns', 'Medical Kit', 'Radio VHF Link'],
    contactOfficer: 'Smt. Kavita Rawat (Pradhan)',
    contactPhone: '01372-266312',
  },
  {
    id: 'SHL-HP-KL-01',
    name: 'Govt Senior Secondary School Manali High Terrace',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    location: 'Aleo Hill Top, Upper Manali',
    elevation: '2,080 m ASL',
    facilityType: 'GOVT_COLLEGE',
    capacity: 500,
    currentOccupancy: 0,
    readinessStatus: 'STANDBY_RESERVE',
    facilities: ['Thermal Blankets Reserve', 'Potable Water Pipeline', 'First Responder Station'],
    contactOfficer: 'Shri A. K. Sharma (Tehsildar)',
    contactPhone: '01902-252123',
  },
  {
    id: 'SHL-AS-SO-01',
    name: 'Tezpur Multi-Purpose Disaster Cyclone & Flood Shelter',
    state: 'Assam',
    district: 'Sonitpur',
    location: 'Mission Chariali High Grounds, Tezpur',
    elevation: '85 m ASL (Raised Plinth)',
    facilityType: 'COMMUNITY_HALL',
    capacity: 1200,
    currentOccupancy: 280,
    readinessStatus: 'ACTIVE_RELIEF',
    facilities: ['Raised Cattle Platform', 'Community Kitchen', 'Medical Isolation Room', 'High-Volume Pumps'],
    contactOfficer: 'Dr. B. Das (Circle Officer)',
    contactPhone: '03712-220411',
  },
  {
    id: 'SHL-SK-MG-01',
    name: 'Mangan District Indoor Stadium Relief Center',
    state: 'Sikkim',
    district: 'North Sikkim (Mangan)',
    location: 'Mangan Bazaar High Tier',
    elevation: '1,310 m ASL',
    facilityType: 'SPORTS_STADIUM',
    capacity: 400,
    currentOccupancy: 60,
    readinessStatus: 'OPERATIONAL_READY',
    facilities: ['Emergency Power Line', 'Sanitary Pads & Baby Food Kits', 'Wireless VHF Station'],
    contactOfficer: 'Shri P. Lepcha (DEOC Supervisor)',
    contactPhone: '03592-234289',
  },
];

export const ShelterList: React.FC<{ filterState?: string }> = ({ filterState }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const filteredShelters = SAMPLE_SHELTERS.filter((s) => {
    if (filterState && s.state.toLowerCase() !== filterState.toLowerCase()) {
      return false;
    }
    if (selectedDistrict !== 'ALL' && s.district !== selectedDistrict) {
      return false;
    }
    return true;
  });

  const districts = Array.from(new Set(SAMPLE_SHELTERS.map((s) => s.district)));

  const getStatusBadge = (status: ReliefShelter['readinessStatus']) => {
    switch (status) {
      case 'ACTIVE_RELIEF':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'OPERATIONAL_READY':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Route Caution Banner */}
      <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Candidate Evacuation Shelter Directory: </span>
          <span>
            Shelters listed are verified public designated high-ground assets. Before embarking on an evacuation path, ensure approach roads and culverts are confirmed passable by local police or EOC spotters.
          </span>
        </div>
      </div>

      {/* District filter */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded p-3 text-xs">
        <span className="font-semibold text-slate-700">Filter by District:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedDistrict('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              selectedDistrict === 'ALL'
                ? 'bg-[#0f172a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Districts ({SAMPLE_SHELTERS.length})
          </button>
          {districts.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDistrict(d)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                selectedDistrict === d
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShelters.map((shelter) => {
          const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
          return (
            <div
              key={shelter.id}
              className="bg-white border border-slate-300 rounded shadow-xs p-4 flex flex-col justify-between text-xs space-y-3"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                      {shelter.id} · {shelter.district}, {shelter.state}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {shelter.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${getStatusBadge(shelter.readinessStatus)}`}>
                    {shelter.readinessStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                  <span>{shelter.location} ({shelter.elevation})</span>
                </div>

                {/* Capacity meter */}
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 mb-2.5">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Capacity & Occupancy:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {shelter.currentOccupancy} / {shelter.capacity} persons ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${occupancyPct > 80 ? 'bg-red-600' : occupancyPct > 40 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.min(100, occupancyPct)}%` }}
                    />
                  </div>
                </div>

                {/* Facilities tags */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Verified Facilities:</span>
                  <div className="flex flex-wrap gap-1">
                    {shelter.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">{shelter.contactOfficer}</span>
                </div>
                <a
                  href={`tel:${shelter.contactPhone}`}
                  className="inline-flex items-center gap-1 text-blue-800 font-mono font-bold hover:underline"
                >
                  <Phone className="w-3 h-3 text-blue-600" />
                  <span>{shelter.contactPhone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
