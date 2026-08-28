'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  ShieldCheck, ArrowRight, Fingerprint, Database, Activity,
  CloudRain, Waves, Mountain, Eye, Lock, ChevronRight
} from 'lucide-react';
import { useEnvironment } from '@/context/EnvironmentContext';

const CHAIN_NODES = [
  { id: 'source',      label: 'DATA SOURCE',   icon: Database,   desc: 'IMD AWS-001 High Ridge Station, CWC Stage Gauge #1, ISRO SAR', color: '#38bdf8' },
  { id: 'observation', label: 'OBSERVATION',   icon: Eye,        desc: '48.0mm/3h rainfall, Stage 3.80m (+0.40m/h), TWI >8.5', color: '#06b6d4' },
  { id: 'feature',     label: 'FEATURE VECTOR',icon: Layers,     desc: 'F1=0.35, F2=0.25, F3=0.20, F4=0.20 (normalized composite)', color: '#818cf8' },
  { id: 'model',       label: 'RISK MODEL',    icon: Activity,   desc: 'rule_based_baseline_v9.2 → Score: 68.5/100 (HIGH)', color: '#a855f7' },
  { id: 'risk',        label: 'RISK DECISION', icon: ShieldCheck,desc: 'HIGH risk threshold exceeded. Guidance Level 2 triggered.', color: '#f97316' },
  { id: 'alert',       label: 'ALERT DISPATCH',icon: CloudRain,  desc: 'Alert dispatched 13:45 UTC. 42-minute lead time before peak.', color: '#ef4444' },
  { id: 'action',      label: 'OPERATOR ACTION',icon: Waves,     desc: 'NDRF activated. Siren network broadcast. Candidate routes issued.', color: '#10b981' },
];

// @ts-ignore (Layers is imported from lucide)
import { Layers } from 'lucide-react';

export default function AuditPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animIndex, setAnimIndex] = useState(0);

  useEffect(() => { setPage('audit'); setMode('DEMO'); }, []);

  // Sequentially illuminate nodes on mount
  useEffect(() => {
    if (animIndex < CHAIN_NODES.length) {
      const t = setTimeout(() => setAnimIndex(i => i + 1), 300);
      return () => clearTimeout(t);
    }
  }, [animIndex]);

  const active = CHAIN_NODES.find(n => n.id === selectedNode);

  return (
    <div className="flex flex-col min-h-screen">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="audit" />
        <main className="flex-1 p-3.5 sm:p-5 max-w-7xl mx-auto w-full pb-24 md:pb-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="chip chip-demo">AUDIT & PROVENANCE</span>
                <h1 className="text-xl font-black text-gradient-cyan flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  CAUSAL EVIDENCE GRAPH EXPLORER
                </h1>
              </div>
              <p className="text-xs text-slate-400">Click any node to inspect its evidence inputs and cryptographic seals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

            {/* ── Main: Animated causal chain ── */}
            <div className="xl:col-span-7">
              <div className="fp fp-operational rounded-3xl p-6 space-y-1">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold mb-4">
                  CAUSAL CHAIN: SOURCE → ACTION
                </div>

                {CHAIN_NODES.map((node, i) => {
                  const Icon = node.icon;
                  const isVisible = i < animIndex;
                  const isSelected = selectedNode === node.id;

                  return (
                    <div key={node.id}>
                      <button
                        onClick={() => setSelectedNode(isSelected ? null : node.id)}
                        className={`w-full flex items-center gap-4 p-3.5 rounded-2xl text-left transition-all duration-300 group ${
                          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        } ${isSelected
                            ? 'fp-operational ring-1 ring-cyan-500/50 scale-[1.01]'
                            : 'hover:bg-white/5'
                        }`}
                        style={{ transitionDelay: `${i * 60}ms` }}
                      >
                        {/* Node icon with color */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                          style={{
                            backgroundColor: `${node.color}20`,
                            border: `1.5px solid ${node.color}50`,
                            boxShadow: isSelected ? `0 0 16px ${node.color}40` : 'none',
                          }}
                        >
                          <Icon className="w-4 h-4" style={{ color: node.color }} />
                        </div>

                        {/* Label + desc */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-mono font-bold" style={{ color: node.color }}>
                            {String(i + 1).padStart(2, '0')} · {node.label}
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5 truncate">{node.desc}</div>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-cyan-400' : 'text-slate-600'}`}
                        />
                      </button>

                      {/* Animated connector arrow (not after last) */}
                      {i < CHAIN_NODES.length - 1 && (
                        <div className="flex items-center ml-5 my-1">
                          <div className="w-px bg-gradient-to-b h-5"
                            style={{ backgroundImage: `linear-gradient(to bottom, ${node.color}60, ${CHAIN_NODES[i+1].color}60)` }}
                          />
                          <svg viewBox="0 0 8 6" className="w-2 h-1.5 ml-[-1px]">
                            <polyline points="0,0 4,3 0,6" fill="none" stroke={CHAIN_NODES[i+1].color} strokeWidth="1.5" opacity="0.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT: Evidence Detail Panel ── */}
            <div className="xl:col-span-5">
              {active ? (
                <div className="fp fp-operational rounded-3xl p-6 space-y-4 animate-slide-up">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: active.color }}>
                      NODE DETAIL: {active.label}
                    </div>
                    <p className="text-sm text-slate-200 mt-2 leading-relaxed">{active.desc}</p>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="fp rounded-xl p-3 space-y-1.5">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">EVIDENCE INPUTS</div>
                      <div className="text-slate-300">IMD AWS-001 Station: 48.0mm/3h confirmed</div>
                      <div className="text-slate-300">CWC Radar Gauge #1: Stage 3.80m Rising</div>
                      <div className="text-slate-300">Soil Saturation Model API: TWI 8.7 (Critical)</div>
                    </div>

                    <div className="fp rounded-xl p-3 flex items-center gap-2.5 text-[11px]">
                      <Fingerprint className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-slate-400 text-[10px]">Cryptographic Digest</div>
                        <div className="text-purple-300 font-bold">sha256:4a8c9b...1f2d</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link href="/ledger" className="btn-primary flex-1 py-2 rounded-xl text-center text-xs font-bold font-mono text-white flex items-center justify-center gap-1.5">
                      <span>LEDGER ENTRY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/flight-recorder" className="btn-ghost flex-1 py-2 rounded-xl text-center text-xs font-bold font-mono text-slate-300 flex items-center justify-center gap-1.5">
                      <span>BLACK BOX</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="fp rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
                  <ShieldCheck className="w-10 h-10 text-slate-700" />
                  <div className="text-sm text-slate-500 font-mono">
                    Select a causal node to inspect<br />its evidence and cryptographic seal
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="fp rounded-2xl p-4 mt-4 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">AUDIT GUARANTEES</div>
                {['Zero Post-Hoc Manipulation (SHA-256 sealed)', 'Hindsight Lockout in Replay Mode', 'All Features Contemporaneous', '20/20 Unit Tests Passing'].map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
