import React, { createContext, useContext, useState, useEffect } from 'react';

const RentalContext = createContext();

export const useRentalContext = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRentalContext must be used within a RentalProvider');
  }
  return context;
};

export const RentalProvider = ({ children }) => {
  // Selected city for rental pricing
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Selected tenure (3, 6, or 12 months)
  const [selectedTenure, setSelectedTenure] = useState(null);
  
  // Add-ons selected (damage protection, etc.)
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  
  // City selector modal state
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  
  // Load selected city from localStorage on mount
  useEffect(() => {
    const storedCity = localStorage.getItem('rentalCity');
    if (storedCity) {
      try {
        setSelectedCity(JSON.parse(storedCity));
      } catch (error) {
        console.error('Error parsing stored city:', error);
        localStorage.removeItem('rentalCity');
      }
    }
  }, []);

  // Save selected city to localStorage whenever it changes
  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (city) {
      localStorage.setItem('rentalCity', JSON.stringify(city));
    } else {
      localStorage.removeItem('rentalCity');
    }
  };

  // Open city selector modal
  const openCitySelector = () => {
    setIsCitySelectorOpen(true);
  };

  // Close city selector modal
  const closeCitySelector = () => {
    setIsCitySelectorOpen(false);
  };

  // Reset rental selection (useful when starting new rental flow)
  const resetRentalSelection = () => {
    setSelectedTenure(null);
    setSelectedAddOns([]);
  };

  // Add or remove an add-on
  const toggleAddOn = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item._id === addOn._id);
      if (exists) {
        return prev.filter(item => item._id !== addOn._id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  // Calculate total rental cost
  const calculateRentalCost = (product, city, tenureMonths, addOns = []) => {
    if (!product || !city || !tenureMonths) {
      return null;
    }

    try {
      // Get city-specific pricing
      const cityPricing = product.cityPricing?.find(cp => cp.city === city);
      if (!cityPricing) {
        return null;
      }

      // Get tenure-based pricing
      const tenurePricing = cityPricing.tenurePricing?.find(tp => tp.months === tenureMonths);
      if (!tenurePricing) {
        return null;
      }

      const monthlyRent = tenurePricing.monthlyRent;
      const deposit = cityPricing.deposit;
      const deliveryCharge = cityPricing.deliveryCharge || 0;

      // Calculate add-ons cost
      let addOnsCost = 0;
      addOns.forEach(addOn => {
        if (addOn.type === 'one_time') {
          addOnsCost += addOn.price;
        } else if (addOn.type === 'monthly') {
          addOnsCost += addOn.price * tenureMonths;
        }
      });

      // Calculate subtotal
      const rentTotal = monthlyRent * tenureMonths;
      const subtotal = deposit + rentTotal + deliveryCharge + addOnsCost;

      // Calculate GST (18%)
      const gst = subtotal * 0.18;

      // Calculate total
      const total = subtotal + gst;

      return {
        monthlyRent,
        tenureMonths,
        rentTotal,
        deposit,
        deliveryCharge,
        addOnsCost,
        subtotal,
        gst,
        total,
        firstMonthPayment: deposit + monthlyRent + deliveryCharge + gst,
      };
    } catch (error) {
      console.error('Error calculating rental cost:', error);
      return null;
    }
  };

  const value = {
    // City selection
    selectedCity,
    setSelectedCity: handleCityChange,
    isCitySelectorOpen,
    openCitySelector,
    closeCitySelector,
    
    // Tenure selection
    selectedTenure,
    setSelectedTenure,
    
    // Add-ons
    selectedAddOns,
    setSelectedAddOns,
    toggleAddOn,
    
    // Utilities
    resetRentalSelection,
    calculateRentalCost,
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};

export default RentalContext;
