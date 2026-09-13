import React from 'react';
import { RiskLevel, AlertSeverity, DataMode, EvidenceState, UncertaintyLevel } from '@/types';

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
    EXTREME: 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse',
    UNKNOWN: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded border ${styles[level] || styles.UNKNOWN}`}>
      {level} RISK
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const styles: Record<AlertSeverity, string> = {
    LOW: 'bg-blue-100 text-blue-800 border-blue-300',
    MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
    EXTREME: 'bg-red-100 text-red-800 border-red-400 font-bold',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium uppercase rounded border ${styles[severity] || styles.LOW}`}>
      {severity}
    </span>
  );
};

export const DataModeBadge: React.FC<{ mode: DataMode; compact?: boolean }> = ({ mode, compact }) => {
  const isSynthetic = mode === 'DEMO' || mode === 'SIMULATION';
  return (
    <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold rounded-lg border shrink-0 ${
      isSynthetic 
        ? 'bg-purple-100 text-purple-800 border-purple-300' 
        : 'bg-blue-100 text-blue-800 border-blue-300'
    }`}>
      {compact ? mode : (
        <>
          <span className="hidden sm:inline">MODE: </span>
          <span>{mode}</span>
        </>
      )}
    </span>
  );
};

export const EvidenceStateBadge: React.FC<{ state: EvidenceState }> = ({ state }) => {
  return (
    <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-300">
      STATE: {state}
    </span>
  );
};

export const UncertaintyBadge: React.FC<{ level: UncertaintyLevel }> = ({ level }) => {
  const styles: Record<UncertaintyLevel, string> = {
    LOW: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    MEDIUM: 'text-amber-700 bg-amber-100 border-amber-300',
    HIGH: 'text-rose-700 bg-rose-100 border-rose-300',
    INSUFFICIENT_DATA: 'text-slate-600 bg-slate-100 border-slate-300',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono rounded border ${styles[level] || styles.INSUFFICIENT_DATA}`}>
      UNCERTAINTY: {level}
    </span>
  );
};
