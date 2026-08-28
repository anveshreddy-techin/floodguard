'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  FileText, 
  ShieldCheck, 
  Database, 
  Activity, 
  Radio, 
  Cpu, 
  Bell, 
  Send, 
  ChevronRight,
  Hash,
  Clock
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function EvidenceGraphAuditPage() {
  const [selectedChainNode, setSelectedChainNode] = useState<number>(4); // Prediction node

  const chainNodes = [
    {
      id: 'SRC-001',
      title: 'In-Situ Radar & AWS Telemetry',
      stage: 'DATA SOURCE',
      hash: 'sha256:4a8c9b...1f2d',
      timestamp: '2026-08-28 13:45:00 UTC',
      detail: 'AWS tipping bucket (48mm/3h) and non-contact river radar (3.80m). HMAC signature verified.',
    },
    {
      id: 'OBS-002',
      title: 'Physical Ingestion Frame',
      stage: 'OBSERVATION',
      hash: 'sha256:7b1e4c...9a0e',
      timestamp: '2026-08-28 13:45:12 UTC',
      detail: 'Range validation passed (Rainfall < 250mm/h, Stage < 15m). Data quarantine clean.',
    },
    {
      id: 'FTR-003',
      title: 'Catchment Feature Vector',
      stage: 'FEATURE EXTRACTION',
      hash: 'sha256:9c2d1a...4f8b',
      timestamp: '2026-08-28 13:45:18 UTC',
      detail: 'Features: 3h accumulation (48mm), Soil saturation (82%), Mean slope (28°), Rate-of-rise (+0.40m/h).',
    },
    {
      id: 'MDL-004',
      title: 'Hydrological Risk Engine v9.2',
      stage: 'MODEL INFERENCE',
      hash: 'sha256:3d8a7c...2e1b',
      timestamp: '2026-08-28 13:45:22 UTC',
      detail: 'Ensemble weighted physics model evaluated: Composite Risk Score 68.5 / 100.',
    },
    {
      id: 'PRD-005',
      title: 'Immutable Prediction Snapshot',
      stage: 'PREDICTION RECORD',
      hash: 'sha256:6e1b9f...8a3d',
      timestamp: '2026-08-28 13:45:25 UTC',
      detail: 'KnowledgeSnapshot locked to PredictionLedger. Available_at timestamp sealed.',
    },
    {
      id: 'ALT-006',
      title: 'Flash Flood Watch Alert',
      stage: 'ALERT DISPATCH',
      hash: 'sha256:1a4f8b...7c2e',
      timestamp: '2026-08-28 13:45:30 UTC',
      detail: 'Alert ALT-001 issued to Sunderbans Nagar with Guidance Level 2 protocol.',
    },
  ];

  const current = chainNodes[selectedChainNode];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="audit" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  PROVENANCE & AUDIT
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  EVIDENCE GRAPH & END-TO-END PROVENANCE EXPLORER
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cryptographic audit trail tracing raw in-situ observations directly to issued public safety guidance
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master 6-Stage Provenance Pipeline */}
          <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                END-TO-END CAUSAL PROVENANCE CHAIN (CLICK NODE TO AUDIT)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">SHA-256 AUDIT: 100% VERIFIED</span>
            </div>

            {/* Visual Provenance Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
              {chainNodes.map((node, idx) => {
                const isSelected = selectedChainNode === idx;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedChainNode(idx)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-blue-600/30 border-cyan-400 text-slate-100 ring-2 ring-cyan-500 shadow-xl'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 font-bold">0{idx + 1} • {node.stage}</div>
                      <div className="text-xs font-bold text-slate-100 mt-1 leading-snug">{node.title}</div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                      {node.id}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Node Audit Inspector */}
            <div className="bg-[#070d1e] p-6 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest">{current.stage} AUDIT NODE</span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5">{current.title}</h3>
                </div>
                <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  CRYPTOGRAPHICALLY SEALED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px]">Cryptographic Digest (SHA-256)</div>
                  <div className="text-cyan-300 text-[11px] font-bold truncate">{current.hash}</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px]">Ingestion Timestamp (Atomic Clock)</div>
                  <div className="text-slate-200 text-[11px]">{current.timestamp}</div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase">Provenance Subsystem Detail</div>
                <p className="text-slate-200 text-xs leading-relaxed font-sans">{current.detail}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
