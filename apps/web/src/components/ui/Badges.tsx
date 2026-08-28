import React from 'react';
import { RiskLevel, AlertSeverity, DataMode, EvidenceState, UncertaintyLevel } from '@/types';

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    MODERATE: 'bg-amber-950 text-amber-300 border-amber-700',
    HIGH: 'bg-orange-950 text-orange-300 border-orange-700',
    EXTREME: 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse',
    UNKNOWN: 'bg-slate-800 text-slate-300 border-slate-600',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded border ${styles[level] || styles.UNKNOWN}`}>
      {level} RISK
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const styles: Record<AlertSeverity, string> = {
    LOW: 'bg-blue-950 text-blue-300 border-blue-700',
    MODERATE: 'bg-amber-950 text-amber-300 border-amber-700',
    HIGH: 'bg-orange-950 text-orange-300 border-orange-700',
    EXTREME: 'bg-red-950 text-red-300 border-red-600 font-bold',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium uppercase rounded border ${styles[severity] || styles.LOW}`}>
      {severity}
    </span>
  );
};

export const DataModeBadge: React.FC<{ mode: DataMode }> = ({ mode }) => {
  const isSynthetic = mode === 'DEMO' || mode === 'SIMULATION';
  return (
    <span className={`px-2 py-0.5 text-xs font-mono rounded border ${
      isSynthetic 
        ? 'bg-purple-950/80 text-purple-300 border-purple-700/80' 
        : 'bg-cyan-950 text-cyan-300 border-cyan-700'
    }`}>
      MODE: {mode}
    </span>
  );
};

export const EvidenceStateBadge: React.FC<{ state: EvidenceState }> = ({ state }) => {
  return (
    <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800/90 text-slate-300 border border-slate-700">
      STATE: {state}
    </span>
  );
};

export const UncertaintyBadge: React.FC<{ level: UncertaintyLevel }> = ({ level }) => {
  const styles: Record<UncertaintyLevel, string> = {
    LOW: 'text-emerald-400 bg-emerald-950/50 border-emerald-800',
    MEDIUM: 'text-amber-400 bg-amber-950/50 border-amber-800',
    HIGH: 'text-rose-400 bg-rose-950/50 border-rose-800',
    INSUFFICIENT_DATA: 'text-slate-400 bg-slate-800/50 border-slate-700',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono rounded border ${styles[level] || styles.INSUFFICIENT_DATA}`}>
      UNCERTAINTY: {level}
    </span>
  );
};
