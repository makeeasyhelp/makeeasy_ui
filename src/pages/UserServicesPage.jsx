import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Icon from '../components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const UserServicesPage = () => {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [userServices, setUserServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('purchased');

  // Fetch user's purchased/booked services and all available services
  useEffect(() => {
    const fetchUserServices = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user's bookings to get purchased services
        const bookingsResponse = await api.bookings.getBookings();
        
        // Fetch all available services
        const servicesResponse = await api.services.getServices();
        
        if (bookingsResponse.success) {
          // Extract unique services from user's bookings
          const purchasedServices = bookingsResponse.data
            .filter(booking => booking.service && booking.bookingStatus !== 'cancelled')
            .map(booking => ({
              ...booking.service,
              booking: booking,
              bookingId: booking._id,
              bookingDate: booking.bookingDate,
              bookingStatus: booking.bookingStatus,
              paymentStatus: booking.paymentStatus
            }))
            .filter((service, index, self) => 
              index === self.findIndex(s => s._id === service._id)
            );
          
          setUserServices(purchasedServices);
        }

        if (servicesResponse.success) {
          setAvailableServices(servicesResponse.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchUserServices();
  }, [user]);

  // Get service status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
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
      day: 'numeric'
    });
  };

  // Handle service booking
  const handleBookService = (serviceId) => {
    window.location.href = `/services#${serviceId}`;
  };

  // If user is not authenticated
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <Icon name="user-x" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please log in to view your services</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Services</h1>
          <p className="text-gray-600">Manage your purchased services and explore new ones</p>
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('purchased')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchased'
                    ? 'border-brand-indigo text-brand-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} />
                  Purchased Services
                  {userServices.length > 0 && (
                    <span className="ml-2 bg-brand-indigo text-white rounded-full px-2 py-1 text-xs">
                      {userServices.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-brand-indigo text-brand-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="shopping-cart" size={16} />
                  Available Services
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'purchased' ? (
              <motion.div
                key="purchased"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {userServices.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <Icon name="package" size={64} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Purchased</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't purchased any services yet. Explore our available services to get started!
                    </p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="inline-block px-6 py-3 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigo/90 transition-colors"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userServices.map((service, index) => (
                      <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          {service.image && (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=Service+Image';
                              }}
                            />
                          )}
                          <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.bookingStatus)}`}>
                              {service.bookingStatus || 'Active'}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Booking Date:</span>
                              <span className="font-medium">{formatDate(service.bookingDate)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Payment:</span>
                              <span className="font-medium">{service.paymentStatus || 'Pending'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Price:</span>
                              <span className="font-medium text-brand-indigo">₹{service.price}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/orders`}
                              className="flex-1 px-4 py-2 text-brand-indigo bg-brand-indigo/10 rounded-lg text-sm font-medium hover:bg-brand-indigo/20 transition-colors text-center"
                            >
                              View Order
                            </Link>
                            <button
                              onClick={() => handleBookService(service._id)}
                              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                              title="Book Again"
                            >
                              <Icon name="repeat" size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="available"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {availableServices.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <Icon name="service" size={64} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Available</h3>
                    <p className="text-gray-600">Check back later for new services!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableServices.map((service, index) => (
                      <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          {service.image && (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=Service+Image';
                              }}
                            />
                          )}
                          {userServices.some(us => us._id === service._id) && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                <Icon name="check" size={12} className="inline mr-1" />
                                Purchased
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-brand-indigo">
                              ₹{service.price}
                            </span>
                            <div className="flex items-center text-yellow-500">
                              <Icon name="star" size={16} className="fill-current" />
                              <span className="ml-1 text-sm text-gray-600">
                                {service.rating || '4.5'} ({service.reviews || '0'})
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBookService(service._id)}
                            className="w-full px-4 py-2 bg-brand-indigo text-white rounded-lg text-sm font-medium hover:bg-brand-indigo/90 transition-colors"
                          >
                            {userServices.some(us => us._id === service._id) ? 'Book Again' : 'Book Now'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Stats Summary */}
        {userServices.length > 0 && activeTab === 'purchased' && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-indigo">{userServices.length}</p>
                <p className="text-sm text-gray-600">Total Services</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {userServices.filter(s => s.bookingStatus === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {userServices.filter(s => ['pending', 'confirmed', 'in-progress'].includes(s.bookingStatus)).length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{userServices.reduce((sum, service) => sum + (service.price || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserServicesPage;