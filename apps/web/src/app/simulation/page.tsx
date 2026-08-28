'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { PlayCircle, Sliders, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { RiskBadge, DataModeBadge, UncertaintyBadge } from '@/components/ui/Badges';
import { RiskLevel, UncertaintyLevel } from '@/types';

export default function ScenarioSimulationPage() {
  const [rainfallMmH, setRainfallMmH] = useState(48);
  const [durationHours, setDurationHours] = useState(3);
  const [soilMoisturePct, setSoilMoisturePct] = useState(82);
  const [riverLevelM, setRiverLevelM] = useState(3.8);
  const [sensorFailurePct, setSensorFailurePct] = useState(25);
  const [upstreamAnomaly, setUpstreamAnomaly] = useState(true);

  const [simResults, setSimResults] = useState<{
    composite_risk_score: number;
    risk_level: RiskLevel;
    uncertainty: UncertaintyLevel;
    components: {
      rainfall_risk: number;
      soil_risk: number;
      terrain_risk: number;
      river_risk: number;
    };
  }>({
    composite_risk_score: 68.5,
    risk_level: 'HIGH',
    uncertainty: 'MEDIUM',
    components: {
      rainfall_risk: 75.0,
      soil_risk: 82.0,
      terrain_risk: 55.0,
      river_risk: 42.0,
    },
  });

  const handleSimulate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/simulation/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'What-If Simulation Sandbox',
          parameters: {
            rainfall_mm_per_hour: rainfallMmH,
            duration_hours: durationHours,
            antecedent_moisture_pct: soilMoisturePct,
            river_level_m: riverLevelM,
            upstream_anomaly: upstreamAnomaly,
            sensor_failure_pct: sensorFailurePct,
          },
        }),
      });
      const data = await res.json();
      setSimResults(data.results);
    } catch (e) {
      const r_risk = Math.min(100, (rainfallMmH / 50) * 100);
      const s_risk = soilMoisturePct;
      const t_risk = 50;
      const riv_risk = Math.min(100, (riverLevelM / 10) * 100);
      const score = Math.min(100, r_risk * 0.35 + s_risk * 0.25 + t_risk * 0.20 + riv_risk * 0.15 + (upstreamAnomaly ? 5 : 0));
      const level: RiskLevel = score >= 75 ? 'EXTREME' : score >= 55 ? 'HIGH' : score >= 35 ? 'MODERATE' : 'LOW';

      setSimResults({
        composite_risk_score: Math.round(score * 10) / 10,
        risk_level: level,
        uncertainty: (sensorFailurePct > 20 ? 'HIGH' : 'MEDIUM') as UncertaintyLevel,
        components: {
          rainfall_risk: Math.round(r_risk * 10) / 10,
          soil_risk: Math.round(s_risk * 10) / 10,
          terrain_risk: t_risk,
          river_risk: Math.round(riv_risk * 10) / 10,
        },
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="SIMULATION" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="simulation" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-cyan-400" />
                SCENARIO SIMULATION & STRESS TEST ENGINE
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Simulate environmental perturbations, cloudburst bursts, and edge sensor blackout conditions
              </p>
            </div>
            <DataModeBadge mode="SIMULATION" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-700 pb-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                ENVIRONMENTAL & SENSOR PARAMETERS
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Rainfall Intensity (mm/h)</span>
                    <span className="font-mono text-cyan-400">{rainfallMmH} mm/h</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rainfallMmH}
                    onChange={(e) => setRainfallMmH(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Initial Soil Saturation (%)</span>
                    <span className="font-mono text-amber-400">{soilMoisturePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={soilMoisturePct}
                    onChange={(e) => setSoilMoisturePct(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">River Stage Level (m)</span>
                    <span className="font-mono text-blue-400">{riverLevelM} m</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={riverLevelM}
                    onChange={(e) => setRiverLevelM(Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Sensor Telemetry Failure Rate (%)</span>
                    <span className="font-mono text-rose-400">{sensorFailurePct}% Offline</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sensorFailurePct}
                    onChange={(e) => setSensorFailurePct(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-300">Simulate Upstream Debris Blockage</span>
                  <input
                    type="checkbox"
                    checked={upstreamAnomaly}
                    onChange={(e) => setUpstreamAnomaly(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulate}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recompute Scenario Risk & Propagation</span>
              </button>
            </div>

            <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-4">
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-orange-400" />
                    SIMULATION RISK OUTPUT
                  </h3>
                  <RiskBadge level={simResults.risk_level} />
                </div>

                <div className="bg-slate-900/90 p-4 rounded border border-slate-800 mb-4 text-center">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Simulated Composite Risk Score</div>
                  <div className="text-4xl font-extrabold font-mono text-cyan-300 my-1">
                    {simResults.composite_risk_score} / 100
                  </div>
                  <UncertaintyBadge level={simResults.uncertainty} />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Component Risk Breakdown:</div>
                  <div className="bg-slate-900/60 p-2 rounded flex justify-between">
                    <span className="text-slate-300">Rainfall Hazard Contribution:</span>
                    <span className="font-mono text-cyan-400 font-bold">{simResults.components.rainfall_risk}%</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded flex justify-between">
                    <span className="text-slate-300">Soil Saturation Contribution:</span>
                    <span className="font-mono text-amber-400 font-bold">{simResults.components.soil_risk}%</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded flex justify-between">
                    <span className="text-slate-300">River Surge Contribution:</span>
                    <span className="font-mono text-blue-400 font-bold">{simResults.components.river_risk}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 italic">
                Notice: Simulation outputs reflect rule-based sensitivity models for operator drill training. Not intended as physical twin without LiDAR bathymetry.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
