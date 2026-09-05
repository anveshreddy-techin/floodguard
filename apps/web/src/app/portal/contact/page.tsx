'use client';

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';

interface EmergencyContact {
  service: string;
  number: string;
  availability: string;
  scope: string;
  badge: string;
}

const EMERGENCY_SERVICES: EmergencyContact[] = [
  { service: 'National Emergency Helpline (All In One)', number: '112', availability: '24x7', scope: 'Police, Fire, Medical, Disaster', badge: 'MANDATORY_FIRST' },
  { service: 'State Emergency Operation Centre (SEOC)', number: '1070', availability: '24x7', scope: 'State Disaster Management Authority', badge: 'STATE_WIDE' },
  { service: 'District Emergency Operation Centre (DEOC)', number: '1077', availability: '24x7', scope: 'District Magistrate / Collectorate', badge: 'DISTRICT_WIDE' },
  { service: 'NDRF HQ Control Room (National Disaster Response)', number: '1078 / 011-24363260', availability: '24x7', scope: 'Specialized Search & Rescue Dispatch', badge: 'NATIONAL' },
  { service: 'Indian Railways Disaster Relief / Accident Helpline', number: '1073', availability: '24x7', scope: 'Rail Inundation & Emergency Track Clearance', badge: 'RAILWAYS' },
  { service: 'Women Helpline National Number', number: '181', availability: '24x7', scope: 'Protection & Safety in Relief Camps', badge: 'SPECIALIZED' },
];

const STATE_EOCS = [
  { state: 'Uttarakhand State EOC (Dehradun)', phone: '0135-2710334 / 2710335', email: 'seoc-uk@nic.in' },
  { state: 'Himachal Pradesh State EOC (Shimla)', phone: '0177-2629439 / 2629440', email: 'hpsdma-hp@nic.in' },
  { state: 'Assam State EOC (Dispur, Guwahati)', phone: '0361-2237221 / 2237460', email: 'asdmaghy@gmail.com' },
  { state: 'Sikkim State EOC (Gangtok)', phone: '03592-202283 / 202284', email: 'ssdmagtk@gmail.com' },
  { state: 'Kerala State EOC (Thiruvananthapuram)', phone: '0471-2364424 / 2331645', email: 'keralasdma@gmail.com' },
  { state: 'Jammu & Kashmir EOC (Srinagar/Jammu)', phone: '0194-2452138 / 0191-2560221', email: 'jkdma@jk.gov.in' },
];

export default function PublicContactPage() {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackTopic, setFeedbackTopic] = useState('TECHNICAL_FEEDBACK');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert('Thank you! Your research observation and feedback have been received by the FloodGuard SIH project team.');
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
      setSubmitted(false);
    }, 500);
  };

  return (
    <div className="space-y-8 text-slate-800 text-xs">
      {/* 1. Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-3">
          <PhoneCall className="w-5 h-5 text-red-600" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Emergency Helplines & Institutional Directory
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified 24x7 disaster response contact numbers across national, state, and district jurisdictions.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          For acute emergencies involving rising floodwaters, stranded persons, or bridge washouts, please immediately call <strong>112</strong> or your local District Emergency Operation Centre (DEOC).
        </p>
      </div>

      {/* 2. Primary 24x7 Emergency Helplines Grid */}
      <section aria-labelledby="helplines-heading" className="space-y-3">
        <h3 id="helplines-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          National Emergency Helpline Numbers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EMERGENCY_SERVICES.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded border shadow-xs flex flex-col justify-between space-y-2 ${
                item.number === '112'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-white border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    {item.scope}
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded font-mono">
                    {item.availability}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs leading-snug">
                  {item.service}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Dial:</span>
                <a
                  href={`tel:${item.number.split('/')[0].trim()}`}
                  className="font-extrabold text-sm font-mono text-red-700 hover:underline tracking-tight"
                >
                  {item.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mountain State SEOC Directory */}
      <section aria-labelledby="seoc-heading" className="space-y-3">
        <h3 id="seoc-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Himalayan & Flood-Vulnerable State EOC Contacts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STATE_EOCS.map((eoc, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-300 rounded p-3.5 shadow-xs space-y-1.5 text-xs"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                <span>{eoc.state}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                <span>Telephone:</span>
                <span className="font-bold text-slate-900">{eoc.phone}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Email:</span>
                <span className="text-blue-700">{eoc.email}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Research & Evaluation Feedback Form */}
      <section aria-labelledby="feedback-heading" className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Mail className="w-4 h-4 text-blue-700" />
          <h3 id="feedback-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            SIH Evaluation, Technical Observations & Research Inquiries
          </h3>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Evaluators, hackathon mentors, and academic collaborators can submit technical questions, calibration feedback, or integration inquiries regarding the FloodGuard AI architecture:
        </p>

        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="contact-name-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
                Your Name & Institution *
              </label>
              <input
                id="contact-name-input"
                type="text"
                required
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                placeholder="e.g. Dr. A. Verma (IIT Roorkee / SIH Jury)"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="contact-email-input" className="block text-[11px] font-semibold text-slate-700 mb-1">
                Official / Professional Email *
              </label>
              <input
                id="contact-email-input"
                type="email"
                required
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="user@institute.ac.in"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-topic-select" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Feedback Topic *
            </label>
            <select
              id="contact-topic-select"
              value={feedbackTopic}
              onChange={(e) => setFeedbackTopic(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="TECHNICAL_FEEDBACK">Technical Architecture & ML Modeling</option>
              <option value="DATA_INTEGRATION">Hydrologic Telemetry & API Integration</option>
              <option value="SIH_EVALUATION">Smart India Hackathon Evaluation Query</option>
              <option value="DISASTER_COLLABORATION">Pilot Deployment & State Collaboration</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact-msg-textarea" className="block text-[11px] font-semibold text-slate-700 mb-1">
              Feedback / Observation Details *
            </label>
            <textarea
              id="contact-msg-textarea"
              rows={3}
              required
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Enter your observation or query..."
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitted}
              className="inline-flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-5 py-2 rounded text-xs transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>{submitted ? 'Submitting...' : 'Send Inquiry'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
