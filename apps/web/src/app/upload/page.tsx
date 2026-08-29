'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Database, 
  Activity, 
  FileCheck,
  Cpu,
  Sparkles,
  Zap,
  Check,
  RefreshCw,
  FolderOpen,
  Filter
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function DataIngestionWorkbenchPage() {
  const { setPage, setMode } = useEnvironment();
  const [pipelineStep, setPipelineStep] = useState<number>(3); // 3: MAP
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('imd_rainfall_sunderbans_station_2026.csv');

  useEffect(() => {
    setPage('upload');
    setMode('DEMO');
  }, [setPage, setMode]);

  // 8 Official Pipeline Stages per Specification Section 36
  const pipelineStages = [
    { id: 0, name: 'UPLOAD', desc: 'Secure multipart file stream ingest', status: 'COMPLETE' },
    { id: 1, name: 'SCAN', desc: 'SHA-256 integrity hash & virus check', status: 'COMPLETE' },
    { id: 2, name: 'VALIDATE', desc: 'Hydrological schema & physical bounds check', status: 'COMPLETE' },
    { id: 3, name: 'MAP', desc: 'EPSG:32644 UTM coordinate projection', status: 'ACTIVE' },
    { id: 4, name: 'CLEAN', desc: 'Outlier rejection & baseline zero-offset', status: 'QUEUED' },
    { id: 5, name: 'TRANSFORM', desc: 'Feature engineering & Antecedent API index', status: 'QUEUED' },
    { id: 6, name: 'ANALYZE', desc: 'Cascade slope runoff acceleration calc', status: 'QUEUED' },
    { id: 7, name: 'PREDICT', desc: 'Multi-factor risk score generation', status: 'QUEUED' },
  ];

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setPipelineStep(0);
    
    // Smooth step-by-step pipeline animation
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setPipelineStep(current);
      if (current >= 7) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 450);
  };

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#020714]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="upload" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-6xl mx-auto space-y-6 pb-24 md:pb-6 overflow-y-auto">
          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-demo">PIPELINE WORKBENCH</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-cyan-400" />
                  DATA INGESTION & 8-STAGE TRANSFORMATION FLOW
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Automated data pipeline processing IMD AWS rainfall feeds, CWC river gauge series, and USGS/ALOS DEM rasters
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master Drag & Drop Zone */}
          <div className="fp fp-operational rounded-3xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden border border-cyan-500/30">
            <div className="w-16 h-16 rounded-3xl bg-cyan-950/80 border-2 border-dashed border-cyan-400 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Drag & Drop Telemetry or GIS File</h3>
              <p className="text-xs text-slate-400 mt-1">Supports IMD AWS (.csv), CWC Stage (.json), GeoTIFF DEM (.tif), or SHP vectors</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handleSimulateUpload}
                disabled={isProcessing}
                className="btn-primary px-6 py-2.5 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-xl active:scale-95 transition"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" /> : <Zap className="w-4 h-4 text-amber-300" />}
                <span>{isProcessing ? 'RUNNING 8-STAGE PIPELINE...' : 'EXECUTE SAMPLE PIPELINE'}</span>
              </button>
            </div>
          </div>

          {/* ── 8-STAGE VISUAL DATA FLOW PIPELINE (Section 36 Spec) ── */}
          <div className="fp fp-operational rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  DATA FLOW PIPELINE: UPLOAD → SCAN → VALIDATE → MAP → CLEAN → TRANSFORM → ANALYZE → PREDICT
                </span>
                <span className="text-[10px] font-mono text-slate-400">Current Target: {selectedDataset}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                STAGE {pipelineStep + 1} OF 8
              </span>
            </div>

            {/* Pipeline Visual Node Horizontal Track */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {pipelineStages.map((stg) => {
                const isComplete = stg.id < pipelineStep;
                const isActive = stg.id === pipelineStep;
                const isQueued = stg.id > pipelineStep;

                return (
                  <div
                    key={stg.id}
                    className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-2 ${
                      isActive
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                        : isComplete
                        ? 'bg-slate-900/60 border-emerald-500/50 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-black">0{stg.id + 1}</span>
                      {isComplete ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <div className={`font-mono text-xs font-black tracking-tight ${isActive ? 'text-white' : isComplete ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {stg.name}
                    </div>
                    <div className="text-[9px] font-sans text-slate-400 leading-tight">
                      {stg.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Transformation Inspector Box */}
            <div className="fp p-4 rounded-2xl space-y-2 font-mono text-xs border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-2">
                <span>IN-MEMORY TRANSFORMATION STREAM</span>
                <span className="text-emerald-400 font-bold">100% INGESTION INTEGRITY</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">SHA-256 Checksum:</span>
                  <span className="text-cyan-300 truncate block">a7f82b99c104e76d33...</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Spatial Projection:</span>
                  <span className="text-slate-200 block">EPSG:32644 (UTM Zone 44N)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Derived Risk Factor:</span>
                  <span className="text-orange-400 font-bold block">+26.2 pts (Rainfall Index)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
