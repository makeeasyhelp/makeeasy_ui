import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Search } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

const LocationModal = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    availableLocations,
    setSelectedLocation,
    isLoading
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Get unique states from available locations
  const states = useMemo(() => {
    const uniqueStates = [...new Set(availableLocations.map(loc => loc.state))];
    return ['All', ...uniqueStates.sort()];
  }, [availableLocations]);

  // Filter locations based on search and state
  const filteredLocations = useMemo(() => {
    return availableLocations.filter(location => {
      const matchesSearch = searchQuery === '' || 
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.state.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = selectedState === 'All' || location.state === selectedState;
      
      return matchesSearch && matchesState;
    });
  }, [availableLocations, searchQuery, selectedState]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    closeLocationModal();
    setSearchQuery('');
    setSelectedState('All');
  };

  // Reset filters when modal closes
  useEffect(() => {
    if (!isLocationModalOpen) {
      setSearchQuery('');
      setSelectedState('All');
    }
  }, [isLocationModalOpen]);

  if (!isLocationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLocationModal}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-brand-indigo" size={28} />
                Select Your Location
              </h2>
              <button
                onClick={closeLocationModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for your city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent"
              />
            </div>

            {/* State Filter */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedState === state
                      ? 'bg-brand-indigo text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Location Grid */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 220px)' }}>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="text-center py-20">
                <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 text-lg">No locations found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredLocations.map((location) => (
                  <motion.button
                    key={location._id}
                    onClick={() => handleLocationSelect(location)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-indigo hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    {/* New Badge */}
                    {location.isNew && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                        NEW
                      </span>
                    )}

                    {/* City Icon */}
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      {location.icon || '🏙️'}
                    </div>

                    {/* City Name */}
                    <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                      {location.city}
                    </h3>

                    {/* District, State */}
                    <p className="text-xs text-gray-500 truncate">
                      {location.district}, {location.state}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t px-6 py-4">
            <p className="text-center text-sm text-gray-500">
              Can't find your city? <span className="text-brand-indigo font-medium cursor-pointer hover:underline">Request a new location</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LocationModal;
