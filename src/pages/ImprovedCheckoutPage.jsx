import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Alert from '../components/ui/Alert';
import { SectionSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, CheckCircle, CreditCard, Wallet, Building2 } from 'lucide-react';

const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const { cart, cartTotal, clearCart } = useApp();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiDetails, setUpiDetails] = useState({
    upiId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Calculate total with taxes and delivery fee
  const deliveryFee = 49;
  const taxRate = 0.18; // 18% tax
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + deliveryFee + taxAmount;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // If no cart items and no booking ID, redirect to cart
    if (cart.length === 0 && !bookingId) {
      navigate('/cart');
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        // If we have a bookingId, fetch booking details
        if (bookingId) {
          const response = await api.bookings.getBookingById(bookingId);
          if (response.success) {
            setBooking(response.data);
          } else {
            setError(response.error || 'Failed to load booking details');
          }
        } else {
          // Otherwise, using cart items
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || 'Error loading checkout details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, user, authLoading, navigate, cart.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (paymentMethod === 'card') {
      setCardDetails({
        ...cardDetails,
        [name]: value
      });
    } else if (paymentMethod === 'upi') {
      setUpiDetails({
        ...upiDetails,
        [name]: value
      });
    }
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Card number must be 16 digits';
      }

      if (!cardDetails.cardName.trim()) {
        errors.cardName = 'Name on card is required';
      }

      if (!cardDetails.expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
        errors.expiryDate = 'Expiry date should be in MM/YY format';
      }

      if (!cardDetails.cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        errors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiDetails.upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+$/.test(upiDetails.upiId)) {
        errors.upiId = 'Please enter a valid UPI ID (e.g., user@bank)';
      }
    }

    return errors;
  };

  const createBookingFromCart = async () => {
    try {
      // Prepare booking data from cart
      const bookingData = {
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          days: 1, // Default rental period
          price: item.price,
        })),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 1 day
        totalAmount: orderTotal,
        paymentStatus: 'pending'
      };
      
      const response = await api.bookings.createBooking(bookingData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create booking');
      }
    } catch (err) {
      throw err;
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      let currentBooking = booking;
      
      // If no booking exists yet (coming from cart), create one
      if (!bookingId) {
        currentBooking = await createBookingFromCart();
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status on the booking
      await api.bookings.updatePaymentStatus(currentBooking.id, 'completed');
      
      // Clear cart after successful payment (if coming from cart)
      if (!bookingId) {
        clearCart();
      }
      
      setPaymentSuccess(true);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionSpinner text="Loading checkout information..." className="min-h-[60vh]" />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed and will be processed soon. Thank you for your purchase!
            </p>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Order reference: {booking?.id || 'ORD' + Math.floor(Math.random() * 1000000)}</p>
              <p className="text-lg font-bold text-brand-indigo">
                {formatCurrency(booking?.totalAmount || orderTotal)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-full font-medium shadow-button hover:shadow-button-hover"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert 
          type={Alert.Type.ERROR} 
          message="Failed to load checkout information" 
          details={error} 
          className="mb-6"
          onClose={() => setError('')}
        />
        <div className="text-center py-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-4"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-24">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {bookingId && booking ? (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                      <img 
                        src={booking.product?.image || `https://placehold.co/300x300/f3f4f6/4f46e5?text=${encodeURIComponent(booking.product?.name?.charAt(0) || 'P')}`}
                        alt={booking.product?.name || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{booking.product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {booking.quantity || 1} × {formatCurrency(booking.price || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(booking.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Tax (included)</span>
                      <span>{formatCurrency((booking.totalAmount || 0) * 0.18)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-2">
                      <span>Total</span>
                      <span className="text-brand-indigo">{formatCurrency(booking.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                        <img 
                          src={item.image || `https://placehold.co/300x300/f3f4f6/4f46e5?text=${encodeURIComponent(item.name.charAt(0))}`}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-2">
                      <span>Total</span>
                      <span className="text-brand-indigo">{formatCurrency(orderTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-brand-indigo bg-indigo-50 text-brand-indigo' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={24} className="mb-2" />
                    <span className="text-sm font-medium">Credit Card</span>
                  </button>
                  <button 
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                      paymentMethod === 'upi' 
                        ? 'border-brand-indigo bg-indigo-50 text-brand-indigo' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Wallet size={24} className="mb-2" />
                    <span className="text-sm font-medium">UPI</span>
                  </button>
                  <button 
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                      paymentMethod === 'netbanking' 
                        ? 'border-brand-indigo bg-indigo-50 text-brand-indigo' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <BuildingBank size={24} className="mb-2" />
                    <span className="text-sm font-medium">Net Banking</span>
                  </button>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo`}
                    />
                    {formErrors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardDetails.cardName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${formErrors.cardName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo`}
                    />
                    {formErrors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo`}
                      />
                      {formErrors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo`}
                      />
                      {formErrors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-lg font-medium shadow-button hover:shadow-button-hover transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay ${formatCurrency(booking?.totalAmount || orderTotal)}`
                    )}
                  </button>
                </form>
              )}
              
              {paymentMethod === 'upi' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      placeholder="yourname@upi"
                      value={upiDetails.upiId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${formErrors.upiId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo`}
                    />
                    {formErrors.upiId && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.upiId}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-lg font-medium shadow-button hover:shadow-button-hover transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay ${formatCurrency(booking?.totalAmount || orderTotal)}`
                    )}
                  </button>
                </form>
              )}
              
              {paymentMethod === 'netbanking' && (
                <div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Yes Bank', 'Kotak', 'PNB', 'BOB'].map(bank => (
                      <button 
                        key={bank}
                        className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-xs font-medium">{bank.substring(0, 3)}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700">{bank}</span>
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={processingPayment}
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-lg font-medium shadow-button hover:shadow-button-hover transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay ${formatCurrency(booking?.totalAmount || orderTotal)}`
                    )}
                  </button>
                </div>
              )}
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Your payment information is secure with us.</p>
                <p>We use encryption to protect your data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
