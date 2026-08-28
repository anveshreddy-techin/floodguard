'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
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
  FileCheck
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function DataIngestionWorkbenchPage() {
  const [pipelineStep, setPipelineStep] = useState<number>(3); // 3: VALIDATE & MAP
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('imd_rainfall_sunderbans_station_2026.csv');

  const pipelineStages = [
    { name: 'SCAN & HASH', status: 'COMPLETE' },
    { name: 'SCHEMA PARSE', status: 'COMPLETE' },
    { name: 'PHYSICAL VALIDATION', status: 'ACTIVE' },
    { name: 'SPATIAL PROJECTION', status: 'QUEUED' },
    { name: 'RISK INFERENCE', status: 'QUEUED' },
  ];

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPipelineStep(4);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="UPLOAD" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="upload" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                  DATA INGESTION
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-cyan-400" />
                  DATA INGESTION & PIPELINE WORKBENCH
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated multi-source data quarantine, physical range enforcement, and schema validation
              </p>
            </div>
            <DataModeBadge mode="UPLOAD" />
          </div>

          {/* 5-Stage Interactive Pipeline Stepper */}
          <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                ACTIVE INGESTION PIPELINE FLOW
              </span>
              <span className="text-[10px] font-mono text-slate-400">STATUS: READY FOR UPLOAD</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
              {pipelineStages.map((stg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    idx < pipelineStep
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : idx === pipelineStep
                      ? 'bg-blue-600/30 border-cyan-400 text-cyan-200 ring-1 ring-cyan-500 animate-pulse'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span>0{idx + 1}</span>
                    {idx < pipelineStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="font-bold mt-2 text-xs">{stg.name}</div>
                  <div className="text-[9px] mt-1 opacity-75">{stg.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Dropzone & Health Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Dropzone (7 Cols) */}
            <div className="md:col-span-7 bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-100 text-sm">Upload Rainfall, River, or Soil Dataset</h3>
                <p className="text-xs text-slate-400">Supported formats: CSV, GeoJSON, NetCDF (Max 50MB)</p>
              </div>

              {/* Interactive Drop Box */}
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl p-8 text-center space-y-3 bg-[#070d1e] transition cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 border border-blue-600 mx-auto flex items-center justify-center text-cyan-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-xs">{fileName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">1,432 rows • 128 KB • SHA-256 Verified</div>
                </div>
              </div>

              <button
                onClick={handleSimulateUpload}
                disabled={isProcessing}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-bold transition flex items-center justify-center gap-2 text-xs shadow-lg"
              >
                {isProcessing ? 'PROCESSING PIPELINE...' : 'EXECUTE INGESTION & MODEL RE-CALCULATION'}
              </button>
            </div>

            {/* Right: Data Health & Quarantine Diagnostic (5 Cols) */}
            <div className="md:col-span-5 bg-[#0e1630] border border-[#223354] rounded-2xl p-5 space-y-4 shadow-xl text-xs">
              <div className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                INGESTION DATA QUALITY REPORT
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Accepted Records</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">1,420</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Quarantined (Range)</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">12</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Missing Columns</div>
                  <div className="text-lg font-bold text-slate-200 mt-0.5">0</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Data Integrity</div>
                  <div className="text-lg font-bold text-cyan-300 mt-0.5">99.1%</div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                <div className="text-amber-400 font-bold font-mono text-[10px] uppercase">Quarantine Diagnostics:</div>
                <p className="text-slate-300 leading-snug">
                  12 rows had rainfall intensity exceeding physical upper limit (&gt;250 mm/h). Automatically quarantined to prevent sensor noise from corrupting risk inference.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
