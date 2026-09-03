'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { DataMode } from '@/types';

export type PageId =
  | 'command-center' | 'safety' | 'cascade' | 'simulation'
  | 'hindcast' | 'replay' | 'ledger' | 'audit' | 'incidents'
  | 'sensors' | 'events' | 'benchmark' | 'challenge' | 'system'
  | 'upload' | 'map' | 'village' | 'flight-recorder'
  | 'predict-save-prove' | 'login' | 'role-workspace' | 'default'
  | 'model-monitoring';

export type RiskState = 'UNKNOWN' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type EnvMode = 'LIVE' | 'DEMO' | 'SIMULATION' | 'HINDCAST' | 'REPLAY';

export interface EnvironmentState {
  page: PageId;
  riskState: RiskState;
  mode: EnvMode;
  rainfallMm: number;   // 0–150
  riverStage: number;   // 0–8 (m)
  soilSaturation: number; // 0–100
  timeStep: string;     // e.g. 'T-60', 'T0'
  setPage: (p: PageId) => void;
  setRiskState: (r: RiskState) => void;
  setMode: (m: EnvMode) => void;
  setRainfallMm: (v: number) => void;
  setRiverStage: (v: number) => void;
  setSoilSaturation: (v: number) => void;
  setTimeStep: (t: string) => void;
}

const defaultState: EnvironmentState = {
  page: 'command-center',
  riskState: 'HIGH',
  mode: 'DEMO',
  rainfallMm: 48,
  riverStage: 3.8,
  soilSaturation: 82,
  timeStep: 'NOW',
  setPage: () => {},
  setRiskState: () => {},
  setMode: () => {},
  setRainfallMm: () => {},
  setRiverStage: () => {},
  setSoilSaturation: () => {},
  setTimeStep: () => {},
};

export const EnvironmentContext = createContext<EnvironmentState>(defaultState);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, _setPage] = useState<PageId>('command-center');
  const [riskState, _setRiskState] = useState<RiskState>('HIGH');
  const [mode, _setMode] = useState<EnvMode>('DEMO');
  const [rainfallMm, _setRainfallMm] = useState<number>(48);
  const [riverStage, _setRiverStage] = useState<number>(3.8);
  const [soilSaturation, _setSoilSaturation] = useState<number>(82);
  const [timeStep, _setTimeStep] = useState<string>('NOW');

  return (
    <EnvironmentContext.Provider value={{
      page, riskState, mode, rainfallMm, riverStage, soilSaturation, timeStep,
      setPage: _setPage,
      setRiskState: _setRiskState,
      setMode: _setMode,
      setRainfallMm: _setRainfallMm,
      setRiverStage: _setRiverStage,
      setSoilSaturation: _setSoilSaturation,
      setTimeStep: _setTimeStep,
    }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => useContext(EnvironmentContext);
