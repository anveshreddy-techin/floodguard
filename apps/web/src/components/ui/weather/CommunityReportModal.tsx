'use client';

import React, { useState } from 'react';
import { X, Send, MapPin, AlertTriangle, ShieldCheck, Camera, HelpCircle } from 'lucide-react';

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: any) => void;
  currentLocation: any;
}

export const CommunityReportModal: React.FC<CommunityReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentLocation,
}) => {
  const [reportType, setReportType] = useState('HEAVY_RAINFALL');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      location: {
        latitude: currentLocation?.latitude || 30.485,
        longitude: currentLocation?.longitude || 79.692,
        state: currentLocation?.state || 'Uttarakhand',
        district: currentLocation?.district || 'Chamoli',
        location_name: currentLocation?.name || 'Local Community Corridor',
      },
      report_type: reportType,
      severity: severity,
      description: description.trim(),
      has_photo: hasPhoto,
      is_anonymous: isAnonymous,
      reporter_contact_masked: contact ? `***-***-${contact.slice(-4)}` : null,
      language: 'en',
    });

    setDescription('');
    onClose();
  };

  const REPORT_TYPES = [
    { id: 'HEAVY_RAINFALL', label: '🌧️ Heavy Rainfall / Cloudburst' },
    { id: 'RISING_RIVER', label: '🌊 Rapid River / Canal Surge' },
    { id: 'BLOCKED_ROAD', label: '🚧 Blocked Road / Debris' },
    { id: 'BRIDGE_DAMAGE', label: '🌉 Bridge / Culvert Risk' },
    { id: 'LANDSLIDE', label: '⛰️ Slope Landslide / Mudflow' },
    { id: 'WATERLOGGING', label: '💧 Urban Waterlogging' },
    { id: 'THUNDERSTORM', label: '⚡ Severe Thunderstorm / Hail' },
    { id: 'RESCUE_NEED', label: '🆘 Urgent Rescue Assistance' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg bg-[#030712] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
              SUBMIT COMMUNITY / FIELD HAZARD REPORT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Location Pin Confirmation */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <MapPin className="w-3.5 h-3.5" /> REPORTING SECTOR:
            </span>
            <strong className="text-white">
              {currentLocation?.name || `${currentLocation?.district}, ${currentLocation?.state}`}
            </strong>
          </div>

          {/* Hazard Type Selector */}
          <div>
            <label className="text-[11px] font-mono font-bold text-slate-400 block mb-1.5">
              HAZARD / WEATHER EVENT TYPE:
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            >
              {REPORT_TYPES.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-950 text-slate-200">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Level */}
          <div>
            <label className="text-[11px] font-mono font-bold text-slate-400 block mb-1.5">
              OBSERVED SEVERITY LEVEL:
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={`py-1.5 rounded-xl font-bold border transition ${
                    severity === lvl
                      ? lvl === 'CRITICAL' || lvl === 'HIGH'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                        : 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Field Description */}
          <div>
            <label className="text-[11px] font-mono font-bold text-slate-400 block mb-1.5">
              OBSERVATION DETAILS & IMPACT:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe current ground situation, water depth, blocked routes, or nearby vulnerable structures..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Media & Privacy Checkboxes */}
          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs font-mono text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPhoto}
                onChange={(e) => setHasPhoto(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-cyan-400" /> Attach photo verification (Optional)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Submit anonymously (Mask reporter contact)</span>
            </label>
          </div>

          {/* Disclaimer */}
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800 text-[10px] font-mono text-amber-300">
            <strong>Transparency Notice:</strong> All community reports are submitted as <span className="underline">UNVERIFIED</span> and will be audited by district EOC operators before public warning issuance.
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl btn-primary text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>TRANSMIT COMMUNITY HAZARD REPORT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
