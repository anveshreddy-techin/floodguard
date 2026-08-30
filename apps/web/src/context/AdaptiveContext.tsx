'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLanguage, t as translateHelper } from '@/data/i18n';
import { LOCATIONS, LocationDossier, IndiaDisasterZone } from '@/data/locations';
import { INDIAN_STATES } from '@/data/states';

export type OperatingMode = 'DEMO' | 'REAL_PILOT';

export type UserRole =
  | 'CITIZEN'
  | 'VILLAGE_OPERATOR'
  | 'FIELD_RESPONDER'
  | 'DISTRICT_OPERATOR'
  | 'STATE_OPERATOR'
  | 'MEDICAL_OFFICER'
  | 'NATIONAL_OPERATOR'
  | 'ANALYST'
  | 'RESEARCHER'
  | 'ADMIN'
  | 'VIEWER';

export type InternalDataMode =
  | 'LIVE_DATA'
  | 'HISTORICAL_DATA'
  | 'UPLOAD_DATA'
  | 'SIMULATION_DATA'
  | 'DEGRADED'
  | 'UNAVAILABLE'
  | 'STALE';

export interface LocationHierarchy {
  country: string;
  state: string;
  district: string;
  basin: string;
  watershed: string;
  village: string;
}

export interface AdaptiveContextType {
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  hierarchy: LocationHierarchy;
  setHierarchy: React.Dispatch<React.SetStateAction<LocationHierarchy>>;
  setStateFilter: (stateName: string) => void;
  setDistrictFilter: (districtName: string) => void;
  setBasinFilter: (basinName: string) => void;
  setWatershedFilter: (wsName: string) => void;
  resetToNational: () => void;
  activeHazards: string[];
  regionalModel: string;
  dataMode: InternalDataMode;
  setDataMode: (dm: InternalDataMode) => void;
  breadcrumb: string;
  t: (key: string) => string;
  selectedLocation: LocationDossier;
  isCitizen: boolean;
  isOperator: boolean;
  isResponder: boolean;
  isMedicalOfficer: boolean;
  isAnalyst: boolean;
  isAdmin: boolean;
}

const defaultHierarchy: LocationHierarchy = {
  country: 'India',
  state: 'Uttarakhand',
  district: 'Chamoli',
  basin: 'Alaknanda Basin',
  watershed: 'Watershed-017 (Rishiganga)',
  village: 'Raini Village',
};

const AdaptiveContext = createContext<AdaptiveContextType | null>(null);

export const AdaptiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('DEMO');
  const [role, setRole] = useState<UserRole>('DISTRICT_OPERATOR');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [hierarchy, setHierarchy] = useState<LocationHierarchy>(defaultHierarchy);
  const [dataMode, setDataMode] = useState<InternalDataMode>('SIMULATION_DATA');

  // Find nearest matching location dossier
  const selectedLocation = useMemo(() => {
    const found = LOCATIONS.find(
      (l) =>
        l.state.toLowerCase() === hierarchy.state.toLowerCase() &&
        (l.region.toLowerCase().includes(hierarchy.district.toLowerCase()) ||
         l.name.toLowerCase().includes(hierarchy.village.toLowerCase()))
    );
    return found || LOCATIONS[0];
  }, [hierarchy]);

  // Derive location-adaptive hazard profile
  const { activeHazards, regionalModel } = useMemo(() => {
    const s = hierarchy.state.toLowerCase();
    if (s.includes('uttarakhand') || s.includes('himachal') || s.includes('jammu') || s.includes('ladakh')) {
      return {
        activeHazards: ['GLOF Screening', 'Cloudburst', 'Debris Flow', 'Rock-Ice Avalanche', 'River Blockage', 'Hydropower Surge'],
        regionalModel: 'baseline_himalayan_v1 (Orographic + Cryosphere Cascade)',
      };
    } else if (s.includes('assam') || s.includes('sikkim') || s.includes('meghalaya') || s.includes('arunachal')) {
      return {
        activeHazards: ['Brahmaputra Riverine Flood', 'Transboundary Surge', 'Siltation', 'Monsoon Cloudburst', 'Hill Cut-Slope Slip'],
        regionalModel: 'baseline_northeast_v1 (High-Precipitation Watershed Routing)',
      };
    } else if (s.includes('kerala') || s.includes('karnataka') || s.includes('maharashtra') && hierarchy.district.includes('Chiplun')) {
      return {
        activeHazards: ['Western Ghats Orographic Rain', 'Laterite Hillslope Slip', 'Reservoir Spill', 'Flash Flood'],
        regionalModel: 'baseline_western_ghats_v1 (Steep Catchment Saturated Runoff)',
      };
    } else if (s.includes('mumbai') || s.includes('bengaluru') || s.includes('chennai') || s.includes('hyderabad')) {
      return {
        activeHazards: ['Urban Stormwater Inundation', 'Drainage Surcharge', 'Underpass Submergence', 'Tidal Backwater'],
        regionalModel: 'baseline_urban_v1 (Impervious Surface Inundation)',
      };
    } else if (s.includes('odisha') || s.includes('andhra') || s.includes('tamil')) {
      return {
        activeHazards: ['Bay of Bengal Cyclone Surge', 'Estuarine Inundation', 'River-Sea Interaction', 'Saline Backflow'],
        regionalModel: 'baseline_coastal_v1 (Tidal + Estuarine Hydrodynamic Model)',
      };
    } else {
      return {
        activeHazards: ['Riverine Flood', 'Embankment Breach', 'Floodplain Overflow', 'Dam Release'],
        regionalModel: 'baseline_igp_v1 (Plains Hydrodynamic Flow Routing)',
      };
    }
  }, [hierarchy]);

  // Helper filters
  const setStateFilter = (stateName: string) => {
    const matchedState = INDIAN_STATES.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase() || s.id === stateName.toLowerCase()
    );
    setHierarchy((prev) => ({
      ...prev,
      state: matchedState ? matchedState.name : stateName,
      district: matchedState?.capital || 'District Central',
      basin: matchedState?.rivers[0] ? `${matchedState.rivers[0]} Basin` : 'Mainstem Basin',
      watershed: 'Watershed-Primary',
      village: 'All Village Clusters',
    }));
  };

  const setDistrictFilter = (districtName: string) => {
    setHierarchy((prev) => ({
      ...prev,
      district: districtName,
    }));
  };

  const setBasinFilter = (basinName: string) => {
    setHierarchy((prev) => ({
      ...prev,
      basin: basinName.includes('Basin') ? basinName : `${basinName} Basin`,
    }));
  };

  const setWatershedFilter = (wsName: string) => {
    setHierarchy((prev) => ({
      ...prev,
      watershed: wsName,
    }));
  };

  const resetToNational = () => {
    setHierarchy({
      country: 'India (National)',
      state: 'All States / UTs',
      district: 'All Districts',
      basin: 'All River Basins',
      watershed: 'National Overview',
      village: 'National Overview',
    });
  };

  const breadcrumb = useMemo(() => {
    if (hierarchy.country.includes('National')) {
      return 'INDIA (PAN-NATIONAL VIEW)';
    }
    return `INDIA / ${hierarchy.state.toUpperCase()} / ${hierarchy.district.toUpperCase()} / ${hierarchy.basin.toUpperCase()} / ${hierarchy.watershed.toUpperCase()}`;
  }, [hierarchy]);

  const t = (key: string) => translateHelper(key, language);

  return (
    <AdaptiveContext.Provider
      value={{
        operatingMode,
        setOperatingMode,
        role,
        setRole,
        language,
        setLanguage,
        hierarchy,
        setHierarchy,
        setStateFilter,
        setDistrictFilter,
        setBasinFilter,
        setWatershedFilter,
        resetToNational,
        activeHazards,
        regionalModel,
        dataMode,
        setDataMode,
        breadcrumb,
        t,
        selectedLocation,
        isCitizen: role === 'CITIZEN' || role === 'VIEWER',
        isOperator: ['VILLAGE_OPERATOR', 'DISTRICT_OPERATOR', 'STATE_OPERATOR', 'NATIONAL_OPERATOR'].includes(role),
        isResponder: role === 'FIELD_RESPONDER',
        isMedicalOfficer: role === 'MEDICAL_OFFICER',
        isAnalyst: ['ANALYST', 'RESEARCHER'].includes(role),
        isAdmin: role === 'ADMIN',
      }}
    >
      {children}
    </AdaptiveContext.Provider>
  );
};

export const useAdaptive = () => {
  const context = useContext(AdaptiveContext);
  if (!context) {
    throw new Error('useAdaptive must be used within an AdaptiveProvider');
  }
  return context;
};
