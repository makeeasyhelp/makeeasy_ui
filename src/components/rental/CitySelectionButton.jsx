import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useRentalContext } from '../../context/RentalContext';
import CitySelector from './CitySelector';

/**
 * City Selection Button Component
 * Shows selected city and opens city selector modal
 * Can be used in navbar, product pages, etc.
 */
const CitySelectionButton = ({ productCityPricing = {}, className = '' }) => {
  const { 
    selectedCity, 
    setSelectedCity, 
    isCitySelectorOpen, 
    openCitySelector, 
    closeCitySelector 
  } = useRentalContext();

  // List of major rental cities
  const availableCities = [
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

  return (
    <>
      <button
        onClick={openCitySelector}
        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-purple-500 hover:shadow-md transition-all ${className}`}
      >
        <MapPin className="w-5 h-5 text-purple-600" />
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">Delivery to</span>
          <span className="text-sm font-semibold text-gray-900">
            {selectedCity ? selectedCity.city : 'Select City'}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
      </button>

      <CitySelector
        isOpen={isCitySelectorOpen}
        onClose={closeCitySelector}
        onSelectCity={setSelectedCity}
        availableCities={availableCities}
        currentCity={selectedCity}
        productCityPricing={productCityPricing}
      />
    </>
  );
};

export default CitySelectionButton;
