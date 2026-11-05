'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { HyderabadLocation } from '@/types';
import { HYDERABAD_LOCATIONS } from '@/data/mockData';

interface LocationContextType {
  currentLocation: HyderabadLocation;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  setLocation: (location: HyderabadLocation) => void;
  allLocations: HyderabadLocation[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<HyderabadLocation>(HYDERABAD_LOCATIONS[2]); // Default Hitec City
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('goduet_location');
      if (saved) {
        const found = HYDERABAD_LOCATIONS.find(l => l.id === saved);
        if (found) setCurrentLocation(found);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocation = (loc: HyderabadLocation) => {
    setCurrentLocation(loc);
    try {
      localStorage.setItem('goduet_location', loc.id);
    } catch {
      // ignore
    }
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        setLocation,
        allLocations: HYDERABAD_LOCATIONS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
