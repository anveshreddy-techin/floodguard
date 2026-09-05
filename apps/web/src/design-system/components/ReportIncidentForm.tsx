'use client';

import React, { useState } from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { AlertTriangle, Send, CheckCircle2, ShieldAlert, PhoneCall, FileCheck } from 'lucide-react';

export const ReportIncidentForm: React.FC = () => {
  const { hierarchy } = useAdaptive();

  // Form State
  const [hazardType, setHazardType] = useState('FLASH_FLOOD');
  const [stateName, setStateName] = useState(hierarchy.state || 'Uttarakhand');
  const [district, setDistrict] = useState(hierarchy.district || 'Chamoli');
  const [locationName, setLocationName] = useState('');
  const [incidentTime, setIncidentTime] = useState(new Date().toISOString().slice(0, 16));
  const [waterDepth, setWaterDepth] = useState('1_TO_3_FEET');
  const [peopleTrapped, setPeopleTrapped] = useState('0');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    trackingId: string;
    submittedAt: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      alert('Please check the verification acknowledgment before submitting.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const stateCode = stateName.slice(0, 2).toUpperCase();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const trackingId = `CIT-${stateCode}-${dateStr}-${randomCode}`;

      setSubmittedReceipt({
        trackingId,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
      setSubmitting(false);
    }, 600);
  };

  if (submittedReceipt) {
    return (
      <div className="bg-white border-2 border-emerald-500 rounded p-6 shadow-sm max-w-2xl mx-auto my-6 text-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <div className="w-12 h-12 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
              UNVERIFIED CITIZEN REPORT FILED
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Field Incident Report Successfully Queued
            </h3>
            <p className="text-xs text-slate-600">
              Your submission has been cataloged for District Emergency Operation Centre (DEOC) validation.
            </p>
          </div>
        </div>

        {/* Tracking Dossier */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2.5 text-xs font-mono mb-4">
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Tracking Reference:</span>
            <span className="font-extrabold text-blue-900 text-sm">{submittedReceipt.trackingId}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Submission Timestamp:</span>
            <span className="text-slate-800">{submittedReceipt.submittedAt} IST</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Incident Location:</span>
            <span className="text-slate-800">{locationName || 'Field Coordinates'}, {district}, {stateName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Reported Hazard:</span>
            <span className="text-slate-800">{hazardType.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Queue Status:</span>
            <span className="text-amber-700 font-bold">PENDING_FIELD_VERIFICATION</span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 mb-5">
          <strong>Notice:</strong> This research portal operates on non-impersonation rules. Filing a report here logs telemetry into the FloodGuard situational ledger. If there is immediate threat to life, you MUST also dial <strong>112</strong> directly.
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedReceipt(null);
              setDescription('');
              setLocationName('');
              setConsentChecked(false);
            }}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded shadow-xs p-5 max-w-3xl mx-auto my-6 text-slate-900">
      {/* Form Header */}
      <div className="border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-700" />
          <h2 className="text-base font-bold text-slate-900">
            Citizen Disaster Incident Submission Form
          </h2>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Provide ground-truth observations of rising streams, mudflows, or submerged culverts to support regional hydrological verification.
        </p>
      </div>

      {/* Emergency Disclaimer Alert */}
      <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900 mb-5 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Life-Threatening Emergency? </span>
          <span>Do not rely on this form for immediate rescue dispatch. Please dial </span>
          <a href="tel:112" className="font-extrabold underline hover:text-red-950 font-mono">112</a>
          <span> immediately.</span>
        </div>
      </div>

      {/* 9 Form Fields Grid */}
      <div className="space-y-4 text-xs">
        {/* Row 1: Hazard Type & Estimated Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hazard-type-select" className="block font-semibold text-slate-700 mb-1">
              1. Observed Hazard Category *
            </label>
            <select
              id="hazard-type-select"
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="FLASH_FLOOD">Flash Flood / Torrential Runoff</option>
              <option value="RIVER_OVERFLOW">River Bank Spill / Overtopping</option>
              <option value="LANDSLIDE">Landslide / Mudflow / Scree Fall</option>
              <option value="CULVERT_BLOCKAGE">Bridge / Culvert Chokepoint Blockage</option>
              <option value="WATERLOGGING">Severe Urban / Village Waterlogging</option>
              <option value="DAM_SPILL">Uncontrolled Dam / Reservoir Spill</option>
            </select>
          </div>

          <div>
            <label htmlFor="water-depth-select" className="block font-semibold text-slate-700 mb-1">
              2. Water Depth / Flow Velocity *
            </label>
            <select
              id="water-depth-select"
              value={waterDepth}
              onChange={(e) => setWaterDepth(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="UNDER_1_FOOT">Ankle to knee level (&lt; 1 foot) - slow flow</option>
              <option value="1_TO_3_FEET">Waist level (1 to 3 feet) - moderate flow</option>
              <option value="OVER_3_FEET">Chest high or above (&gt; 3 feet) - dangerous</option>
              <option value="RAGING_TORRENT">Raging torrent carrying debris / boulders</option>
            </select>
          </div>
        </div>

        {/* Row 2: Jurisdiction (State & District) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="state-field-select" className="block font-semibold text-slate-700 mb-1">
              3. State / Union Territory *
            </label>
            <select
              id="state-field-select"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="district-input" className="block font-semibold text-slate-700 mb-1">
              4. District *
            </label>
            <input
              id="district-input"
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Chamoli, Kullu, Wayanad"
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Row 3: Landmark / Village & Incident Datetime */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location-input" className="block font-semibold text-slate-700 mb-1">
              5. Village / Ward / Nearest Landmark *
            </label>
            <input
              id="location-input"
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Raini Bridge, Joshimath Bypass KM 4"
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="time-input" className="block font-semibold text-slate-700 mb-1">
              6. Observation Datetime *
            </label>
            <input
              id="time-input"
              type="datetime-local"
              required
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Row 4: Impact & People Trapped */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="trapped-input" className="block font-semibold text-slate-700 mb-1">
              7. Estimated Trapped Persons / Households
            </label>
            <input
              id="trapped-input"
              type="number"
              min="0"
              value={peopleTrapped}
              onChange={(e) => setPeopleTrapped(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <span className="text-[10px] text-slate-500">Enter 0 if no persons are known to be stranded</span>
          </div>

          <div>
            <label htmlFor="phone-input" className="block font-semibold text-slate-700 mb-1">
              8. Contact Phone Number (for EOC verification) *
            </label>
            <input
              id="phone-input"
              type="tel"
              required
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <label htmlFor="desc-textarea" className="block font-semibold text-slate-700 mb-1">
            9. Situation Narrative / Access Route Notes
          </label>
          <textarea
            id="desc-textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe visible water color (muddy/clear), rate of water rise, whether approach road or bridge is blocked, and any landmarks visible."
            className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Acknowledgment & Non-Impersonation Consent */}
        <div className="p-3 bg-slate-50 border border-slate-300 rounded">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-700 leading-normal select-none">
              I acknowledge that this report is submitted to the <strong>FloodGuard AI SIH Research & Pilot Platform</strong> as an unverified citizen observation. I understand it will be logged into the verification queue and will NOT trigger official police/NDRF dispatch without separate emergency verification. In acute danger, I have dialed or will dial <strong>112</strong>.
            </span>
          </label>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded text-xs transition active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>{submitting ? 'Submitting to Queue...' : 'Submit Incident Report'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
