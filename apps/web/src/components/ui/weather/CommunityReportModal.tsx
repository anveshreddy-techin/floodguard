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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold font-sans text-slate-900 tracking-wide uppercase">
              SUBMIT COMMUNITY / FIELD HAZARD REPORT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Location Pin Confirmation */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs font-sans flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 text-blue-700 font-bold">
              <MapPin className="w-4 h-4 text-blue-600" /> REPORTING SECTOR:
            </span>
            <strong className="text-slate-900">
              {currentLocation?.name || `${currentLocation?.district}, ${currentLocation?.state}`}
            </strong>
          </div>

          {/* Hazard Type Selector */}
          <div>
            <label className="text-xs font-sans font-semibold text-slate-700 block mb-1.5">
              HAZARD / WEATHER EVENT TYPE:
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {REPORT_TYPES.map((t) => (
                <option key={t.id} value={t.id} className="bg-white text-slate-900">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Level */}
          <div>
            <label className="text-xs font-sans font-semibold text-slate-700 block mb-1.5">
              OBSERVED SEVERITY LEVEL:
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs font-sans">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={`py-2 rounded-xl font-bold border transition ${
                    severity === lvl
                      ? lvl === 'CRITICAL' || lvl === 'HIGH'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : lvl === 'MEDIUM'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Field Description */}
          <div>
            <label className="text-xs font-sans font-semibold text-slate-700 block mb-1.5">
              OBSERVATION DETAILS & IMPACT:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe current ground situation, water depth, blocked routes, or nearby vulnerable structures..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Media & Privacy Checkboxes */}
          <div className="space-y-2 border-t border-slate-200 pt-3 text-xs font-sans text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPhoto}
                onChange={(e) => setHasPhoto(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <Camera className="w-4 h-4 text-blue-600" /> Attach photo verification (Optional)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Submit anonymously (Mask reporter contact)</span>
            </label>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-sans text-amber-900">
            <strong>Transparency Notice:</strong> All community reports are submitted as <span className="underline font-semibold">UNVERIFIED</span> and will be audited by district EOC operators before public warning issuance.
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>TRANSMIT COMMUNITY HAZARD REPORT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
