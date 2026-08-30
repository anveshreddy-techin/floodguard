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
      {/* Floating Global Action Dock: SOS Rescue + AI Copilot (Accessible across EVERY page) */}
      <div className="fixed bottom-20 right-3 sm:right-4 md:bottom-6 md:right-6 z-[750] select-none pointer-events-auto flex items-center gap-2">
        {/* Floating Emergency SOS Dispatch Trigger */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-emergency-modal'));
            }
          }}
          className="btn-danger p-2.5 sm:px-3.5 sm:py-3 rounded-2xl text-white font-mono text-xs font-black flex items-center gap-1.5 shadow-[0_0_25px_rgba(225,29,72,0.7)] hover:shadow-[0_0_35px_rgba(225,29,72,1)] hover:scale-105 active:scale-95 transition-all group animate-pulse"
          style={{ border: '1.5px solid rgba(244,63,94,0.6)' }}
          title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
        >
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce shrink-0" />
          <span className="tracking-wider hidden xs:inline">SOS RESCUE</span>
          <span className="text-[10px] font-mono text-rose-200 bg-rose-950/90 px-1 py-0.5 rounded border border-rose-700/80 hidden sm:inline">
            [E]
          </span>
        </button>

        {/* Floating AI Copilot Trigger */}
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary p-2.5 sm:px-4 sm:py-3 rounded-2xl text-white font-mono text-xs font-black flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] hover:scale-105 active:scale-95 transition-all group"
          style={{ border: '1.5px solid rgba(56,189,248,0.5)' }}
          title="Open Grounded AI Disaster Intelligence Assistant (Hotkey: A)"
        >
          <div className="relative">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="tracking-wider hidden xs:inline">AI COPILOT</span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-700/80 hidden sm:inline">
            [A]
          </span>
        </button>
      </div>

      {/* Global Copilot Drawer */}
      <CopilotDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
