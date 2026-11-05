'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RestaurantCard from '@/components/RestaurantCard';
import { RESTAURANTS_DATA, CUISINES_LIST, HYDERABAD_LOCATIONS } from '@/data/mockData';
import { Search, Filter, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const initialCuisine = searchParams.get('cuisine') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [duetOnly, setDuetOnly] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'cost_asc' | 'cost_desc'>('rating');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');

  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS_DATA.filter((r) => {
      // Search
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisines.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.locality.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      // Cuisine filter
      if (selectedCuisine && !r.cuisines.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())) {
        return false;
      }

      // Duet only
      if (duetOnly && !r.isDuetEligible) return false;

      // Veg only
      if (vegOnly && !r.isPureVeg) return false;

      // Rating
      if (minRating > 0 && r.rating < minRating) return false;

      // Locality
      if (selectedLocality !== 'all' && !r.locality.toLowerCase().includes(selectedLocality.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTimeMins - b.deliveryTimeMins;
      if (sortBy === 'cost_asc') return a.costForTwo - b.costForTwo;
      if (sortBy === 'cost_desc') return b.costForTwo - a.costForTwo;
      return 0;
    });
  }, [searchTerm, selectedCuisine, duetOnly, vegOnly, minRating, sortBy, selectedLocality]);

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#e3edea] via-white to-[#fafcfb] p-6 sm:p-10 rounded-3xl border border-[#c0d4d0]/60 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#1f757a] text-white text-xs font-bold tracking-wide">
                  Hyderabad Dining Network
                </span>
                <span className="text-xs text-[#4f504c] font-medium">
                  {RESTAURANTS_DATA.length} Verified Partner Kitchens
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-950 mt-2">
                Discover Restaurants in Hyderabad
              </h1>
              <p className="text-xs sm:text-sm text-[#4f504c] mt-1 max-w-xl">
                Browse popular kitchens. Filter by Duet-Eligible spots to combine your main meal with desserts or shakes in one delivery!
              </p>
            </div>

            {/* Quick Duet Mode Toggle */}
            <button
              onClick={() => setDuetOnly(!duetOnly)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                duetOnly
                  ? 'bg-[#1f757a] text-white shadow-md shadow-[#1f757a]/20'
                  : 'bg-white border border-[#c0d4d0] text-[#1f757a] hover:bg-[#e6f1f0]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{duetOnly ? 'Showing Duet-Ready Only' : 'Filter Duet-Ready Spots'}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine (Biryani, Pizza, Shake), or locality (Madhapur, Banjara Hills)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-[#1f757a] focus:ring-2 focus:ring-[#1f757a]/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  vegOnly
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Pure Veg
              </button>

              <button
                onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  minRating === 4.8
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                ★ 4.8+ Top Rated
              </button>

              {/* Locality Selector */}
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:border-[#1f757a]"
              >
                <option value="all">All Hyderabad Localities</option>
                {HYDERABAD_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl font-bold text-gray-800 bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1f757a]"
              >
                <option value="rating">Rating (Highest)</option>
                <option value="delivery">Delivery Time (Fastest)</option>
                <option value="cost_asc">Cost: Low to High</option>
                <option value="cost_desc">Cost: High to Low</option>
              </select>
            </div>
          </div>

          {/* Cuisine Pill Scroll */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCuisine('')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCuisine === ''
                  ? 'bg-[#1f757a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Cuisines
            </button>
            {CUISINES_LIST.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCuisine(selectedCuisine === c.name ? '' : c.name)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedCuisine === c.name
                    ? 'bg-[#1f757a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length === 1 ? '' : 's'}</span>
          {duetOnly && (
            <span className="text-[#1f757a] font-bold">Showing only partner-synchronized kitchens</span>
          )}
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
            <p className="text-4xl">🍽️</p>
            <h3 className="font-bold text-gray-900 text-base">No restaurants matched your filters</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try clearing your search query or reset filters to see all available kitchens in Hyderabad.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCuisine('');
                setDuetOnly(false);
                setVegOnly(false);
                setMinRating(0);
                setSelectedLocality('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#1f757a] text-white text-xs font-bold hover:bg-[#15575b] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-gray-400">Loading Hyderabad restaurants...</div>}>
      <RestaurantsContent />
    </Suspense>
  );
}
