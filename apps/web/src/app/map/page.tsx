'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { LiveRiskMap } from '@/components/ui/LiveRiskMap';
import { VillageIntelligenceDrawer } from '@/components/ui/VillageIntelligenceDrawer';
import { useEnvironment } from '@/context/EnvironmentContext';
import { Map, Layers, Compass, Radio, ShieldAlert, Crosshair, ArrowRight } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function HyperLocalGISPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    setPage('map');
    setMode('DEMO');
  }, [setPage, setMode]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="map" />

        <main className="flex-1 relative flex flex-col min-h-0">
          {/* Full Screen Live Risk Map */}
          <div className="flex-1 relative min-h-0">
            <LiveRiskMap
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              selectedLocationId={selectedLocation?.id}
              simulatedTimeStep="LIVE GIS"
            />
          </div>

          {/* Slide-in Village Intelligence Drawer */}
          {selectedLocation && (
            <VillageIntelligenceDrawer
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
