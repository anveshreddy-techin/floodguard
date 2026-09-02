'use client';

import React, { useState, useEffect } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileConfigDrawer } from './MobileConfigDrawer';
import { ApkDownloadModal } from './ApkDownloadModal';
import { GlobalAiAssistant } from './GlobalAiAssistant';
import { EmergencyDispatchModal } from './EmergencyDispatchModal';

export const MobileNavigationWrapper: React.FC = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);

  useEffect(() => {
    const handleOpenNav = () => {
      setConfigDrawerOpen(false);
      setNavDrawerOpen(true);
    };
    const handleOpenConfig = () => {
      setNavDrawerOpen(false);
      setConfigDrawerOpen(true);
    };

    window.addEventListener('open-mobile-nav-drawer', handleOpenNav);
    window.addEventListener('open-mobile-config-drawer', handleOpenConfig);

    return () => {
      window.removeEventListener('open-mobile-nav-drawer', handleOpenNav);
      window.removeEventListener('open-mobile-config-drawer', handleOpenConfig);
    };
  }, []);

  return (
    <>
      <ApkDownloadModal />
      <EmergencyDispatchModal />
      <GlobalAiAssistant />
      
      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenConfig={() => setConfigDrawerOpen(true)} />

      {/* Top-Left Menu Triggered: Navigation & Phase Portal Drawer (No Red Box Options) */}
      <MobileNavDrawer 
        isOpen={navDrawerOpen} 
        onClose={() => setNavDrawerOpen(false)} 
      />

      {/* Bottom-Right Menu Triggered: System Sector, Role, Language & Mode Settings (Red Box Options Only) */}
      <MobileConfigDrawer 
        isOpen={configDrawerOpen} 
        onClose={() => setConfigDrawerOpen(false)} 
      />
    </>
  );
};

