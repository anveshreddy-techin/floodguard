'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { NationalRiverRiskMap } from '@/components/ui/NationalRiverRiskMap';
import { useEnvironment } from '@/context/EnvironmentContext';

export default function RiverBasinsNationalPage() {
  const { setPage, setMode, setRiskState } = useEnvironment();

  useEffect(() => {
    setPage('map');
    setMode('DEMO');
    setRiskState('HIGH');
  }, [setPage, setMode, setRiskState]);

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#020714]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="map" />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-hidden min-h-0 bg-[#030712]">
          <NationalRiverRiskMap className="h-full" />
        </main>
      </div>
    </div>
  );
}
