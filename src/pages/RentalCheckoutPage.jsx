import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { kycAPI } from '../services/api';
import {
  MapPin,
  Calendar,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Upload,
  ChevronRight,
  Package,
  CreditCard,
  Home
} from 'lucide-react';

const RentalCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Get cart items and totals from navigation state
  const { cartItems = [], totals = {} } = location.state || {};

  // State management
  const [kycStatus, setKycStatus] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: KYC, 3: Review

  // Address form state
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  // Delivery details state
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('');

  // Terms & conditions
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Time slots
  const timeSlots = [
    { id: '9-12', label: '9:00 AM - 12:00 PM', icon: '🌅' },
    { id: '12-3', label: '12:00 PM - 3:00 PM', icon: '☀️' },
    { id: '3-6', label: '3:00 PM - 6:00 PM', icon: '🌤️' },
    { id: '6-9', label: '6:00 PM - 9:00 PM', icon: '🌆' }
  ];

  // Indian states
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  useEffect(() => {
    // Redirect if no cart items
    if (!cartItems || cartItems.length === 0) {
      navigate('/rental-cart');
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Check KYC status
    checkKYCStatus();

    // Set minimum delivery date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
  }, [user, cartItems, navigate]);

  const checkKYCStatus = async () => {
    try {
      setKycLoading(true);
      const response = await kycAPI.getKYCStatus();
      
      if (response.success) {
        setKycStatus(response.data);
      } else {
        setKycStatus({ status: 'not-submitted' });
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
      setKycStatus({ status: 'not-submitted' });
    } finally {
      setKycLoading(false);
    }
  };

  const validateAddress = () => {
    const newErrors = {};

    if (!address.line1.trim()) {
      newErrors.line1 = 'Address line 1 is required';
    }
    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!address.state) {
      newErrors.state = 'State is required';
    }
    if (!address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = () => {
    if (validateAddress()) {
      // Move to KYC check step
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleKYCContinue = () => {
    if (kycStatus?.status === 'verified') {
      setCurrentStep(3);
      window.scrollTo(0, 0);
    } else {
      // Redirect to KYC upload page
      navigate('/user/kyc-upload', {
        state: {
          from: '/checkout',
          cartItems,
          totals,
          address,
          deliveryDate,
          deliveryTimeSlot
        }
      });
    }
  };

  const handleProceedToPayment = () => {
    // Validate delivery details
    if (!deliveryDate) {
      alert('Please select a delivery date');
      return;
    }
    if (!deliveryTimeSlot) {
      alert('Please select a delivery time slot');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    // Navigate to payment page
    navigate('/payment', {
      state: {
        cartItems,
        totals,
        address,
        deliveryDate,
        deliveryTimeSlot
      }
    });
  };

  const getKYCStatusBadge = () => {
    if (kycLoading) {
      return <span className="text-gray-500">Checking...</span>;
    }

    switch (kycStatus?.status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <CheckCircle size={18} />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-yellow-600 font-semibold">
            <Clock size={18} />
            Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-red-600 font-semibold">
            <AlertCircle size={18} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600 font-semibold">
            <Upload size={18} />
            Not Submitted
          </span>
        );
    }
  };

  // Render step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
          {currentStep > 1 ? <CheckCircle size={18} /> : '1'}
        </div>
        <span className="font-medium hidden sm:inline">Address</span>
      </div>
      <ChevronRight className="text-gray-400" />
      <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
          {currentStep > 2 ? <CheckCircle size={18} /> : '2'}
        </div>
        <span className="font-medium hidden sm:inline">KYC</span>
      </div>
      <ChevronRight className="text-gray-400" />
      <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
          {currentStep > 3 ? <CheckCircle size={18} /> : '3'}
        </div>
        <span className="font-medium hidden sm:inline">Review</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Complete your rental order in 3 simple steps</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Address Form */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Home className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      placeholder="House No., Building Name, Street"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.line1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.line1 && <p className="text-red-500 text-sm mt-1">{errors.line1}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.line2}
                      onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      placeholder="Area, Colony"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="e.g., Mumbai"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="e.g., 400001"
                        maxLength={6}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.pincode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.landmark}
                        onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                        placeholder="e.g., Near XYZ Mall"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddressSubmit}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to KYC Verification
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: KYC Verification */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
                </div>

                <div className="space-y-6">
                  {/* KYC Status Card */}
                  <div className={`p-4 rounded-lg border-2 ${
                    kycStatus?.status === 'verified' ? 'border-green-200 bg-green-50' :
                    kycStatus?.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                    kycStatus?.status === 'rejected' ? 'border-red-200 bg-red-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">KYC Status</h3>
                        {getKYCStatusBadge()}
                      </div>
                      {kycStatus?.status === 'verified' && (
                        <CheckCircle className="text-green-600" size={32} />
                      )}
                    </div>

                    {kycStatus?.status === 'verified' && (
                      <p className="text-gray-700 mt-3">
                        ✓ Your identity has been verified. You can proceed with the rental.
                      </p>
                    )}

                    {kycStatus?.status === 'pending' && (
                      <div className="mt-3">
                        <p className="text-gray-700 mb-2">
                          Your KYC documents are under review. This usually takes 24-48 hours.
                        </p>
                        <p className="text-sm text-gray-600">
                          You can still proceed with the order, but delivery will be scheduled after KYC approval.
                        </p>
                      </div>
                    )}

                    {kycStatus?.status === 'rejected' && (
                      <div className="mt-3">
                        <p className="text-gray-700 mb-2">
                          Your KYC verification was rejected. Reason: {kycStatus.rejectionReason || 'Document quality issue'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Please re-upload your documents to proceed.
                        </p>
                      </div>
                    )}

                    {kycStatus?.status === 'not-submitted' && (
                      <div className="mt-3">
                        <p className="text-gray-700 mb-2">
                          KYC verification is required to rent products. Please upload your identity and address proof.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 mt-2">
                          <li>• ID Proof: Aadhaar, PAN, Passport, or Driving License</li>
                          <li>• Address Proof: Utility Bill or Rent Agreement</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back to Address
                    </button>
                    <button
                      onClick={handleKYCContinue}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                        kycStatus?.status === 'verified'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {kycStatus?.status === 'verified' ? 'Continue to Review' : 'Upload KYC Documents'}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Delivery Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Delivery Schedule */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="text-purple-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Schedule</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time Slot <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => setDeliveryTimeSlot(slot.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              deliveryTimeSlot === slot.id
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{slot.icon}</div>
                            <div className="text-sm font-medium text-gray-900">{slot.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="text-purple-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            {item.city} • {item.tenure} months • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">₹{item.monthlyRent}/mo</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="text-gray-600 mt-1" size={18} />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Delivery Address</h4>
                        <p className="text-sm text-gray-700">
                          {address.line1}, {address.line2 && `${address.line2}, `}
                          {address.city}, {address.state} - {address.pincode}
                          {address.landmark && <><br />Landmark: {address.landmark}</>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-purple-600 hover:underline">
                          Terms & Conditions
                        </a>{' '}
                        and{' '}
                        <a href="/rental-agreement" className="text-purple-600 hover:underline">
                          Rental Agreement
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedToPayment}
                      className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Monthly Rent</span>
                  <span className="font-semibold">₹{totals.totalMonthlyRent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Deposit</span>
                  <span className="font-semibold">₹{totals.totalDeposit?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className="font-semibold">₹{totals.totalDelivery?.toFixed(2) || '0.00'}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{totals.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>GST (18%)</span>
                  <span className="font-semibold">₹{totals.gst?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total (First Payment)</span>
                    <span className="text-purple-600">₹{totals.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  Monthly Payment (from 2nd month)
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{totals.monthlyPayment?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Paid automatically on your billing date
                </p>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>✓ 100% Refundable deposit</p>
                <p>✓ Free maintenance & repairs</p>
                <p>✓ Free relocation support</p>
                <p>✓ Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCheckoutPage;
