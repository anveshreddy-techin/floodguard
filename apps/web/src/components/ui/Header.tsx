import React from 'react';
import { DataModeBadge } from './Badges';

export const Header: React.FC<{
  dataMode?: 'LIVE' | 'HISTORICAL' | 'UPLOAD' | 'DEMO' | 'SIMULATION' | 'REPLAY';
  systemStatus?: string;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL' }) => {
  return (
    <header className="h-16 border-b border-[#3a506b] bg-[#0b132b] px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            FLOODGUARD AI
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
          SIH26192
        </span>
        <span className="text-xs text-slate-400 hidden md:inline">
          Hilly Region Flash Flood Intelligence
        </span>
      </div>

      <div className="flex items-center gap-3">
        <DataModeBadge mode={dataMode} />
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-slate-300">SYS: {systemStatus}</span>
        </div>
        <div className="text-xs text-slate-400 font-mono hidden sm:inline">
          AUTONOMOUS OP-CENTER
        </div>
      </div>
    </header>
  );
};
