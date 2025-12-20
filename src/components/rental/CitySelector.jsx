import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Search, Navigation, CheckCircle } from 'lucide-react';

/**
 * City Selector Component for Rental System
 * Allows users to select a city for rental pricing and availability
 */
const CitySelector = ({ 
  isOpen, 
  onClose, 
  onSelectCity, 
  availableCities = [],
  currentCity = null,
  productCityPricing = {} // { city: { monthlyRent, deposit, deliveryCharge } }
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [isDetecting, setIsDetecting] = useState(false);

  // List of major cities for rental service
  const majorCities = useMemo(() => {
    if (availableCities.length > 0) {
      return availableCities;
    }
    // Default cities if not provided
    return [
      { city: 'Mumbai', state: 'Maharashtra' },
      { city: 'Delhi', state: 'Delhi' },
      { city: 'Bangalore', state: 'Karnataka' },
      { city: 'Pune', state: 'Maharashtra' },
      { city: 'Hyderabad', state: 'Telangana' },
      { city: 'Chennai', state: 'Tamil Nadu' },
      { city: 'Kolkata', state: 'West Bengal' },
      { city: 'Ahmedabad', state: 'Gujarat' },
      { city: 'Jaipur', state: 'Rajasthan' },
      { city: 'Lucknow', state: 'Uttar Pradesh' },
    ];
  }, [availableCities]);

  // Get unique states
  const states = useMemo(() => {
    const uniqueStates = [...new Set(majorCities.map(loc => loc.state))];
    return ['All', ...uniqueStates.sort()];
  }, [majorCities]);

  // Filter cities based on search and state
  const filteredCities = useMemo(() => {
    return majorCities.filter(location => {
      const matchesSearch = searchQuery === '' || 
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.state.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = selectedState === 'All' || location.state === selectedState;
      
      return matchesSearch && matchesState;
    });
  }, [majorCities, searchQuery, selectedState]);

  // Auto-detect location using browser geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get city name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          // Extract city from the address
          const detectedCity = data.address?.city || 
                              data.address?.town || 
                              data.address?.village || 
                              data.address?.state_district;
          
          if (detectedCity) {
            // Find matching city in our list
            const matchedCity = majorCities.find(
              city => city.city.toLowerCase() === detectedCity.toLowerCase()
            );
            
            if (matchedCity) {
              handleCitySelect(matchedCity);
            } else {
              alert(`Your location (${detectedCity}) is not in our service area yet. Please select a nearby city.`);
            }
          }
        } catch (error) {
          console.error('Error detecting location:', error);
          alert('Unable to detect your location. Please select manually.');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to access your location. Please enable location permissions and try again.');
        setIsDetecting(false);
      }
    );
  };

  const handleCitySelect = (city) => {
    onSelectCity(city);
    // Save to localStorage
    localStorage.setItem('rentalCity', JSON.stringify(city));
    onClose();
  };

  // Reset filters when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedState('All');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Select Your City</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Auto-detect button */}
            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {isDetecting ? 'Detecting...' : 'Detect My Location'}
              </span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* State Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedState === state
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Cities List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {filteredCities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No cities found</p>
                <p className="text-sm mt-2">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCities.map((location) => {
                  const isSelected = currentCity?.city === location.city;
                  const pricing = productCityPricing[location.city];
                  
                  return (
                    <button
                      key={`${location.city}-${location.state}`}
                      onClick={() => handleCitySelect(location)}
                      className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {location.city}
                            </h3>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{location.state}</p>
                          
                          {/* Show pricing if available */}
                          {pricing && (
                            <div className="mt-2 text-xs text-purple-600 font-medium">
                              ₹{pricing.monthlyRent?.toLocaleString('en-IN')}/month
                            </div>
                          )}
                        </div>
                        <MapPin className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 text-center">
              City selection helps us show you accurate pricing and availability
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CitySelector;
