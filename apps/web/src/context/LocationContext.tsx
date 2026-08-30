'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LOCATIONS, 
  LocationDossier, 
  IndiaDisasterZone, 
  DisasterApplicationType 
} from '@/data/locations';

export * from '@/data/locations';

interface LocationContextType {
  selectedLocation: LocationDossier;
  activeZoneFilter: IndiaDisasterZone | 'ALL';
  setActiveZoneFilter: (zone: IndiaDisasterZone | 'ALL') => void;
  setSelectedLocation: (location: LocationDossier) => void;
  selectLocationById: (id: string) => void;
  filteredLocations: LocationDossier[];
}

const LocationContext = createContext<LocationContextType>({
  selectedLocation: LOCATIONS[LOCATIONS.length - 1], // Default: demo-village-003
  activeZoneFilter: 'ALL',
  setActiveZoneFilter: () => {},
  setSelectedLocation: () => {},
  selectLocationById: () => {},
  filteredLocations: LOCATIONS,
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationDossier>(LOCATIONS[LOCATIONS.length - 1]);
  const [activeZoneFilter, setActiveZoneFilter] = useState<IndiaDisasterZone | 'ALL'>('ALL');

  const selectLocationById = (id: string) => {
    const found = LOCATIONS.find((l) => l.id === id);
    if (found) {
      setSelectedLocation(found);
    }
  };

  const filteredLocations = activeZoneFilter === 'ALL'
    ? LOCATIONS
    : LOCATIONS.filter((l) => l.zone === activeZoneFilter);

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        activeZoneFilter,
        setActiveZoneFilter,
        setSelectedLocation,
        selectLocationById,
        filteredLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
