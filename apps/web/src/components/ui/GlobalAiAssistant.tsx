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
          className="w-10 h-10 md:w-auto md:h-auto btn-danger p-2 md:px-3.5 md:py-2.5 rounded-full md:rounded-2xl text-white font-mono text-xs font-black flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(225,29,72,0.6)] hover:shadow-[0_0_30px_rgba(225,29,72,0.9)] hover:scale-105 active:scale-95 transition-all group animate-pulse"
          style={{ border: '1.5px solid rgba(244,63,94,0.6)' }}
          title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
        >
          <PhoneCall className="w-4 h-4 md:w-4 md:h-4 shrink-0" />
          <span className="tracking-wider hidden md:inline">SOS RESCUE</span>
          <span className="text-[10px] font-mono text-rose-200 bg-rose-950/90 px-1 py-0.5 rounded border border-rose-700/80 hidden md:inline">
            [E]
          </span>
        </button>

        {/* Floating AI Copilot Trigger */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 md:w-auto md:h-auto btn-primary p-2 md:px-4 md:py-2.5 rounded-full md:rounded-2xl text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all group"
          style={{ border: '1.5px solid rgba(56,189,248,0.5)' }}
          title="Open Grounded AI Disaster Intelligence Assistant (Hotkey: A)"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-4 h-4 md:w-4 md:h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="tracking-wider hidden md:inline">AI COPILOT</span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-700/80 hidden md:inline">
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
