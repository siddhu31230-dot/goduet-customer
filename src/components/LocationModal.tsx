'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, Search, Check, X, Compass } from 'lucide-react';

export default function LocationModal() {
  const { currentLocation, isLocationModalOpen, closeLocationModal, setLocation, allLocations } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredLocations = allLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#c0d4d0]/60 overflow-hidden">
        {/* Header */}
        <div className="bg-[#e3edea] px-6 py-5 flex items-center justify-between border-b border-[#c0d4d0]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1f757a] text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1f757a] text-lg">Select Your Hyderabad Location</h3>
              <p className="text-xs text-[#4f504c]">Discover nearby restaurants and synchronized duets</p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#4f504c] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search locality (e.g. Hitec City, Banjara Hills, IIIT)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-gray-200 focus:outline-none focus:border-[#1f757a] focus:ring-2 focus:ring-[#1f757a]/20 transition-all bg-[#fafcfb]"
            />
          </div>

          <button
            onClick={() => {
              // Simulated GPS detect
              const hitec = allLocations.find(l => l.id === 'hitec-city') || allLocations[0];
              setLocation(hitec);
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#1f757a] bg-[#e6f1f0] hover:bg-[#d6e9e7] transition-colors"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            Use Current GPS Location (Hyderabad)
          </button>
        </div>

        {/* Locations List */}
        <div className="px-6 py-4 max-h-[340px] overflow-y-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4f504c] mb-2">
            Available Delivery Hubs
          </p>
          {filteredLocations.map(loc => {
            const isSelected = loc.id === currentLocation.id;
            return (
              <button
                key={loc.id}
                onClick={() => setLocation(loc)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#1f757a] bg-[#e6f1f0]/60 ring-1 ring-[#1f757a]'
                    : 'border-gray-100 hover:border-[#c0d4d0] hover:bg-[#fafcfb]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#1f757a] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#c0d4d0]/40'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{loc.name}</span>
                      {loc.isPopular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1f757a]/10 text-[#1f757a]">
                          Hotspot
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {loc.area} • PIN {loc.pincode} ({loc.zone})
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#1f757a] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>GoDuet delivers across Greater Hyderabad</span>
          <span className="font-semibold text-[#1f757a]">Avg Delivery: 32 mins</span>
        </div>
      </div>
    </div>
  );
}
