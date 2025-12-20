import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import CitySelector from './CitySelector';
import CitySelectionButton from './CitySelectionButton';
import { useRentalContext } from '../../context/RentalContext';

/**
 * Example: How to use City Selector in your components
 * This demonstrates both manual integration and using the button component
 */
const CitySelectorExample = () => {
  const { selectedCity } = useRentalContext();
  
  // Example: Manual city selector integration
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualSelectedCity, setManualSelectedCity] = useState(null);

  // Example product with city pricing
  const exampleProduct = {
    cityPricing: {
      'Mumbai': { monthlyRent: 1500, deposit: 3000, deliveryCharge: 500 },
      'Delhi': { monthlyRent: 1400, deposit: 2800, deliveryCharge: 500 },
      'Bangalore': { monthlyRent: 1600, deposit: 3200, deliveryCharge: 500 },
      'Pune': { monthlyRent: 1300, deposit: 2600, deliveryCharge: 400 },
      'Hyderabad': { monthlyRent: 1400, deposit: 2800, deliveryCharge: 400 },
      'Chennai': { monthlyRent: 1350, deposit: 2700, deliveryCharge: 400 },
      'Kolkata': { monthlyRent: 1200, deposit: 2400, deliveryCharge: 400 },
      'Ahmedabad': { monthlyRent: 1250, deposit: 2500, deliveryCharge: 400 },
      'Jaipur': { monthlyRent: 1200, deposit: 2400, deliveryCharge: 400 },
      'Lucknow': { monthlyRent: 1100, deposit: 2200, deliveryCharge: 350 },
    }
  };

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
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">City Selector Component</h1>
        <p className="text-gray-600">Examples of using the City Selector in different ways</p>
      </div>

      {/* Example 1: Using CitySelectionButton Component */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Example 1: Using CitySelectionButton Component
        </h2>
        <p className="text-gray-600 mb-4">
          This is the easiest way - just use the pre-built button component with RentalContext
        </p>
        
        <div className="flex items-center gap-4">
          <CitySelectionButton productCityPricing={exampleProduct.cityPricing} />
          
          {selectedCity && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Selected:</span> {selectedCity.city}, {selectedCity.state}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-mono text-gray-700">
            {`import { RentalProvider } from './context/RentalContext';`}<br/>
            {`import CitySelectionButton from './components/rental/CitySelectionButton';`}<br/><br/>
            {`<CitySelectionButton productCityPricing={product.cityPricing} />`}
          </p>
        </div>
      </div>

      {/* Example 2: Manual Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Example 2: Manual Integration
        </h2>
        <p className="text-gray-600 mb-4">
          Use the CitySelector component directly with your own state management
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsManualOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            <span>
              {manualSelectedCity ? `${manualSelectedCity.city}` : 'Select City Manually'}
            </span>
          </button>

          {manualSelectedCity && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Manual Selection:</span> {manualSelectedCity.city}, {manualSelectedCity.state}
              </p>
            </div>
          )}
        </div>

        <CitySelector
          isOpen={isManualOpen}
          onClose={() => setIsManualOpen(false)}
          onSelectCity={setManualSelectedCity}
          availableCities={availableCities}
          currentCity={manualSelectedCity}
          productCityPricing={exampleProduct.cityPricing}
        />

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-mono text-gray-700">
            {`const [isOpen, setIsOpen] = useState(false);`}<br/>
            {`const [selectedCity, setSelectedCity] = useState(null);`}<br/><br/>
            {`<CitySelector`}<br/>
            {`  isOpen={isOpen}`}<br/>
            {`  onClose={() => setIsOpen(false)}`}<br/>
            {`  onSelectCity={setSelectedCity}`}<br/>
            {`  availableCities={cities}`}<br/>
            {`  currentCity={selectedCity}`}<br/>
            {`  productCityPricing={product.cityPricing}`}<br/>
            {`/>`}
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>Auto-detect Location:</strong> Uses browser Geolocation API to detect user's city</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>Search Filter:</strong> Search cities by name</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>State Filter:</strong> Filter cities by state</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>City Pricing Display:</strong> Shows monthly rent for each city (if provided)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>LocalStorage Persistence:</strong> Remembers selected city across sessions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>Responsive Design:</strong> Works on all screen sizes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>Smooth Animations:</strong> Built with Framer Motion</span>
          </li>
        </ul>
      </div>

      {/* Integration Guide */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Integration Guide</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 1: Wrap your app with RentalProvider</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono text-gray-700">
                {`// In main.jsx or App.jsx`}<br/>
                {`import { RentalProvider } from './context/RentalContext';`}<br/><br/>
                {`<RentalProvider>`}<br/>
                {`  <App />`}<br/>
                {`</RentalProvider>`}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Step 2: Use in Product Pages</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono text-gray-700">
                {`import { useRentalContext } from './context/RentalContext';`}<br/>
                {`import CitySelectionButton from './components/rental/CitySelectionButton';`}<br/><br/>
                {`const ProductPage = () => {`}<br/>
                {`  const { selectedCity } = useRentalContext();`}<br/><br/>
                {`  return (`}<br/>
                {`    <div>`}<br/>
                {`      <CitySelectionButton />`}<br/>
                {`      {selectedCity && <p>Delivering to: {selectedCity.city}</p>}`}<br/>
                {`    </div>`}<br/>
                {`  );`}<br/>
                {`};`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectorExample;
