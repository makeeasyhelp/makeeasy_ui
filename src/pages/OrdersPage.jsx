import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Icon from '../components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersPage = () => {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch user orders/bookings on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.orders.getOrders();
        if (response.success) {
          setOrders(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await api.orders.updateOrder(orderId, {
        orderStatus: 'cancelled'
      });

      if (response.success) {
        setOrders(orders.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: 'cancelled' }
            : order
        ));
      } else {
        setError(response.error || 'Failed to cancel order');
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      if (filter === 'all') return true;
      return order.orderStatus?.toLowerCase() === filter.toLowerCase();
    })
    .filter(order => {
      if (!searchTerm) return true;
      return order.items?.some(item =>
        (item.service?.title || item.product?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      ) || order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aDate = new Date(a.createdAt || a.bookingDate);
      const bDate = new Date(b.createdAt || b.bookingDate);

      switch (sortBy) {
        case 'newest':
          return bDate - aDate;
        case 'oldest':
          return aDate - bDate;
        case 'amount':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        default:
          return bDate - aDate;
      }
    });

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If user is not authenticated
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <Icon name="user-x" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please log in to view your orders</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigo/90 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Manage and track your service bookings</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <Icon name="alert-circle" size={20} className="mr-2 text-red-500" />
              {error}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                  Filter:
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border-gray-300 rounded-md text-sm focus:ring-brand-indigo focus:border-brand-indigo"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-gray-300 rounded-md text-sm focus:ring-brand-indigo focus:border-brand-indigo"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount">Amount (High to Low)</option>
                </select>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-indigo focus:border-brand-indigo"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Icon name="package" size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet. Start exploring our services!"
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {orders.length === 0 && (
              <a
                href="/services"
                className="inline-block px-6 py-3 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigo/90 transition-colors"
              >
                Browse Services
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <p className="font-medium">₹{order.totalAmount || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment:</span>
                            <p className="font-medium">{order.paymentStatus || 'Pending'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Method:</span>
                            <p className="font-medium">{order.paymentMethod || 'Card'}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t pt-4 mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                                <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                  {/* Placeholder image logic */}
                                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-xs">
                                    {(item.service?.title || item.product?.title || 'Item').charAt(0)}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.service?.title || item.product?.title || 'Unknown Item'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity} × ₹{item.price}
                                  </p>
                                </div>
                                <div className="text-sm font-medium text-gray-700">
                                  ₹{item.price * item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="mt-3 text-xs text-gray-500">
                            <span className="font-medium">Ship to:</span> {order.shippingAddress.address}, {order.shippingAddress.city}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <button
                          onClick={() => window.open(`/checkout/${order._id}`, '_blank')}
                          className="px-4 py-2 text-brand-indigo bg-brand-indigo/10 rounded-lg text-sm font-medium hover:bg-brand-indigo/20 transition-colors"
                        >
                          View Details
                        </button>
                        {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-indigo">{filteredOrders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredOrders.filter(o => o.orderStatus === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredOrders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.orderStatus)).length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;