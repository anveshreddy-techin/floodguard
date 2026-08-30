'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { RoleWorkspaceView } from '@/components/ui/RoleWorkspaceView';
import { useEnvironment } from '@/context/EnvironmentContext';

export default function RoleWorkspacePage() {
  const { setPage, setMode, setRiskState } = useEnvironment();

  useEffect(() => {
    setPage('role-workspace');
    setMode('DEMO');
    setRiskState('HIGH');
  }, [setPage, setMode, setRiskState]);

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#020714]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="overview" />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6 overflow-y-auto">
          <RoleWorkspaceView />
        </main>
      </div>
    </div>
  );
}
