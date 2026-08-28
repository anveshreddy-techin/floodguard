'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { LiveRiskMap } from '@/components/ui/LiveRiskMap';
import { VillageIntelligenceDrawer } from '@/components/ui/VillageIntelligenceDrawer';
import { Map, Layers, Compass, Radio, ShieldAlert, Crosshair, ArrowRight } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function HyperLocalGISPage() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070d1e] text-slate-100 overflow-hidden select-none">
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
