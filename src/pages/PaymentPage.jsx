import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { rentalAPI } from '../services/api';
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
  Lock
} from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Get order details from navigation state
  const { cartItems = [], totals = {}, address = {}, deliveryDate = '', deliveryTimeSlot = '' } = location.state || {};

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Payment methods
  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'UPI / Cards / Wallets',
      description: 'Pay via Razorpay (Recommended)',
      icon: CreditCard,
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, Paytm',
      icon: Smartphone
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: Building2
    },
    {
      id: 'wallet',
      name: 'Wallets',
      description: 'Paytm, PhonePe, Amazon Pay',
      icon: Wallet
    }
  ];

  useEffect(() => {
    // Redirect if no order details
    if (!cartItems || cartItems.length === 0) {
      navigate('/rental-cart');
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Load Razorpay script
    loadRazorpayScript();
  }, [user, cartItems, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRentalOrders = async () => {
    try {
      // Create rental orders for each cart item
      const orderPromises = cartItems.map(item =>
        rentalAPI.createRental({
          productId: item.productId,
          selectedCity: item.city,
          selectedTenure: item.tenure,
          deliveryAddress: address,
          deliveryDate: deliveryDate,
          deliveryTimeSlot: deliveryTimeSlot,
          quantity: item.quantity,
          monthlyRent: item.monthlyRent,
          deposit: item.deposit,
          deliveryCharge: item.deliveryCharge
        })
      );

      const results = await Promise.all(orderPromises);
      
      // Check if all orders were created successfully
      const allSuccess = results.every(result => result.success);
      
      if (allSuccess) {
        return {
          success: true,
          orders: results.map(r => r.data)
        };
      } else {
        throw new Error('Some orders failed to create');
      }
    } catch (error) {
      console.error('Error creating rental orders:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');

      // Load Razorpay script if not loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      // Create rental orders first
      const orderResult = await createRentalOrders();
      const orders = orderResult.orders;

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Replace with your Razorpay key
        amount: Math.round(totals.total * 100), // Amount in paise
        currency: 'INR',
        name: 'MakeEasy Rentals',
        description: `Rental Order - ${cartItems.length} item(s)`,
        image: '/logo.png',
        order_id: '', // This should come from backend in production
        handler: async function (response) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Clear cart from localStorage
          localStorage.removeItem('rentalCart');
          
          // Navigate to order success page
          navigate('/order-success', {
            state: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              orders: orders,
              totalAmount: totals.total,
              deliveryDate: deliveryDate,
              deliveryTimeSlot: deliveryTimeSlot
            }
          });
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          address: `${address.line1}, ${address.city}, ${address.state} - ${address.pincode}`,
          deliveryDate: deliveryDate,
          deliveryTimeSlot: deliveryTimeSlot
        },
        theme: {
          color: '#9333EA'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setError('Payment cancelled. Please try again.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleMockPayment = async () => {
    try {
      setProcessing(true);
      setError('');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create rental orders
      const orderResult = await createRentalOrders();
      const orders = orderResult.orders;

      // Clear cart
      localStorage.removeItem('rentalCart');

      // Navigate to success page
      navigate('/order-success', {
        state: {
          paymentId: 'mock_' + Date.now(),
          orderId: 'order_' + Date.now(),
          orders: orders,
          totalAmount: totals.total,
          deliveryDate: deliveryDate,
          deliveryTimeSlot: deliveryTimeSlot
        }
      });

    } catch (error) {
      console.error('Mock payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Checkout
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-1">Choose your preferred payment method</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                <p className="text-sm text-blue-800">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPaymentMethod === method.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedPaymentMethod === method.id ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={selectedPaymentMethod === method.id ? 'text-purple-600' : 'text-gray-600'} size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            {method.popular && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id
                            ? 'border-purple-600 bg-purple-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle className="text-white" size={14} />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Payment Failed</h4>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay ₹{totals.total?.toFixed(2)}
                  </>
                )}
              </button>

              {/* Test/Mock Payment Button (for development) */}
              {import.meta.env.DEV && (
                <button
                  onClick={handleMockPayment}
                  disabled={processing}
                  className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mock Payment (Dev Only)
                </button>
              )}

              <p className="text-xs text-gray-600 text-center mt-4">
                By proceeding, you agree to our{' '}
                <a href="/terms" className="text-purple-600 hover:underline">Terms</a>
                {' '}and{' '}
                <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Cart Items Count */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600">
                  {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your order
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Monthly Rent</span>
                  <span>₹{totals.totalMonthlyRent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Deposit</span>
                  <span>₹{totals.totalDeposit?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span>₹{totals.totalDelivery?.toFixed(2) || '0.00'}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{totals.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>GST (18%)</span>
                  <span>₹{totals.gst?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total to Pay</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{totals.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Monthly Payment Info */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-gray-700 mb-1">From 2nd month onwards</p>
                <p className="text-lg font-bold text-purple-600">
                  ₹{totals.monthlyPayment?.toFixed(2) || '0.00'}/month
                </p>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600 font-semibold mb-2">Delivery Details</p>
                <p className="text-xs text-gray-700">
                  📅 {new Date(deliveryDate).toLocaleDateString('en-IN', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  🕐 {deliveryTimeSlot === '9-12' && '9:00 AM - 12:00 PM'}
                  {deliveryTimeSlot === '12-3' && '12:00 PM - 3:00 PM'}
                  {deliveryTimeSlot === '3-6' && '3:00 PM - 6:00 PM'}
                  {deliveryTimeSlot === '6-9' && '6:00 PM - 9:00 PM'}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-1">
                <p>✓ 100% Secure payment</p>
                <p>✓ Refundable deposit</p>
                <p>✓ Free maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
