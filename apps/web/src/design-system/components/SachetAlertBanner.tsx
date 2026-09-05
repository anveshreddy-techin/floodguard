'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Radio,
  Smartphone,
  Volume2,
  Tv,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';

export interface SachetAlertProps {
  district?: string;
  state?: string;
  severity?: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
}

export const SachetAlertBanner: React.FC<SachetAlertProps> = ({
  district = 'Chamoli',
  state = 'Uttarakhand',
  severity = 'RED',
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const headlineEn = `FLASH FLOOD & DEBRIS SURGE WARNING: Torrential rainfall runoff in ${district} catchment`;
  const headlineHi = `आकस्मिक बाढ़ एवं मलबा चेतावनी: ${district} जलग्रहण क्षेत्र में तीव्र वर्षा एवं जलप्रवाह`;

  const instructionEn =
    'Evacuate immediately from low-lying riverbeds and active gullies to designated high-ground shelters (GIC Upper Campus). Do not attempt to cross submerged culverts or bridges.';
  const instructionHi =
    'नदी तटवर्ती एवं निचले इलाकों से तत्काल सुरक्षित ऊंचे स्थानों (राजकीय इंटर कॉलेज परिसर) पर पहुंचे। जलमग्न पुलों अथवा नालों को पार करने का प्रयास न करें।';

  const handleCopy = () => {
    const textToCopy = `[NDMA SACHET CAP v1.2 ALERT]\n${headlineEn}\n${headlineHi}\n\nInstructions:\n${instructionEn}\n${instructionHi}\nEmergency: 112 / NDRF: 011-24363260`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-red-50 border-2 border-red-600 rounded-lg shadow-sm overflow-hidden mb-5 text-slate-900">
      {/* ── SACHET OFFICIAL HEADER BAR ── */}
      <div className="bg-red-700 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-white text-red-700 flex items-center justify-center font-black text-xs shrink-0">
            !
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wide">
              NDMA SACHET — National Disaster Early Warning Portal
            </span>
            <span className="bg-red-900/80 text-red-100 text-[10px] font-mono px-2 py-0.5 rounded border border-red-400/30">
              OASIS CAP v1.2
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="bg-white text-red-800 font-bold px-2 py-0.5 rounded">
            LEVEL 3: RED WARNING
          </span>
          <span className="text-red-100 hidden sm:inline">
            Ref: SACHET-CAP-UK-20260905-01
          </span>
        </div>
      </div>

      {/* ── BILINGUAL WARNING BODY ── */}
      <div className="p-4 sm:p-5 space-y-3 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-b border-slate-200 pb-3">
          {/* English Column */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700">
              ENGLISH WARNING (OFFICIAL)
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-950 leading-tight">
              {headlineEn}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {instructionEn}
            </p>
          </div>

          {/* Hindi Column */}
          <div className="space-y-1 bg-amber-50/50 p-2.5 rounded border border-amber-200/60">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900">
              हिन्दी चेतावनी (राष्ट्रीय आपदा प्रबंधन प्राधिकरण)
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-tight">
              {headlineHi}
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed">
              {instructionHi}
            </p>
          </div>
        </div>

        {/* ── MULTI-CHANNEL DISSEMINATION STATUS ── */}
        <div className="pt-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            MULTI-CHANNEL SACHET ALERT DISSEMINATION STATUS
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* Channel 1: Cell Broadcast */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-800 truncate">Cell Broadcast</div>
                <div className="text-[10px] font-mono text-emerald-600 font-bold">ACTIVE (36 Wards)</div>
              </div>
            </div>

            {/* Channel 2: NDMA SMS */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-800 truncate">SACHET SMS Gateway</div>
                <div className="text-[10px] font-mono text-emerald-600 font-bold">28,450 Transmitted</div>
              </div>
            </div>

            {/* Channel 3: Outdoor Sirens */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-800 truncate">Municipal Sirens</div>
                <div className="text-[10px] font-mono text-amber-700 font-bold">9 Towers Sounding</div>
              </div>
            </div>

            {/* Channel 4: AIR Radio */}
            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Tv className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-800 truncate">AIR / DD Override</div>
                <div className="text-[10px] font-mono text-purple-700 font-bold">Frequency Injected</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── EXPANDABLE OASIS CAP v1.2 METADATA ACCORDION ── */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-2 bg-slate-50 p-3 rounded">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
              OASIS COMMON ALERTING PROTOCOL (CAP v1.2) ATTRIBUTES
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px]">URGENCY</span>
                <strong className="text-red-700">Immediate</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">SEVERITY</span>
                <strong className="text-red-700">Extreme</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">CERTAINTY</span>
                <strong className="text-slate-900">Observed (88.5%)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">CATEGORY</span>
                <strong className="text-blue-700">Met / Geo</strong>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-600">
              Scope: Public · Restriction: None · Effective: 05 Sep 2026 13:15 IST · Expires: 05 Sep 2026 19:15 IST
            </div>
          </div>
        )}

        {/* ── ACTIONS BAR ── */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Alert Text' : 'Copy Bilingual Warning'}</span>
            </button>

            <a
              href="/api/v1/alerts/cap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-300 hover:bg-blue-50 text-blue-800 font-semibold transition active:scale-95"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-700" />
              <span>OASIS CAP v1.2 XML Feed</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>{expanded ? 'Hide CAP Details' : 'View CAP Attributes'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <Link
              href="/portal/shelters"
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-3.5 py-1.5 rounded transition shadow-xs flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Evacuate to Shelter</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
