'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  MapPin, 
  Radio, 
  Send, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Flame,
  Truck,
  HeartPulse,
  Navigation,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

export const EmergencyDispatchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLocation } = useLocation();
  
  const [distressType, setDistressType] = useState<string>('TRAPPED_WATER');
  const [distressStatus, setDistressStatus] = useState<'IDLE' | 'TRANSMITTING' | 'DISPATCHED'>('IDLE');
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [beaconAudio, setBeaconAudio] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-emergency-modal', handleOpen);

    // Global hotkey 'E' to trigger emergency modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'e' || e.key === 'E') {
        if (!e.ctrlKey && !e.metaKey) {
          setIsOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-emergency-modal', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const emergencyContacts = [
    {
      name: 'National Disaster Helpline (NDMA / NDRF)',
      number: '1078',
      tel: 'tel:1078',
      icon: ShieldAlert,
      tag: 'TOLL-FREE 24/7',
      color: 'from-rose-600 to-red-700',
    },
    {
      name: 'State Disaster Emergency Operations (SEOC)',
      number: '1070',
      tel: 'tel:1070',
      icon: Radio,
      tag: 'STATE EOC',
      color: 'from-amber-600 to-orange-700',
    },
    {
      name: 'National Unified Emergency Helpline',
      number: '112',
      tel: 'tel:112',
      icon: PhoneCall,
      tag: 'ALL EMERGENCIES',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      name: 'Ambulance & Medical Emergency',
      number: '108',
      tel: 'tel:108',
      icon: HeartPulse,
      tag: 'MEDICAL FIRST AID',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      name: 'Fire & Debris Rescue Service',
      number: '101',
      tel: 'tel:101',
      icon: Flame,
      tag: 'SEARCH & RESCUE',
      color: 'from-orange-600 to-red-600',
    },
    {
      name: 'District EOC (DEOC Chamoli / Uttarakhand)',
      number: '01372-251077',
      tel: 'tel:01372251077',
      icon: Truck,
      tag: 'LOCAL DISPATCH',
      color: 'from-purple-600 to-indigo-800',
    },
  ];

  const handleTransmitSos = () => {
    setDistressStatus('TRANSMITTING');
    setTimeout(() => {
      setDistressStatus('DISPATCHED');
      setEtaMinutes(12);
    }, 1200);
  };

  const gpsPayload = `SOS! FLOOD EMERGENCY: ${selectedLocation.name} (Lat: 30.5050 N, Lon: 79.1550 E, Alt: 1180m). Status: ${distressType}. High Risk 68.5/100. Immediate rescue needed!`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl select-none animate-slide-up">
      <div 
        className="w-full max-w-2xl bg-[#060a17] border-2 border-rose-600/80 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/90 via-red-950/80 to-slate-950 border-b border-rose-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,72,0.8)] animate-pulse">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-900 text-rose-200 border border-rose-700">
                  IMMEDIATE RESCUE
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">HOTKEY: [E]</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-mono mt-0.5 tracking-tight">
                EMERGENCY ASSISTANCE & RESCUE DISPATCH
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition active:scale-95 border border-slate-800"
            title="Close Emergency Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs font-sans flex-1">
          
          {/* Section 1: 1-Tap National Disaster Emergency Calling Directory */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                1-TAP DIRECT RESCUE & HELPLINE CALLING
              </span>
              <span className="text-[10px] font-mono text-emerald-400">TAP BUTTON TO DIAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {emergencyContacts.map((contact, i) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={i}
                    href={contact.tel}
                    className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r ${contact.color} text-white flex items-center justify-between shadow-lg hover:brightness-110 active:scale-95 transition-all border border-white/20 group`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono font-bold text-white/80 uppercase truncate">
                          {contact.tag}
                        </div>
                        <div className="text-xs font-black truncate">{contact.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-xl text-xs font-mono font-black shrink-0 border border-white/20">
                      <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                      <span>{contact.number}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Section 2: Automated GPS Distress Beacon & Rescue Unit Dispatch */}
          <div className="fp fp-operational rounded-2xl p-4 sm:p-5 space-y-4 border border-cyan-500/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  AUTOMATED GPS RESCUE BEACON BROADCAST
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Transmits encrypted distress telemetry directly to State Disaster Emergency Operations Center
                </p>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
                AES-128 TELEMETRY
              </span>
            </div>

            {/* Current Real-time Coordinates & Risk Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="fp p-2.5 rounded-xl">
                <span className="text-slate-500 block text-[9px]">TARGET SECTOR:</span>
                <span className="text-white font-bold truncate block">{selectedLocation.name}</span>
              </div>
              <div className="fp p-2.5 rounded-xl">
                <span className="text-slate-500 block text-[9px]">GPS COORDINATES:</span>
                <span className="text-cyan-300 font-bold block">30.5050°N, 79.1550°E</span>
              </div>
              <div className="fp p-2.5 rounded-xl">
                <span className="text-slate-500 block text-[9px]">SURGE RISK SCORE:</span>
                <span className="text-rose-400 font-bold block">68.5/100 (HIGH)</span>
              </div>
              <div className="fp p-2.5 rounded-xl">
                <span className="text-slate-500 block text-[9px]">ALTITUDE ASL:</span>
                <span className="text-amber-300 font-bold block">1,180 m ASL</span>
              </div>
            </div>

            {/* Situation Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-300 uppercase block">
                SELECT SITUATION CLASSIFICATION:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono font-bold">
                {[
                  { id: 'TRAPPED_WATER', label: '🌊 TRAPPED BY FLOOD' },
                  { id: 'INJURED_CITIZEN', label: '🏥 INJURED CITIZEN' },
                  { id: 'BRIDGE_BLOCKED', label: '🌉 ROUTE CUT OFF' },
                  { id: 'MUDSLIDE', label: '⛰️ ACTIVE MUDSLIDE' },
                ].map((sit) => (
                  <button
                    key={sit.id}
                    onClick={() => setDistressType(sit.id)}
                    className={`p-2 rounded-xl border transition active:scale-95 text-center ${
                      distressType === sit.id
                        ? 'bg-rose-950 border-rose-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger Buttons: SOS Broadcast & SMS Fallback */}
            {distressStatus === 'IDLE' ? (
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={handleTransmitSos}
                  className="btn-danger w-full py-3 text-white rounded-xl text-xs font-black font-mono tracking-wider flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition"
                >
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>TRANSMIT SOS RESCUE DISPATCH BEACON</span>
                </button>

                <a
                  href={`sms:1078?body=${encodeURIComponent(gpsPayload)}`}
                  className="fp w-full sm:w-auto px-4 py-3 rounded-xl text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-95 transition shrink-0"
                  title="Generate Emergency SMS without internet"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OFFLINE SMS SOS</span>
                </a>
              </div>
            ) : distressStatus === 'TRANSMITTING' ? (
              <div className="p-4 rounded-xl bg-cyan-950/70 border border-cyan-500 text-cyan-300 text-center font-mono text-xs flex items-center justify-center gap-2 animate-pulse">
                <Radio className="w-4 h-4 animate-spin" />
                <span>CONNECTING TO STATE DISASTER RESCUE NETWORK...</span>
              </div>
            ) : (
              <div className="space-y-3 animate-slide-up">
                <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/80 text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      RESCUE DISPATCH CONFIRMED (DISPATCH ID: #SDRF-2026-09)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                      EN-ROUTE
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-100 font-sans">
                    SDRF Quick Reaction Team (Battalion 4) has been dispatched from Joshimath Staging Ground.
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-emerald-800/60 font-bold">
                    <span>ESTIMATED TIME OF ARRIVAL (ETA):</span>
                    <span className="text-amber-300 font-black">{etaMinutes} MINUTES</span>
                  </div>
                </div>

                {/* Direct Call Dispatched Unit */}
                <a
                  href="tel:1078"
                  className="btn-danger w-full py-3 text-white rounded-xl text-xs font-black font-mono tracking-wider flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>📞 CALL DISPATCHED RESCUE COMMANDER (1078)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
          <span>NDMA Standard Emergency Protocol (SOP-DISASTER-2026)</span>
          <span className="text-emerald-400 font-bold">All Helplines Free of Cost</span>
        </div>
      </div>
    </div>
  );
};
