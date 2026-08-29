'use client';

import React, { useState } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { ApkDownloadModal } from './ApkDownloadModal';

export const MobileNavigationWrapper: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ApkDownloadModal />
      <MobileBottomNav onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileNavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
