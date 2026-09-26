'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CloudRain, Radio, BellRing, 
  Compass, ArrowRight, CheckCircle2, X, Sparkles, MapPin, Eye 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Physical Convergence Prediction',
    tag: 'PILLAR 1 & 2',
    icon: CloudRain,
    accent: 'from-blue-600 to-cyan-600',
    headline: 'Multi-Factor Hydrodynamic Physics',
    description:
      'Unlike single-threshold weather apps, FloodGuard computes true physical convergence: combining extreme rainfall rates (48mm/3h), 82% antecedent soil saturation, and 28° mountain slope stability factors (FoS 0.94).',
    metrics: [
      { label: 'Rainfall', value: '48 mm / 3h' },
      { label: 'Soil Saturation', value: '82%' },
      { label: 'Slope FoS', value: '0.94 (Critical)' }
    ]
  },
  {
    step: 2,
    title: 'IoT Sensor Mesh & LoRaWAN',
    tag: 'HARDWARE TELEMETRY',
    icon: Radio,
    accent: 'from-amber-500 to-orange-600',
    headline: 'Real-Time Edge Hydrodynamic Telemetry',
    description:
      'Continuous stream from ridge weather stations (AWS-001), mid-slope soil moisture probes (TDR), and downstream river FMCW radars detecting stage surge (+0.40 m/h) over low-power LoRaWAN mesh networks.',
    metrics: [
      { label: 'River Stage', value: '3.8 m (+0.40m/h)' },
      { label: 'LoRa Mesh', value: '99.8% Online' },
      { label: 'Sample Rate', value: '30 seconds' }
    ]
  },
  {
    step: 3,
    title: '42-Minute Advance Lead Time',
    tag: 'ACTIONABLE AI',
    icon: BellRing,
    accent: 'from-red-600 to-rose-600',
    headline: 'Hyper-Local Ward-Level Warnings',
    description:
      'Delivers a decisive 42-minute actionable early warning window before surge crest reaches human settlements. Wards in the low-lying floodplain receive automated Common Alerting Protocol (CAP) evacuation dispatches.',
    metrics: [
      { label: 'Early Warning', value: '42 Min Lead Time' },
      { label: 'Composite Risk', value: '68.5 (HIGH)' },
      { label: 'Target Wards', value: 'Ward 1 & 4' }
    ]
  },
  {
    step: 4,
    title: 'Safe Route Evacuation Guidance',
    tag: 'LIFE SAFETY HUD',
    icon: Compass,
    accent: 'from-emerald-600 to-teal-600',
    headline: 'Zero-Casualty Evacuation Vectors',
    description:
      'Citizens and emergency responders receive live satellite guidance showing verified non-inundated upland escape routes to high-elevation refuge shelters (Govt. High School / Lata Ridge, +150m ASL).',
    metrics: [
      { label: 'Safe Refuge', value: 'Govt. High School' },
      { label: 'Elevation Gain', value: '+120 meters' },
      { label: 'Shelter Capacity', value: '650 Citizens' }
    ]
  }
];

export const ProductOnboardingTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const handleOpen = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };
    window.addEventListener('open-onboarding-tour', handleOpen);
    return () => window.removeEventListener('open-onboarding-tour', handleOpen);
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsOpen(false);
      showToast('Tour completed! You are now viewing the Live Command Center.', 'success', 'Ready for Evaluation');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white">
        
        {/* Top Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${current.accent} flex items-center justify-center text-white shadow-md`}>
              <StepIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                {current.tag} · STEP {current.step} OF {TOUR_STEPS.length}
              </span>
              <h3 className="text-sm font-black text-white">{current.title}</h3>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <h4 className="text-xl font-black tracking-tight text-white">
              {current.headline}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {current.description}
            </p>
          </div>

          {/* Key Proof Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            {current.metrics.map((m, idx) => (
              <div key={idx} className="text-center p-1.5">
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {m.label}
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-cyan-300 block mt-0.5">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to Step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-black bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition transform active:scale-95"
          >
            <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish & Explore Platform' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
