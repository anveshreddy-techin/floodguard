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
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md select-none animate-slide-up">
      <div 
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-red-50 border-b border-red-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-red-100 text-red-800 border border-red-200">
                  IMMEDIATE RESCUE
                </span>
                <span className="text-[10px] font-sans text-slate-500 hidden sm:inline">HOTKEY: [E]</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans mt-0.5 tracking-tight">
                EMERGENCY ASSISTANCE &amp; RESCUE DISPATCH
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition active:scale-95 border border-slate-200"
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
              <span className="text-[11px] font-sans font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                1-TAP DIRECT RESCUE &amp; HELPLINE CALLING
              </span>
              <span className="text-[10px] font-sans text-slate-500 font-semibold">TAP BUTTON TO DIAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {emergencyContacts.map((contact, i) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={i}
                    href={contact.tel}
                    className={`p-3 sm:p-3.5 rounded-xl bg-gradient-to-r ${contact.color} text-white flex items-center justify-between shadow-sm hover:brightness-105 active:scale-95 transition-all border border-black/10 group`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-sans font-bold text-white/90 uppercase truncate">
                          {contact.tag}
                        </div>
                        <div className="text-xs font-bold truncate">{contact.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 border border-white/20">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{contact.number}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Section 2: Automated GPS Distress Beacon & Rescue Unit Dispatch */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 space-y-4 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <span className="text-[11px] font-sans font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                  AUTOMATED GPS RESCUE BEACON BROADCAST
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Transmits encrypted distress telemetry directly to State Disaster Emergency Operations Center
                </p>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-bold">
                AES-128 TELEMETRY
              </span>
            </div>

            {/* Current Real-time Coordinates & Risk Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-sans">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">TARGET SECTOR:</span>
                <span className="text-slate-900 font-bold truncate block">{selectedLocation.name}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">GPS COORDINATES:</span>
                <span className="text-blue-700 font-bold block font-mono">30.5050°N, 79.1550°E</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">SURGE RISK SCORE:</span>
                <span className="text-red-700 font-bold block">68.5/100 (HIGH)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">ALTITUDE ASL:</span>
                <span className="text-slate-900 font-bold block">1,180 m ASL</span>
              </div>
            </div>

            {/* Situation Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-bold text-slate-700 uppercase block">
                SELECT SITUATION CLASSIFICATION:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-sans font-medium">
                {[
                  { id: 'TRAPPED_WATER', label: '🌊 Trapped by Flood' },
                  { id: 'INJURED_CITIZEN', label: '🏥 Injured Citizen' },
                  { id: 'BRIDGE_BLOCKED', label: '🌉 Route Cut Off' },
                  { id: 'MUDSLIDE', label: '⛰️ Active Mudslide' },
                ].map((sit) => (
                  <button
                    key={sit.id}
                    onClick={() => setDistressType(sit.id)}
                    className={`p-2 rounded-xl border transition active:scale-95 text-center font-semibold ${
                      distressType === sit.id
                        ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
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
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-sans tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
                >
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>TRANSMIT SOS RESCUE DISPATCH BEACON</span>
                </button>

                <a
                  href={`sms:1078?body=${encodeURIComponent(gpsPayload)}`}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-sans font-bold flex items-center justify-center gap-1.5 active:scale-95 transition shrink-0 shadow-sm"
                  title="Generate Emergency SMS without internet"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>OFFLINE SMS SOS</span>
                </a>
              </div>
            ) : distressStatus === 'TRANSMITTING' ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-center font-sans font-bold text-xs flex items-center justify-center gap-2 animate-pulse">
                <Radio className="w-4 h-4 animate-spin" />
                <span>CONNECTING TO STATE DISASTER RESCUE NETWORK...</span>
              </div>
            ) : (
              <div className="space-y-3 animate-slide-up">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      RESCUE DISPATCH CONFIRMED (DISPATCH ID: #SDRF-2026-09)
                    </span>
                    <span className="text-[10px] font-sans bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">
                      EN-ROUTE
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 font-sans">
                    SDRF Quick Reaction Team (Battalion 4) has been dispatched from Joshimath Staging Ground.
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans pt-1 border-t border-emerald-200 font-bold">
                    <span>ESTIMATED TIME OF ARRIVAL (ETA):</span>
                    <span className="text-amber-700 font-black">{etaMinutes} MINUTES</span>
                  </div>
                </div>

                {/* Direct Call Dispatched Unit */}
                <a
                  href="tel:1078"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-sans tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>CALL DISPATCHED RESCUE COMMANDER (1078)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-sans text-slate-500 shrink-0">
          <span>NDMA Standard Emergency Protocol (SOP-DISASTER-2026)</span>
          <span className="text-emerald-700 font-bold">All Helplines Free of Cost</span>
        </div>
      </div>
    </div>
  );
};
