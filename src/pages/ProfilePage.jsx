import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usersAPI, bookingsAPI, cartAPI } from '../services/api';
import Icon from '../components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const { user, logout, setUser } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  const [profile, setProfile] = useState(user);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState({ profile: false, bookings: false, cart: false });
  const [error, setError] = useState({ profile: '', bookings: '', cart: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    try {
      const res = await bookingsAPI.getUserBookings(user.id);
      if (res.success) {
        setBookings(res.data);
      } else {
        setError(prev => ({ ...prev, bookings: 'Failed to load bookings.' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, bookings: 'Error fetching bookings.' }));
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const fetchCart = async () => {
    setLoading(prev => ({ ...prev, cart: true }));
    try {
      const res = await cartAPI.getCart();
      if (res.success) {
        setCart(res.data);
      } else {
        setError(prev => ({ ...prev, cart: 'Failed to load cart.' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, cart: 'Error fetching cart.' }));
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  useEffect(() => {
    if (user) {
      if (activeTab === 'bookings') fetchBookings();
      if (activeTab === 'cart') fetchCart();
    }
  }, [activeTab, user]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setMessage('');
    setError(prev => ({ ...prev, profile: '' }));

    try {
      const res = await usersAPI.updateUser(user.id, formData);
      if (res.success) {
        setUser(res.data); // Update user in context
        setMessage('Profile updated successfully!');
        setEditMode(false);
      } else {
        setError(prev => ({ ...prev, profile: res.message || 'Failed to update profile.' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, profile: 'An error occurred while updating.' }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'bookings':
        return <BookingsSection />;
      case 'cart':
        return <CartSection />;
      default:
        return null;
    }
  };

  const ProfileSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">My Information</h3>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</div>}
      {error.profile && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error.profile}</div>}
      <form onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleFormChange} disabled={!editMode} />
          <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleFormChange} disabled={!editMode} />
          <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleFormChange} disabled={!editMode} />
          <InputField label="Address" name="address" value={formData.address} onChange={handleFormChange} disabled={!editMode} />
        </div>
        <div className="mt-8 flex justify-end gap-4">
          {editMode ? (
            <>
              <button type="button" onClick={() => setEditMode(false)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300">Cancel</button>
              <button type="submit" disabled={loading.profile} className="px-6 py-2 rounded-lg bg-brand-indigo text-white font-medium hover:bg-brand-purple transition">
                {loading.profile ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setEditMode(true)} className="px-6 py-2 rounded-lg bg-brand-indigo text-white font-medium hover:bg-brand-purple transition">Edit Profile</button>
          )}
        </div>
      </form>
    </motion.div>
  );

  const BookingsSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">My Orders & Bookings</h3>
      {loading.bookings && <p>Loading bookings...</p>}
      {error.bookings && <p className="text-red-500">{error.bookings}</p>}
      {!loading.bookings && bookings.length === 0 && <p>You have no bookings yet.</p>}
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
              <p className="font-semibold">{booking.service?.name || booking.product?.name}</p>
              <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const CartSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">My Cart</h3>
      {loading.cart && <p>Loading cart...</p>}
      {error.cart && <p className="text-red-500">{error.cart}</p>}
      {!loading.cart && (!cart || cart.items.length === 0) && <p>Your cart is empty.</p>}
      {cart && cart.items.length > 0 && (
        <div className="space-y-4">
          {cart.items.map(item => (
            <div key={item.productId} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">₹{item.price.toFixed(2)}</p>
            </div>
          ))}
          <div className="text-right font-bold text-xl mt-4">
            Total: ₹{cart.total.toFixed(2)}
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">My Account</h1>
          <p className="text-lg text-gray-500 mt-2">Manage your profile, orders, and cart.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Tabs Navigation */}
          <aside className="md:w-1/4">
            <nav className="space-y-2">
              <TabButton id="profile" icon="User" label="My Profile" />
              <TabButton id="bookings" icon="Calendar" label="My Orders" />
              <TabButton id="cart" icon="ShoppingCart" label="My Cart" />
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                <Icon name="LogOut" size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Tab Content */}
          <main className="md:w-3/4 bg-white p-8 rounded-xl shadow-md">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ id, icon, label }) => {
  const { activeTab, setActiveTab } = useContext(ProfilePageContext);
  const isActive = activeTab === id;
  return (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${isActive ? 'bg-brand-indigo text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
      <Icon name={icon} size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo disabled:bg-gray-100" />
  </div>
);

const ProfilePageContext = React.createContext();

const ProfilePageWrapper = () => (
  <ProfilePageContext.Provider value={{ activeTab: 'profile', setActiveTab: () => {} }}>
    <ProfilePage />
  </ProfilePageContext.Provider>
);

export default ProfilePage;
