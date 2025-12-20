import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Calendar,
  MapPin,
  Download,
  ArrowRight,
  Home,
  Phone,
  Mail,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    paymentId = '',
    orderId = '',
    orders = [],
    totalAmount = 0,
    deliveryDate = '',
    deliveryTimeSlot = ''
  } = location.state || {};

  useEffect(() => {
    // Redirect if no order data
    if (!orders || orders.length === 0) {
      navigate('/');
    }

    // Trigger confetti or celebration animation
    // You can add confetti library here if needed
  }, [orders, navigate]);

  const getTimeSlotLabel = (slot) => {
    const slots = {
      '9-12': '9:00 AM - 12:00 PM',
      '12-3': '12:00 PM - 3:00 PM',
      '3-6': '3:00 PM - 6:00 PM',
      '6-9': '6:00 PM - 9:00 PM'
    };
    return slots[slot] || slot;
  };

  const downloadInvoice = () => {
    // In production, this would generate and download a PDF invoice
    alert('Invoice download feature will be implemented with backend integration');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={56} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for choosing MakeEasy Rentals
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6"
        >
          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {orderId || 'ORD' + Date.now()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment ID</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {paymentId}
              </p>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{totalAmount?.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <CheckCircle size={16} />
                  Payment Successful
                </span>
              </div>
            </div>
          </div>

          {/* Rented Items */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="text-purple-600" size={24} />
              Rented Items ({orders.length})
            </h3>
            <div className="space-y-3">
              {orders.map((order, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <Package className="text-gray-400" size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Rental #{order._id?.substring(0, 8) || index + 1}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.selectedCity} • {order.selectedTenure} months
                    </p>
                    <p className="text-sm text-purple-600 font-semibold mt-1">
                      ₹{order.monthlyRent}/month
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {order.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Truck className="text-blue-600" size={20} />
              Delivery Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(deliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-semibold text-gray-900">
                    {getTimeSlotLabel(deliveryTimeSlot)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                📦 Your items will be delivered and installed at your address on the scheduled date. 
                Our team will contact you 24 hours before delivery.
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Order Confirmation:</strong> You'll receive a confirmation email with order details shortly.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Delivery Preparation:</strong> Our team will prepare your items for delivery.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Pre-Delivery Call:</strong> We'll call you 24 hours before delivery to confirm.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Delivery & Installation:</strong> Items will be delivered and installed at your address.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          <button
            onClick={() => navigate('/user/rentals')}
            className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            View My Rentals
            <ArrowRight size={20} />
          </button>
          <button
            onClick={downloadInvoice}
            className="border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Invoice
          </button>
          <button
            onClick={() => navigate('/products')}
            className="border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            Browse More
          </button>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Need Help?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <Phone className="text-purple-600 mx-auto mb-2" size={32} />
              <p className="text-sm text-gray-600 mb-1">Call Us</p>
              <p className="font-semibold text-gray-900">1800-123-4567</p>
              <p className="text-xs text-gray-500">Mon-Sat, 9 AM - 6 PM</p>
            </div>
            <div className="p-4">
              <Mail className="text-purple-600 mx-auto mb-2" size={32} />
              <p className="text-sm text-gray-600 mb-1">Email Us</p>
              <p className="font-semibold text-gray-900">support@makeeasy.com</p>
              <p className="text-xs text-gray-500">We'll respond in 24 hours</p>
            </div>
            <div className="p-4">
              <MapPin className="text-purple-600 mx-auto mb-2" size={32} />
              <p className="text-sm text-gray-600 mb-1">Track Order</p>
              <button
                onClick={() => navigate('/user/rentals')}
                className="font-semibold text-purple-600 hover:underline"
              >
                Go to My Rentals
              </button>
            </div>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Thank you for trusting MakeEasy Rentals. We're excited to serve you! 💜
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
