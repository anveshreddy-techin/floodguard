'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { LiveDashboardAlertsView } from '@/components/ui/LiveDashboardAlertsView';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-slate-950">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="dashboard-alerts" />
        <main className="flex-1 relative flex flex-col min-h-0 overflow-y-auto bg-slate-950 p-2 sm:p-4">
          <LiveDashboardAlertsView standalone={true} />
        </main>
      </div>
    </div>
  );
}
