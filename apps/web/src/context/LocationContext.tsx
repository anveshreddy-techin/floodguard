'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationDossier {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  elevation: string;
  population: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  rainfall3h: string;
  soilMoisture: string;
  riverStage: string;
  leadTimeMinutes: number;
}

export const LOCATIONS: LocationDossier[] = [
  {
    id: 'demo-village-003',
    name: 'Sunderbans Nagar (Exposure Target)',
    region: 'Upper Himalayan Catchment (Sector 4)',
    lat: 30.5050,
    lon: 79.1550,
    elevation: '1,240 m ASL',
    population: 3400,
    riskScore: 68.5,
    riskLevel: 'HIGH',
    rainfall3h: '48.0 mm',
    soilMoisture: '82% (Critical)',
    riverStage: '3.80 m (+0.40 m/h)',
    leadTimeMinutes: 42,
  },
  {
    id: 'demo-village-001',
    name: 'Kedarnath Base / Mandakini Gorge',
    region: 'Garhwal Himalaya (Chorabari Basin)',
    lat: 30.7346,
    lon: 79.0669,
    elevation: '3,583 m ASL',
    population: 1200,
    riskScore: 78.0,
    riskLevel: 'EXTREME',
    rainfall3h: '64.5 mm',
    soilMoisture: '94% (Saturated)',
    riverStage: '4.60 m (+0.75 m/h)',
    leadTimeMinutes: 28,
  },
  {
    id: 'demo-village-002',
    name: 'Raini Village / Rishiganga Confluence',
    region: 'Chamoli District (Dhauliganga Basin)',
    lat: 30.4850,
    lon: 79.6920,
    elevation: '2,040 m ASL',
    population: 850,
    riskScore: 58.0,
    riskLevel: 'HIGH',
    rainfall3h: '12.0 mm',
    soilMoisture: '65%',
    riverStage: '5.20 m (Surge Wave)',
    leadTimeMinutes: 18,
  },
  {
    id: 'demo-village-004',
    name: 'Melamchi Bazaar Basin',
    region: 'Sindhupalchok (Nepal Himalaya)',
    lat: 27.8300,
    lon: 85.5800,
    elevation: '840 m ASL',
    population: 4200,
    riskScore: 72.0,
    riskLevel: 'HIGH',
    rainfall3h: '56.0 mm',
    soilMoisture: '89%',
    riverStage: '4.10 m (+0.55 m/h)',
    leadTimeMinutes: 35,
  },
];

interface LocationContextType {
  selectedLocation: LocationDossier;
  setSelectedLocation: (location: LocationDossier) => void;
  selectLocationById: (id: string) => void;
}

const LocationContext = createContext<LocationContextType>({
  selectedLocation: LOCATIONS[0],
  setSelectedLocation: () => {},
  selectLocationById: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationDossier>(LOCATIONS[0]);

  const selectLocationById = (id: string) => {
    const found = LOCATIONS.find((l) => l.id === id);
    if (found) setSelectedLocation(found);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        selectLocationById,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
