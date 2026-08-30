'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  Users, Shield, Lock, AlertTriangle, MapPin,
  Eye, EyeOff, Search, Info
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

const STATS = [
  { label: 'Reports Filed', value: 4, color: 'text-white' },
  { label: 'Located / Reunited', value: 2, color: 'text-green-400' },
  { label: 'Under Active Search', value: 2, color: 'text-amber-400' },
  { label: 'Search Areas Active', value: 1, color: 'text-blue-400' },
];

export default function MissingPersonsPage() {
  return (
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-purple-400" />
                Missing Persons Registry
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Access-controlled registry for search and rescue coordination.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Privacy Protection Banner */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-semibold">Personal Data Access Control</p>
              <p className="text-red-200/70 text-sm mt-1">
                Victim personal data (names, age, photo, contact details) is access-controlled and stored encrypted.
                Only <strong>RESPONDER</strong> or <strong>ADMIN</strong> roles can view personal information.
                This registry is audited and compliant with IT Act 2000 requirements.
                The data shown below is aggregate/statistical only for your current role (VIEWER/DEMO).
              </p>
            </div>
          </div>

          {/* Role gate */}
          <div className="bg-gray-900 border border-amber-500/30 rounded-lg p-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-semibold">Role Required: RESPONDER or ADMIN</p>
              <p className="text-gray-400 text-sm">
                Your demo role is <strong>VIEWER</strong>. Personal records are masked.
                To access in a real deployment, contact your SDMA administrator for role elevation.
              </p>
            </div>
          </div>

          {/* Aggregate stats — safe for all roles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Redacted records */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2 text-sm text-gray-400">
              <EyeOff className="w-4 h-4" />
              <span>Personal details masked — VIEWER role</span>
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800/50">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">
                    <span className="bg-gray-700 text-gray-700 rounded px-8">████████████</span>
                    {' '}— Age: <span className="bg-gray-700 text-gray-700 rounded px-4">███</span>
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    Last known location: <span className="bg-gray-700 text-gray-700 rounded px-12">████████████████</span>
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${i <= 2 ? 'text-green-400 bg-green-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                  {i <= 2 ? 'LOCATED' : 'SEARCHING'}
                </span>
              </div>
            ))}
          </div>

          {/* Search area placeholder */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              Active Search Area — Raini Left Bank
            </h2>
            <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Search Area Map</p>
                <p className="text-gray-600 text-xs">PostGIS polygon visualization (demo)</p>
              </div>
            </div>
          </div>

          {/* Data protection note */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-400 text-sm">
              <strong className="text-gray-300">Data Protection:</strong> Personal information is collected under minimum
              necessity principles. Data is encrypted at rest using AES-256. All access is audit-logged.
              Records are purged 90 days after incident closure unless legally required.
              Compliant with IT Act 2000 and NDMA privacy guidelines.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
