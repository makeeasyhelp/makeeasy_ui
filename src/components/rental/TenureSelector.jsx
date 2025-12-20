import React from 'react';
import { Check, TrendingDown } from 'lucide-react';

/**
 * Tenure Selector Component
 * Allows users to select rental tenure (3, 6, or 12 months) with pricing display
 */
const TenureSelector = ({ 
  product, 
  selectedCity, 
  selectedTenure, 
  onSelectTenure,
  className = '' 
}) => {
  if (!product || !selectedCity) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Please select a city first to view tenure options
        </p>
      </div>
    );
  }

  // Get city-specific pricing
  const cityPricing = product.cityPricing?.find(cp => cp.city === selectedCity.city);
  
  if (!cityPricing || !cityPricing.tenurePricing || cityPricing.tenurePricing.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          Rental pricing not available for {selectedCity.city}
        </p>
      </div>
    );
  }

  // Calculate discount percentage
  const getDiscountPercentage = (currentRent, baseRent) => {
    if (!baseRent || baseRent === currentRent) return 0;
    return Math.round(((baseRent - currentRent) / baseRent) * 100);
  };

  // Find base rent (usually 3 months has highest per-month rent)
  const baseRent = Math.max(...cityPricing.tenurePricing.map(tp => tp.monthlyRent));

  // Sort tenure options (3, 6, 12)
  const tenureOptions = [...cityPricing.tenurePricing].sort((a, b) => a.months - b.months);

  // Find best value option (usually 12 months)
  const bestValueOption = tenureOptions.reduce((best, current) => 
    current.monthlyRent < best.monthlyRent ? current : best
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select Rental Tenure</h3>
        <span className="text-sm text-gray-500">Choose your rental period</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tenureOptions.map((tenure) => {
          const isSelected = selectedTenure === tenure.months;
          const isBestValue = tenure.months === bestValueOption.months;
          const discount = getDiscountPercentage(tenure.monthlyRent, baseRent);
          const totalCost = tenure.monthlyRent * tenure.months;

          return (
            <button
              key={tenure.months}
              onClick={() => onSelectTenure(tenure.months)}
              className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              {/* Best Value Badge */}
              {isBestValue && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  BEST VALUE
                </div>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="bg-purple-600 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Tenure Duration */}
              <div className="mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {tenure.months}
                </div>
                <div className="text-sm text-gray-600">
                  {tenure.months === 1 ? 'Month' : 'Months'}
                </div>
              </div>

              {/* Monthly Rent */}
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{tenure.monthlyRent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="mb-2">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Save {discount}%
                  </span>
                </div>
              )}

              {/* Total Cost */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Total for {tenure.months} months</div>
                <div className="text-lg font-semibold text-gray-900">
                  ₹{totalCost.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-3 text-xs text-gray-500">
                + ₹{cityPricing.deposit.toLocaleString('en-IN')} refundable deposit
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Summary */}
      {selectedTenure && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">You selected</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedTenure} Month{selectedTenure !== 1 ? 's' : ''} Rental
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Monthly rent</p>
              <p className="text-xl font-bold text-purple-600">
                ₹{tenureOptions.find(t => t.months === selectedTenure)?.monthlyRent.toLocaleString('en-IN')}/mo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Why longer tenure?</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Lower monthly rent with longer commitments</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>More savings over the rental period</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Flexibility to extend or close early (conditions apply)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TenureSelector;
