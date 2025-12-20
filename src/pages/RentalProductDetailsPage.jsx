import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { productsAPI } from '../services/api';
import { rentalAPI } from '../services/rentalAPI';
import { kycAPI } from '../services/kycAPI';
import { useRentalContext } from '../context/RentalContext';
import { AuthContext } from '../context/AuthContext';
import CitySelectionButton from '../components/rental/CitySelectionButton';
import TenureSelector from '../components/rental/TenureSelector';

/**
 * Enhanced Product Details Page for Rental System
 * Includes city selection, tenure selection, add-ons, and KYC verification
 */
const RentalProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const { 
    selectedCity, 
    selectedTenure, 
    setSelectedTenure,
    selectedAddOns,
    toggleAddOn,
    calculateRentalCost 
  } = useRentalContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);
  const [isCreatingRental, setIsCreatingRental] = useState(false);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch KYC status
  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!user) return;
      
      try {
        const response = await kycAPI.getKYCStatus();
        setKycStatus(response.data?.status || 'not_submitted');
      } catch (err) {
        console.error('Error fetching KYC status:', err);
        setKycStatus('not_submitted');
      }
    };

    fetchKYCStatus();
  }, [user]);

  // Calculate rental cost
  const rentalCost = selectedCity && selectedTenure && product
    ? calculateRentalCost(product, selectedCity.city, selectedTenure, selectedAddOns)
    : null;

  // Get city-specific pricing for display
  const cityPricingMap = {};
  product?.cityPricing?.forEach(cp => {
    cityPricingMap[cp.city] = {
      monthlyRent: cp.tenurePricing[0]?.monthlyRent || 0,
      deposit: cp.deposit,
      deliveryCharge: cp.deliveryCharge
    };
  });

  // Handle Rent Now button
  const handleRentNow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    // Check KYC status
    if (kycStatus !== 'verified') {
      if (confirm('KYC verification is required to rent products. Complete KYC now?')) {
        navigate('/kyc-upload');
      }
      return;
    }

    if (!selectedCity) {
      alert('Please select a city first');
      return;
    }

    if (!selectedTenure) {
      alert('Please select a rental tenure');
      return;
    }

    try {
      setIsCreatingRental(true);
      
      const rentalData = {
        productId: product._id,
        city: selectedCity.city,
        tenureMonths: selectedTenure,
        addOns: selectedAddOns.map(a => a._id)
      };

      const response = await rentalAPI.createRental(rentalData);
      
      if (response.success) {
        alert('Rental created successfully! Redirecting to your rentals...');
        navigate('/user/rentals');
      }
    } catch (err) {
      alert(err.message || 'Failed to create rental. Please try again.');
      console.error(err);
    } finally {
      setIsCreatingRental(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-400 text-lg">No image available</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Specifications:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-900 ml-2 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* City Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Delivery City</h2>
              <CitySelectionButton productCityPricing={cityPricingMap} />
            </div>

            {/* Tenure Selection */}
            {selectedCity && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <TenureSelector
                  product={product}
                  selectedCity={selectedCity}
                  selectedTenure={selectedTenure}
                  onSelectTenure={setSelectedTenure}
                />
              </div>
            )}

            {/* Add-ons (if available) */}
            {product.addOns && product.addOns.length > 0 && selectedTenure && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Optional Add-ons</h2>
                <div className="space-y-3">
                  {product.addOns.map((addOn) => {
                    const isSelected = selectedAddOns.some(a => a._id === addOn._id);
                    
                    return (
                      <button
                        key={addOn._id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                            <p className="text-sm text-gray-600">{addOn.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            ₹{addOn.price.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {addOn.type === 'one_time' ? 'One-time' : `Per month`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Pricing Card */}
              {rentalCost && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-semibold">₹{rentalCost.monthlyRent.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tenure</span>
                      <span className="font-semibold">{selectedTenure} months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Rent</span>
                      <span className="font-semibold">₹{rentalCost.rentTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit (Refundable)</span>
                      <span className="font-semibold">₹{rentalCost.deposit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span className="font-semibold">₹{rentalCost.deliveryCharge.toLocaleString('en-IN')}</span>
                    </div>
                    {rentalCost.addOnsCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Add-ons</span>
                        <span className="font-semibold">₹{rentalCost.addOnsCost.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-semibold">₹{rentalCost.gst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-900 font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{rentalCost.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Pay ₹{rentalCost.firstMonthPayment.toLocaleString('en-IN')} to start rental
                    </p>
                  </div>

                  {/* KYC Status Alert */}
                  {kycStatus !== 'verified' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-yellow-800">KYC Verification Required</p>
                          <p className="text-yellow-700">Complete KYC to proceed with rental</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rent Now Button */}
                  <button
                    onClick={handleRentNow}
                    disabled={!selectedCity || !selectedTenure || isCreatingRental}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingRental ? 'Processing...' : 'Rent Now'}
                  </button>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Why Rent with Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Secure & Safe</p>
                      <p className="text-sm text-gray-600">100% verified products</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Free Delivery</p>
                      <p className="text-sm text-gray-600">Quick doorstep delivery</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Flexible Plans</p>
                      <p className="text-sm text-gray-600">Extend or close anytime</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalProductDetailsPage;
