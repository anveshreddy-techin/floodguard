'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck, AlertTriangle, ArrowRight, Download } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'PRE_FLOOD' | 'DURING_FLOOD' | 'POST_FLOOD' | 'SURVIVAL_KIT';
  text: string;
  critical: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // 72-Hour Survival Kit
  { id: 'kit-1', category: 'SURVIVAL_KIT', text: '3 days of potable drinking water (3 litres per person per day)', critical: true },
  { id: 'kit-2', category: 'SURVIVAL_KIT', text: 'Non-perishable high-energy food (roasted gram, jaggery, biscuits)', critical: true },
  { id: 'kit-3', category: 'SURVIVAL_KIT', text: 'Waterproof pouch containing Aadhaar cards, ration card, land deeds, insurance policies', critical: true },
  { id: 'kit-4', category: 'SURVIVAL_KIT', text: 'LED torch + extra batteries or solar hand-crank charger', critical: true },
  { id: 'kit-5', category: 'SURVIVAL_KIT', text: 'First-aid box with antiseptic lotion, sterile gauze, ORS sachets, and chronic prescription medicines', critical: true },
  { id: 'kit-6', category: 'SURVIVAL_KIT', text: 'Loud whistle to signal rescue teams if marooned', critical: false },
  { id: 'kit-7', category: 'SURVIVAL_KIT', text: 'Charged power bank with micro-USB / Type-C cables', critical: false },

  // Pre-Flood Readiness
  { id: 'pre-1', category: 'PRE_FLOOD', text: 'Identify the nearest high-ground school, panchayat building, or temple shelter', critical: true },
  { id: 'pre-2', category: 'PRE_FLOOD', text: 'Clear drainage channels, rain gullies, and roadside culverts outside the residence', critical: false },
  { id: 'pre-3', category: 'PRE_FLOOD', text: 'Anchor exterior fuel barrels, LPG cylinders, and water tanks to prevent floating', critical: false },
  { id: 'pre-4', category: 'PRE_FLOOD', text: 'Agree on an emergency family rendezvous point located away from the river terrace', critical: true },

  // During Flood
  { id: 'during-1', category: 'DURING_FLOOD', text: 'Immediately disconnect main electric supply and turn off LPG regulator', critical: true },
  { id: 'during-2', category: 'DURING_FLOOD', text: 'NEVER walk or drive across flowing waters or culverts with submerged markers', critical: true },
  { id: 'during-3', category: 'DURING_FLOOD', text: 'Climb to the upper storey or hill slope if flash runoff enters the dwelling', critical: true },
  { id: 'during-4', category: 'DURING_FLOOD', text: 'Listen to All India Radio (AIR) or official district administration WhatsApp/SMS broadcasts', critical: false },

  // Post Flood
  { id: 'post-1', category: 'POST_FLOOD', text: 'Do not touch wet electrical switches or fallen power cables until inspected by utility staff', critical: true },
  { id: 'post-2', category: 'POST_FLOOD', text: 'Boil or chlorinate all drinking water to prevent waterborne epidemic outbreaks', critical: true },
  { id: 'post-3', category: 'POST_FLOOD', text: 'Watch for snakes, scorpions, and rodents sheltering in furniture or dry crevices', critical: false },
];

export const PreparednessCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SURVIVAL_KIT' | 'PRE_FLOOD' | 'DURING_FLOOD' | 'POST_FLOOD'>('SURVIVAL_KIT');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(['kit-1', 'pre-1']));

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredItems = DEFAULT_CHECKLIST.filter((i) => i.category === activeTab);
  const checkedCount = filteredItems.filter((i) => checkedIds.has(i.id)).length;

  return (
    <div className="bg-white border border-slate-300 rounded shadow-xs p-5 mb-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Community Disaster Preparedness & Survival Checklists
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Standard community mitigation guidelines adapted for mountainous and riverine catchments.
          </p>
        </div>

        {/* Progress pill */}
        <div className="text-xs font-mono bg-slate-100 border border-slate-300 px-3 py-1 rounded text-slate-700 font-semibold self-start sm:self-auto">
          Completed: {checkedCount} / {filteredItems.length} items
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 mb-4">
        {[
          { key: 'SURVIVAL_KIT', label: '72h Emergency Survival Kit' },
          { key: 'PRE_FLOOD', label: 'Pre-Monsoon Readiness' },
          { key: 'DURING_FLOOD', label: 'During Active Runoff' },
          { key: 'POST_FLOOD', label: 'Post-Flood Sanitation & Safety' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === tab.key
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Checklist Items */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isDone = checkedIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded border text-left text-xs transition cursor-pointer ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-300 text-slate-800'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0 text-slate-600">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <span className={`leading-relaxed ${isDone ? 'line-through text-slate-500' : 'text-slate-900 font-medium'}`}>
                  {item.text}
                </span>
                {item.critical && (
                  <span className="ml-2 text-[10px] font-bold text-red-700 uppercase bg-red-100 px-1.5 py-0.2 rounded border border-red-200">
                    Mandatory
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer notice */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>
          Guidelines compiled from NDMA / SDMA community preparedness manuals.
        </span>
        <button
          type="button"
          onClick={() => alert('PDF export template is available in the Documents & SOPs section.')}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline font-medium"
        >
          <Download className="w-3 h-3" />
          <span>Download Printable Checklist</span>
        </button>
      </div>
    </div>
  );
};
