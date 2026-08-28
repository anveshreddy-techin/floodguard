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
  FileCheck
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function DataIngestionWorkbenchPage() {
  const { setPage, setMode } = useEnvironment();
  const [pipelineStep, setPipelineStep] = useState<number>(3); // 3: VALIDATE & MAP
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('imd_rainfall_sunderbans_station_2026.csv');

  useEffect(() => {
    setPage('upload');
    setMode('DEMO');
  }, [setPage, setMode]);

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
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="upload" />

        <main className="flex-1 p-5 lg:p-6 max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-demo">DATA INGESTION</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-cyan-400" />
                  DATA INGESTION & PIPELINE WORKBENCH
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Ingest IMD AWS CSVs, CWC river gauge records, and DEM geotiffs with automated validation
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master Ingestion Drag & Drop Zone */}
          <div className="fp fp-operational rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-cyan-950/80 border-2 border-dashed border-cyan-400 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Drag & Drop Telemetry or GIS File</h3>
              <p className="text-xs text-slate-400 mt-1">Supports IMD AWS (.csv), CWC Stage (.json), GeoTIFF DEM (.tif)</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleSimulateUpload}
                disabled={isProcessing}
                className="btn-primary px-5 py-2.5 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-xl"
              >
                {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                <span>{isProcessing ? 'PROCESSING PIPELINE...' : 'PARSE DEMO DATASET'}</span>
              </button>
            </div>
          </div>

          {/* Active Pipeline Stages */}
          <div className="fp rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
              <span className="font-bold text-white uppercase">INGESTION PIPELINE EXECUTION PROGRESS</span>
              <span className="text-cyan-300">File: {fileName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {pipelineStages.map((stg, i) => (
                <div
                  key={stg.name}
                  className={`p-3.5 rounded-2xl border text-xs font-mono text-center space-y-1 ${
                    stg.status === 'COMPLETE'
                      ? 'fp-operational text-emerald-300'
                      : stg.status === 'ACTIVE'
                      ? 'fp ring-1 ring-cyan-400 text-cyan-300'
                      : 'fp text-slate-500 opacity-60'
                  }`}
                >
                  <div className="text-[10px] uppercase">{stg.name}</div>
                  <div className="text-[9px] font-bold">{stg.status}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
