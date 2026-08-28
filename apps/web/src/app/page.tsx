'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { MetricCard } from '@/components/ui/MetricCard';
import { RiskBadge, SeverityBadge, DataModeBadge } from '@/components/ui/Badges';
import { EvidencePanel } from '@/components/ui/EvidencePanel';
import { UncertaintyPanel } from '@/components/ui/UncertaintyPanel';
import { CopilotDrawer } from '@/components/ui/CopilotDrawer';
import { ShieldAlert, CloudRain, Waves, AlertTriangle, Layers, ArrowRight, Bot } from 'lucide-react';
import { RiskAssessmentData, AlertData } from '@/types';

export default function DashboardPage() {
  const [copilotOpen, setCopilotOpen] = useState(false);

  const [riskData, setRiskData] = useState<RiskAssessmentData>({
    id: 'demo-assessment-1',
    assessed_at: new Date().toISOString(),
    risk_score: 68.5,
    risk_level: 'HIGH',
    confidence: 'LOW',
    uncertainty: 'MEDIUM',
    data_mode: 'DEMO',
    components: {
      rainfall_risk: 75.0,
      soil_risk: 82.0,
      terrain_risk: 55.0,
      river_risk: 42.0,
      historical_risk: 60.0,
    },
    contributors: [
      {
        name: 'rainfall_accumulation',
        score: 75.0,
        weight: 0.35,
        weighted_contribution: 26.25,
        evidence: ['3h cumulative rainfall: 48mm (exceeds mountain threshold)'],
        data_mode: 'DEMO',
      },
      {
        name: 'soil_saturation',
        score: 82.0,
        weight: 0.25,
        weighted_contribution: 20.5,
        evidence: ['Soil Saturation Index at 82% (near full saturation)'],
        data_mode: 'DEMO',
      },
      {
        name: 'terrain_steepness',
        score: 55.0,
        weight: 0.20,
        weighted_contribution: 11.0,
        evidence: ['Average catchment slope: 28° (high velocity runoff)'],
        data_mode: 'DEMO',
      },
      {
        name: 'river_level',
        score: 42.0,
        weight: 0.15,
        weighted_contribution: 6.3,
        evidence: ['Gauge station reading: 3.8m (rising +0.4m/hr)'],
        data_mode: 'DEMO',
      },
    ],
    explanation: {
      summary: 'High flash flood risk driven by rapid monsoon rainfall accumulation on pre-saturated steep slopes.',
      primary_driver: 'rainfall_accumulation',
      model_note: 'Hybrid rule-based baseline (v1). Not claimed as official IMD alert.',
    },
    data_gaps: [
      'Real-time IMD AWS telemetry unavailable (IP whitelist required) — fallback active',
      'CWC Gauge upstream telemetry simulated due to demo environment',
      'Soil moisture derived from antecedent precipitation model, not in-situ probes',
    ],
    limitations: [
      'Model calibrated for prototype demonstration using deterministic physics heuristics',
      'Village-level exposure bounds require high-res LiDAR for exact flood depth contouring',
    ],
  });

  const [activeAlerts, setActiveAlerts] = useState<AlertData[]>([
    {
      id: 'alert-001',
      alert_type: 'Flash Flood Watch',
      severity: 'HIGH',
      status: 'ACTIVE',
      title: 'Flash Flood Watch: Sunderbans Nagar & Downstream Basin',
      description: 'Heavy precipitation upstream in upper watershed with near-saturated terrain.',
      data_mode: 'DEMO',
      created_at: new Date().toISOString(),
      uncertainty: 'MEDIUM',
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode={riskData.data_mode} systemStatus="OPERATIONAL" />

      <div className="flex flex-1">
        <Sidebar activeTab="overview" />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto space-y-6">
          {/* Top Operational Status Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1c2541] border border-[#3a506b] rounded-lg p-4 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-slate-100">
                  Primary Command Center — Upper Demo Watershed
                </h1>
                <RiskBadge level={riskData.risk_level} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SIH26192 Autonomous Disaster Intelligence Platform | Village: Sunderbans Nagar (Exposure Target)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-3 py-1.5 rounded">
                COMPOSITE RISK: {riskData.risk_score}/100
              </span>
              <button
                onClick={() => setCopilotOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>Launch Grounded Copilot</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Estimated Risk"
              value={`${riskData.risk_score}%`}
              subtitle="Score (0-100)"
              badge={<RiskBadge level={riskData.risk_level} />}
              icon={<ShieldAlert className="w-4 h-4 text-orange-400" />}
              trend="↑ +14% last 3h"
            />
            <MetricCard
              title="Rainfall Intensity"
              value="48.0 mm"
              subtitle="3h Cumulative"
              badge={<span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">INTENSE</span>}
              icon={<CloudRain className="w-4 h-4 text-cyan-400" />}
              trend="+16mm/h peak"
            />
            <MetricCard
              title="Soil Saturation"
              value="82%"
              subtitle="Pre-conditioned"
              badge={<span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded">SATURATED</span>}
              icon={<Layers className="w-4 h-4 text-amber-400" />}
              trend="Runoff Factor: 0.88"
            />
            <MetricCard
              title="River Rate-of-Rise"
              value="+0.40 m/h"
              subtitle="Current: 3.80m"
              badge={<span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded">SURGING</span>}
              icon={<Waves className="w-4 h-4 text-blue-400" />}
              trend="Danger: 6.00m"
            />
          </div>

          {/* Upstream to Downstream Signature Cascade Ribbon */}
          <div className="bg-[#141d38] border border-[#3a506b] rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                UPSTREAM → DOWNSTREAM CASCADE PROPAGATION
              </span>
              <span className="text-[11px] font-mono text-slate-400">PHYSICS-BASED TRACE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="bg-[#1c2541] p-3 rounded border border-slate-700">
                <div className="text-slate-400 font-mono text-[10px]">STAGE 1: RIDGE</div>
                <div className="font-semibold text-slate-200 mt-1">Cloudburst Signal</div>
                <div className="text-cyan-400 text-[11px] mt-0.5">48mm / 3h</div>
              </div>
              <div className="flex items-center justify-center md:hidden"><ArrowRight className="w-4 h-4 text-slate-500" /></div>
              <div className="bg-[#1c2541] p-3 rounded border border-slate-700">
                <div className="text-slate-400 font-mono text-[10px]">STAGE 2: SLOPE</div>
                <div className="font-semibold text-slate-200 mt-1">Soil Saturation</div>
                <div className="text-amber-400 text-[11px] mt-0.5">82% Saturation</div>
              </div>
              <div className="flex items-center justify-center md:hidden"><ArrowRight className="w-4 h-4 text-slate-500" /></div>
              <div className="bg-[#1c2541] p-3 rounded border border-slate-700">
                <div className="text-slate-400 font-mono text-[10px]">STAGE 3: CHANNEL</div>
                <div className="font-semibold text-slate-200 mt-1">River Level Surge</div>
                <div className="text-orange-400 text-[11px] mt-0.5">+0.4m/h Rise</div>
              </div>
              <div className="flex items-center justify-center md:hidden"><ArrowRight className="w-4 h-4 text-slate-500" /></div>
              <div className="bg-[#1c2541] p-3 rounded border border-slate-700">
                <div className="text-slate-400 font-mono text-[10px]">STAGE 4: VALLEY</div>
                <div className="font-semibold text-slate-200 mt-1">Downstream Village</div>
                <div className="text-rose-400 text-[11px] mt-0.5">Sunderbans Nagar</div>
              </div>
              <div className="flex items-center justify-center md:hidden"><ArrowRight className="w-4 h-4 text-slate-500" /></div>
              <div className="bg-[#1c2541] p-3 rounded border border-cyan-800 bg-cyan-950/20">
                <div className="text-cyan-400 font-mono text-[10px]">STAGE 5: ACTION</div>
                <div className="font-semibold text-slate-200 mt-1">Evacuation Watch</div>
                <div className="text-cyan-300 text-[11px] mt-0.5">Shelter 1 Ready</div>
              </div>
            </div>
          </div>

          {/* Active Alerts Banner */}
          {activeAlerts.length > 0 && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                  ACTIVE OPERATIONAL ALERT
                </div>
                <SeverityBadge severity={activeAlerts[0].severity} />
              </div>
              <div className="text-slate-200 text-xs font-semibold">{activeAlerts[0].title}</div>
              <div className="text-slate-300 text-xs mt-1">{activeAlerts[0].description}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-rose-900/50">
                <span>Created: {new Date(activeAlerts[0].created_at || Date.now()).toLocaleTimeString()}</span>
                <span className="font-mono text-purple-300">DATA MODE: {activeAlerts[0].data_mode}</span>
              </div>
            </div>
          )}

          {/* Deep Explainability & Uncertainty Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EvidencePanel
              contributors={riskData.contributors}
              evidence={riskData.evidence}
              explanation={riskData.explanation}
            />
            <UncertaintyPanel
              uncertainty={riskData.uncertainty}
              confidence={riskData.confidence}
              dataGaps={riskData.data_gaps}
              limitations={riskData.limitations}
            />
          </div>
        </main>
      </div>

      {/* Grounded Copilot Drawer */}
      <CopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
}
