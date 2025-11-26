import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Icon from '../components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedProfilePage = () => {
  const { user, updateProfile, updatePassword, isLoading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile stats
  const [profileStats, setProfileStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    memberSince: null
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || ''
      });
      
      // Calculate member since date
      if (user.createdAt) {
        setProfileStats(prev => ({
          ...prev,
          memberSince: new Date(user.createdAt)
        }));
      }
    }
  }, [user]);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const response = await api.bookings.getBookings();
        if (response.success) {
          const bookings = response.data || [];
          const completedBookings = bookings.filter(b => b.bookingStatus === 'completed');
          const totalSpent = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
          
          setProfileStats(prev => ({
            ...prev,
            totalOrders: bookings.length,
            completedOrders: completedBookings.length,
            totalSpent: totalSpent
          }));
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (activeTab === 'profile') {
      fetchStats();
    }
  }, [activeTab, user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await updateProfile(profileForm);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to update profile' });
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

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      const response = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  useEffect(() => {
    if (message.text) {
      clearMessage();
    }
  }, [message.text]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ').filter(Boolean);
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // If user is not authenticated
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <Icon name="user-x" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center text-brand-indigo shadow-lg">
                <span className="text-2xl sm:text-3xl font-bold">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
                <div className="space-y-1">
                  <p className="flex items-center opacity-90">
                    <Icon name="mail" size={16} className="mr-2" />
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="flex items-center opacity-90">
                      <Icon name="phone" size={16} className="mr-2" />
                      {user.phone}
                    </p>
                  )}
                  <p className="flex items-center opacity-90">
                    <Icon name="calendar" size={16} className="mr-2" />
                    Member since {formatDate(profileStats.memberSince)}
                  </p>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Account Status</p>
                  <p className="font-semibold">
                    {user?.role === 'admin' ? 'Administrator' : 'Active Member'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 sm:px-8 py-6 bg-gray-50 border-b">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-indigo">{profileStats.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{profileStats.completedOrders}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">₹{profileStats.totalSpent}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center">
                <Icon 
                  name={message.type === 'success' ? 'check-circle' : 'alert-circle'} 
                  size={20} 
                  className={`mr-2 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`} 
                />
                {message.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-brand-indigo text-brand-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="user" size={16} />
                  Personal Information
                </div>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-brand-indigo text-brand-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="lock" size={16} />
                  Security Settings
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 text-brand-indigo bg-brand-indigo/10 rounded-lg text-sm font-medium hover:bg-brand-indigo/20 transition-colors"
                    >
                      <Icon name="edit" size={16} className="inline mr-1" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo ${
                          editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo ${
                          editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo ${
                          editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                        }`}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileForm.dateOfBirth}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo ${
                          editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={profileForm.gender}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo ${
                          editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo ${
                          editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                        }`}
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="mt-8 flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Icon name="loader" size={16} className="inline mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                        required
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                        required
                        placeholder="Enter your new password"
                        minLength={6}
                      />
                      <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                        required
                        placeholder="Confirm your new password"
                        minLength={6}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-brand-indigo text-white rounded-lg font-medium hover:bg-brand-indigo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Icon name="loader" size={16} className="inline mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Additional Security Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Security Tips</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use a strong password with at least 8 characters</li>
                    <li>• Include uppercase, lowercase, numbers, and special characters</li>
                    <li>• Don't reuse passwords from other accounts</li>
                    <li>• Change your password regularly</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedProfilePage;