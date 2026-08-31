'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, PhoneCall, ShieldAlert } from 'lucide-react';
import { CopilotDrawer } from './CopilotDrawer';

export const GlobalAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Listen for custom global event 'open-copilot'
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-copilot', handleOpenEvent);

    // Keyboard shortcut: Pressing 'A' or 'Ctrl+J' opens AI Assistant
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'a' || e.key === 'A') {
        if (!e.ctrlKey && !e.metaKey) {
          setIsOpen((prev) => !prev);
        }
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-copilot', handleOpenEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Global Copilot Drawer (Triggered from Top Header and Hotkeys A / Ctrl+J) */}
      <CopilotDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
