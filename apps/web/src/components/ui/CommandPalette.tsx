'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Compass, 
  Map, 
  History, 
  Award, 
  PlayCircle, 
  Activity, 
  Layers, 
  Database, 
  Radio, 
  BarChart3, 
  HelpCircle, 
  ShieldAlert,
  FileText,
  HeartPulse,
  UploadCloud,
  Globe,
  AlertTriangle,
  X
} from 'lucide-react';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: 'Public Information Portal (Institutional)', href: '/portal', icon: Globe, category: 'PUBLIC_PORTAL' },
    { label: 'Public Risk & Alerts Registry', href: '/portal/alerts', icon: AlertTriangle, category: 'PUBLIC_PORTAL' },
    { label: 'Public Evacuation Shelters Directory', href: '/portal/shelters', icon: Compass, category: 'PUBLIC_PORTAL' },
    { label: 'Citizen Incident Reporting Form', href: '/portal/report', icon: FileText, category: 'PUBLIC_PORTAL' },
    { label: 'Command Center (100vh Overview)', href: '/', icon: ShieldAlert, category: 'COMMAND' },
    { label: 'My Safety & Escape Guidance HUD', href: '/safety', icon: Compass, category: 'COMMAND' },
    { label: 'Hyper-Local Vector GIS Map', href: '/map', icon: Map, category: 'INTELLIGENCE' },
    { label: 'Upstream Ridge-to-Valley Cascade', href: '/cascade', icon: Layers, category: 'INTELLIGENCE' },
    { label: 'Village Dossier: Sunderbans Nagar', href: '/village/demo-village-003', icon: Map, category: 'INTELLIGENCE' },
    { label: 'Historical Hindcast Lab (5 Disasters)', href: '/hindcast', icon: History, category: 'INTELLIGENCE' },
    { label: 'Prediction Memory & Audit Ledger', href: '/ledger', icon: Database, category: 'INTELLIGENCE' },
    { label: 'Predict · Save · Prove (Flagship)', href: '/predict-save-prove', icon: Award, category: 'SPECIAL' },
    { label: 'Judge Challenge Mode (6 Stress Tests)', href: '/challenge', icon: HelpCircle, category: 'SPECIAL' },
    { label: 'Scenario Simulator & What-If Lab', href: '/simulation', icon: PlayCircle, category: 'LABS' },
    { label: 'Historical Event Time Machine', href: '/replay', icon: History, category: 'LABS' },
    { label: 'IoT & Telemetry Constellation', href: '/sensors', icon: Activity, category: 'LABS' },
    { label: 'Data Ingestion Pipeline Workbench', href: '/upload', icon: UploadCloud, category: 'LABS' },
    { label: 'Incident Command Operations Board', href: '/incidents', icon: FileText, category: 'OPERATIONS' },
    { label: 'Event Memory & Disaster Dossiers', href: '/events', icon: History, category: 'INTELLIGENCE' },
    { label: 'Event Benchmark (LOOCV Matrix)', href: '/benchmark', icon: BarChart3, category: 'INTELLIGENCE' },
    { label: 'Flight Recorder Black Box Timeline', href: '/flight-recorder', icon: Radio, category: 'INTELLIGENCE' },
    { label: 'Evidence Graph & Provenance Audit', href: '/audit', icon: FileText, category: 'GOVERNANCE' },
    { label: 'System Health & Telemetry Vitals', href: '/system', icon: HeartPulse, category: 'GOVERNANCE' },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1630] border border-[#223354] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a view, location, sensor, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs hover:bg-blue-600/30 hover:border-cyan-400/40 border border-transparent transition text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-white shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-200 group-hover:text-white">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 group-hover:text-cyan-300">
                    {item.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs font-mono">
              No matching views or commands found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#070d1e] text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>NAVIGATION SHORTCUTS: ESC to close</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </div>
  );
};
