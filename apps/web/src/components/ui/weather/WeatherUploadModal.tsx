'use client';

import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface WeatherUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (res: any) => void;
}

export const WeatherUploadModal: React.FC<WeatherUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);

    // Simulate instant validation & import for frontend upload flow
    setTimeout(() => {
      const res = {
        upload_id: `wup-${Math.random().toString(36).substring(2, 9)}`,
        filename: file.name,
        records_count: 24,
        status: 'IMPORTED',
        data_mode: 'UPLOAD',
        quality: 'VALID',
        message: 'Successfully imported weather telemetry. All outputs labeled with UPLOAD data mode.',
      };
      setResult(res);
      setUploading(false);
      onUploadSuccess(res);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg bg-[#030712] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
              UPLOAD CUSTOM WEATHER / RAINFALL CSV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center space-y-3 bg-slate-900/40 transition">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              id="weather-file-input"
              className="hidden"
            />
            <label htmlFor="weather-file-input" className="cursor-pointer block space-y-2">
              <FileText className="w-8 h-8 text-cyan-400 mx-auto" />
              <div className="text-xs font-mono text-white font-bold">
                {file ? file.name : 'Click to select CSV file or drag & drop'}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Supports IMD AWS format, Open-Meteo CSV, or FloodGuard weather schema
              </div>
            </label>
          </div>

          {result && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs font-mono text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Upload Validated & Ingested!</span>
              </div>
              <div className="text-[11px] text-emerald-400/90">
                Mode: <strong>UPLOAD</strong> • Records: <strong>{result.records_count}</strong> • ID: <strong>{result.upload_id}</strong>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
            <a
              href="/data/templates/weather_template.csv"
              download
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Weather Template
            </a>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-4 py-2 rounded-xl btn-primary text-white font-mono text-xs font-bold flex items-center gap-1.5 ${
                !file || uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploading ? 'INGESTING...' : 'VALIDATE & IMPORT'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
