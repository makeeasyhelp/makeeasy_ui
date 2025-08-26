import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Alert from '../components/ui/Alert';
import { SectionSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, CheckCircle, CreditCard, Wallet, Bank } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background-faint flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background-faint flex flex-col justify-center items-center px-4 text-center">
        <Icon name="alert-triangle" size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
        <p className="text-gray-600 mb-6">{error || "We couldn't find the booking you're looking for"}</p>
        <button 
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-indigoDark transition-colors"
        >
          Go to Your Bookings
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background-faint flex flex-col justify-center items-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
            <Icon name="check" size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your payment has been processed successfully and your booking is now confirmed.</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{booking._id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium">₹{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full px-6 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-indigoDark transition-colors"
            >
              View My Bookings
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-faint py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {booking.product?.title || 'Product'}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Icon name="calendar" size={16} className="mr-1" />
                  <span className="text-sm">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Icon name="map-pin" size={16} className="mr-1" />
                  <span className="text-sm">{booking.product?.location || 'Location not specified'}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (Included)</span>
                  <span>₹{(booking.totalAmount * 0.18).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-purple">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 text-center cursor-pointer ${
                      paymentMethod === 'card' ? 'border-brand-indigo bg-brand-indigo/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <Icon name="credit-card" size={24} className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-brand-indigo' : 'text-gray-400'}`} />
                    <span className={paymentMethod === 'card' ? 'text-brand-indigo font-medium' : 'text-gray-700'}>Credit Card</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-4 text-center cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-brand-indigo bg-brand-indigo/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Icon name="smartphone" size={24} className={`mx-auto mb-2 ${paymentMethod === 'upi' ? 'text-brand-indigo' : 'text-gray-400'}`} />
                    <span className={paymentMethod === 'upi' ? 'text-brand-indigo font-medium' : 'text-gray-700'}>UPI</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-4 text-center cursor-pointer ${
                      paymentMethod === 'netbanking' ? 'border-brand-indigo bg-brand-indigo/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <Icon name="globe" size={24} className={`mx-auto mb-2 ${paymentMethod === 'netbanking' ? 'text-brand-indigo' : 'text-gray-400'}`} />
                    <span className={paymentMethod === 'netbanking' ? 'text-brand-indigo font-medium' : 'text-gray-700'}>Net Banking</span>
                  </div>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      maxLength="19"
                      required
                    />
                    {formErrors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardDetails.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      required
                    />
                    {formErrors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                        maxLength="5"
                        required
                      />
                      {formErrors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                        maxLength="4"
                        required
                      />
                      {formErrors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={processingPayment}
                      className={`w-full px-6 py-3 rounded-lg font-medium text-white shadow-lg bg-gradient-to-r from-brand-indigo to-brand-purple hover:shadow-xl transition-all ${
                        processingPayment ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingPayment ? (
                        <span className="flex items-center justify-center">
                          <Icon name="loader" size={20} className="animate-spin mr-2" />
                          Processing...
                        </span>
                      ) : (
                        `Pay ₹${booking.totalAmount}`
                      )}
                    </button>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Your payment information is secure. We use encryption to protect your data.
                    </p>
                  </div>
                </form>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="text-center py-6">
                  <div className="bg-gray-100 p-6 rounded-lg mb-6 inline-block">
                    <Icon name="qr-code" size={120} className="mx-auto mb-4 text-gray-700" />
                    <p className="text-brand-indigo font-medium">scan-and-pay@makeeasy</p>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Scan the QR code using any UPI app (GPay, PhonePe, Paytm, etc.) to complete your payment.
                  </p>
                  <button
                    className="w-full px-6 py-3 rounded-lg font-medium text-white shadow-lg bg-gradient-to-r from-brand-indigo to-brand-purple hover:shadow-xl transition-all"
                    onClick={() => setPaymentSuccess(true)}
                  >
                    I've Completed the Payment
                  </button>
                </div>
              )}
              
              {paymentMethod === 'netbanking' && (
                <div className="py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <button className="border rounded-lg p-3 text-center hover:border-gray-300 flex flex-col items-center">
                      <img src="https://via.placeholder.com/40x40?text=SBI" alt="SBI" className="mb-2 rounded" />
                      <span className="text-sm text-gray-700">SBI</span>
                    </button>
                    <button className="border rounded-lg p-3 text-center hover:border-gray-300 flex flex-col items-center">
                      <img src="https://via.placeholder.com/40x40?text=HDFC" alt="HDFC" className="mb-2 rounded" />
                      <span className="text-sm text-gray-700">HDFC</span>
                    </button>
                    <button className="border rounded-lg p-3 text-center hover:border-gray-300 flex flex-col items-center">
                      <img src="https://via.placeholder.com/40x40?text=ICICI" alt="ICICI" className="mb-2 rounded" />
                      <span className="text-sm text-gray-700">ICICI</span>
                    </button>
                    <button className="border rounded-lg p-3 text-center hover:border-gray-300 flex flex-col items-center">
                      <img src="https://via.placeholder.com/40x40?text=Axis" alt="Axis" className="mb-2 rounded" />
                      <span className="text-sm text-gray-700">Axis</span>
                    </button>
                    <button className="border rounded-lg p-3 text-center hover:border-gray-300 flex flex-col items-center">
                      <img src="https://via.placeholder.com/40x40?text=Yes" alt="Yes Bank" className="mb-2 rounded" />
                      <span className="text-sm text-gray-700">Yes Bank</span>
                    </button>
                    <button className="border rounded-lg p-3 text-center hover:border-gray-300 flex flex-col items-center">
                      <Icon name="more-horizontal" size={40} className="mb-2 text-gray-400" />
                      <span className="text-sm text-gray-700">Others</span>
                    </button>
                  </div>
                  <button
                    className="w-full px-6 py-3 rounded-lg font-medium text-white shadow-lg bg-gradient-to-r from-brand-indigo to-brand-purple hover:shadow-xl transition-all"
                    onClick={() => setPaymentSuccess(true)}
                  >
                    Proceed to Pay
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions or need assistance with your payment, our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+918318250417" className="flex items-center text-brand-indigo">
                  <Icon name="phone" size={16} className="mr-1" />
                  <span>+91 8318250417</span>
                </a>
                <a href="mailto:support@makeeasy.com" className="flex items-center text-brand-indigo">
                  <Icon name="mail" size={16} className="mr-1" />
                  <span>support@makeeasy.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
