'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, Package, Droplet, Tent, Activity, Radio } from 'lucide-react';

export const ImpactCalculator: React.FC<{
  onSelectAmount: (amt: number) => void;
}> = ({ onSelectAmount }) => {
  const [sliderVal, setSliderVal] = useState<number>(3500);

  // Calculations based on standard NDMA/SDRF disaster relief unit economics
  const rationKits = Math.max(1, Math.floor(sliderVal / 500));
  const waterPurifiers = Math.max(1, Math.floor(sliderVal / 750));
  const shelterTarps = Math.floor(sliderVal / 1750);
  const medicalKits = Math.floor(sliderVal / 1200);

  return (
    <div className="fp fp-operational p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm sm:text-base font-black font-mono text-white tracking-wide uppercase">
            DISASTER RELIEF IMPACT CALCULATOR
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800">
          Standardized SDRF Relief Unit Costs
        </span>
      </div>

      {/* Slider Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono">
          <span className="text-xs text-slate-400">Contribution Scale:</span>
          <span className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
            ₹{sliderVal.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={sliderVal}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>₹500 (Basic Ration)</span>
          <span>₹10,000 (Community Support)</span>
          <span>₹50,000 (Sensor & Camp Sponsor)</span>
        </div>
      </div>

      {/* Tangible Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <div className="text-xl">🍞</div>
          <div className="text-base sm:text-lg font-black text-white font-mono">{rationKits}</div>
          <div className="text-[10px] font-mono text-slate-400">Dry Ration Packs</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <div className="text-xl">💧</div>
          <div className="text-base sm:text-lg font-black text-cyan-300 font-mono">{waterPurifiers * 50}L</div>
          <div className="text-[10px] font-mono text-slate-400">Purified Drinking Water</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <div className="text-xl">⛺</div>
          <div className="text-base sm:text-lg font-black text-amber-300 font-mono">{shelterTarps}</div>
          <div className="text-[10px] font-mono text-slate-400">High-Ground Tents</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <div className="text-xl">🩺</div>
          <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">{medicalKits}</div>
          <div className="text-[10px] font-mono text-slate-400">First-Aid Medical Kits</div>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={() => onSelectAmount(sliderVal)}
        className="w-full py-2.5 rounded-xl btn-primary text-white font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"
      >
        <Heart className="w-3.5 h-3.5 fill-white" />
        <span>PLEDGE THIS RELIEF IMPACT (₹{sliderVal.toLocaleString()})</span>
      </button>
    </div>
  );
};
