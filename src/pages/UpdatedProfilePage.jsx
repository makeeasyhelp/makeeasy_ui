import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/ui/Icon';

const ProfilePage = ({ onNavigate }) => {
  const { auth } = useContext(AuthContext) || {};
  const { state } = useContext(AppContext) || {};
  const user = state?.user || auth?.user;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch user bookings
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const response = await api.bookings.getBookings();
        if (response.success) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setBookingsLoading(false);
      }
    };

    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.auth.updateDetails(profileForm);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        setEditMode(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await api.bookings.updateBooking(bookingId, {
        bookingStatus: 'cancelled'
      });
      
      if (response.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, bookingStatus: 'cancelled' } 
            : booking
        ));
        setMessage({ type: 'success', text: 'Booking cancelled successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel booking' });
    }
  };

  // If no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-faint">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <Icon name="user-x" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigoDark transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-faint py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-brand-indigo to-brand-purple p-6 sm:p-10 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-brand-indigo mr-4 shadow-lg">
                  <span className="text-2xl sm:text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                  <p className="opacity-90 flex items-center">
                    <Icon name="mail" size={16} className="mr-1" />
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="opacity-90 flex items-center">
                      <Icon name="phone" size={16} className="mr-1" />
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-brand-indigo">
                  <Icon name="star" size={16} className="mr-1" />
                  {user.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-brand-indigo text-brand-indigo'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'border-b-2 border-brand-indigo text-brand-indigo'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-brand-indigo text-brand-indigo'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Rentals
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center text-brand-indigo hover:text-brand-indigoDark"
                    >
                      <Icon name="edit" size={16} className="mr-1" />
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="mt-6 flex items-center space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-indigo text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-indigoDark transition-colors"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setProfileForm({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || ''
                          });
                        }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                  <p className="text-gray-600 mt-1">Ensure your account is using a secure password</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-brand-indigo text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-indigoDark transition-colors"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">My Rental History</h2>

                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <Icon name="loader" size={32} className="animate-spin text-brand-indigo mx-auto mb-2" />
                    <p className="text-gray-600">Loading your rentals...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Icon name="package" size={48} className="text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No rentals yet</h3>
                    <p className="text-gray-600 mb-6">You haven't rented any products yet</p>
                    <a
                      href="/products"
                      className="inline-block px-6 py-2 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigoDark transition-colors"
                    >
                      Browse Products
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div className="mb-4 sm:mb-0">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.product ? booking.product.title : booking.service?.title || 'Product/Service'}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                  booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-brand-purple">₹{booking.totalAmount}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 mt-4 pt-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-start">
                                <Icon name="map-pin" size={16} className="text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                                <p className="text-sm text-gray-600">
                                  {booking.product?.location || 'Location not specified'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {booking.bookingStatus === 'pending' && (
                                  <button
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded hover:bg-red-50 text-sm font-medium"
                                  >
                                    <Icon name="x" size={14} className="mr-1" />
                                    Cancel
                                  </button>
                                )}
                                <button
                                  className="inline-flex items-center px-3 py-1.5 border border-brand-indigo text-brand-indigo rounded hover:bg-brand-indigo/10 text-sm font-medium"
                                >
                                  <Icon name="eye" size={14} className="mr-1" />
                                  Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
