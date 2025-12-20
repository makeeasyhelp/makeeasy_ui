import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import LocationModal from '../LocationModal';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import { LogOut } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading: authLoading } = useContext(AuthContext);
  const { isLoading: appLoading } = useContext(AppContext);
  const [activePage, setActivePage] = useState('Home');
  const [error, setError] = useState(null);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/') setActivePage('Home');
    else if (pathname.startsWith('/products')) setActivePage('Products');
    else if (pathname.startsWith('/services')) setActivePage('Services');
    else if (pathname.startsWith('/about')) setActivePage('About');
    else if (pathname.startsWith('/contact')) setActivePage('Contact');
    else if (pathname.startsWith('/login')) setActivePage('Login');
    else if (pathname.startsWith('/profile')) setActivePage('Profile');
  }, [location]);

  useEffect(() => {
    document.body.style.backgroundColor = '#f9fafb';
    document.body.style.color = '#1f2937';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const isAdmin = user && user.role === 'admin';

  if (authLoading || appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-indigo border-t-transparent mb-3"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-xl font-bold text-red-600 mb-3">Something went wrong</h1>
          <p className="text-gray-600 text-sm mb-3">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-indigo text-white rounded-lg text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const handleAdminLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Top Header */}
      <Header activePage={activePage} />

      {/* Admin Bar */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-brand-indigo/10 via-brand-purple/10 to-brand-pink/10 border-b-2 border-brand-indigo/20 py-3 px-2 sm:px-6 flex gap-2 md:gap-4 items-center justify-start overflow-x-auto text-sm scrollbar-hide"
        >
          <span className="text-brand-indigo font-bold whitespace-nowrap mr-2 md:mr-6 hidden sm:inline">Admin Panel:</span>
          
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Products
          </button>
          
          <button 
            onClick={() => navigate('/admin/categories')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Categories
          </button>
          
          <button 
            onClick={() => navigate('/admin/services')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Services
          </button>
          
          <button 
            onClick={() => navigate('/admin/about')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            About
          </button>
          
          <button 
            onClick={() => navigate('/admin/banners')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Banners
          </button>
          
          <button 
            onClick={() => navigate('/admin/locations')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Locations
          </button>

          <button 
            onClick={() => navigate('/admin/users')}
            className="px-3 md:px-4 py-2 rounded-lg font-semibold text-brand-indigo hover:bg-white hover:shadow-md transition-all whitespace-nowrap"
          >
            Users
          </button>
          
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1 text-red-600 font-semibold ml-auto px-3 md:px-4 py-2 rounded-lg hover:bg-red-50 hover:shadow-md transition-all whitespace-nowrap"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </motion.div>
      )}

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Page Content */}
      <main className="flex-grow w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="px-0 sm:px-0"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer + Floating WhatsApp */}
      <Footer />
      <div className="fixed bottom-20 right-4 sm:bottom-24">
        <WhatsAppButton />
      </div>

      {/* Location Modal */}
      <LocationModal />
    </div>
  );
};

export default Layout;
