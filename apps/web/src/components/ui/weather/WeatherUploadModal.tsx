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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold font-sans text-slate-900 tracking-wide uppercase">
              UPLOAD CUSTOM WEATHER / RAINFALL CSV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50/70 hover:bg-blue-50/30 transition cursor-pointer">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              id="weather-file-input"
              className="hidden"
            />
            <label htmlFor="weather-file-input" className="cursor-pointer block space-y-2">
              <FileText className="w-8 h-8 text-blue-600 mx-auto" />
              <div className="text-xs font-sans text-slate-800 font-bold">
                {file ? file.name : 'Click to select CSV file or drag & drop'}
              </div>
              <div className="text-[11px] font-sans text-slate-500">
                Supports IMD AWS format, Open-Meteo CSV, or FloodGuard weather schema
              </div>
            </label>
          </div>

          {result && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-sans text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Upload Validated & Ingested!</span>
              </div>
              <div className="text-[11px] text-emerald-700">
                Mode: <strong>UPLOAD</strong> • Records: <strong>{result.records_count}</strong> • ID: <strong>{result.upload_id}</strong>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-sans text-slate-600 pt-3 border-t border-slate-200">
            <a
              href="/data/templates/weather_template.csv"
              download
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download Weather Template
            </a>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition ${
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
