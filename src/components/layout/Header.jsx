import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { Menu, X, User, ShoppingCart, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import newLogo from '../../assets/newwlogo.png';

const getInitials = (name = '') => {
  const names = name.split(' ').filter(Boolean);
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return names[0] ? `${names[0][0]}`.toUpperCase() : '';
};

const Header = ({ activePage }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout } = useContext(AuthContext);
  const { selectedLocation, openLocationModal } = useLocationContext();
  const isLoggedIn = !!user;

  const navLinks = useMemo(() => [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ], []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 10);
    setShowHeader(currentY <= lastScrollY.current || currentY < 100);
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLogoError = (e) => {
    e.target.src = "https://placehold.co/120x40/4f46e5/ffffff?text=MakeEasy";
    e.target.onerror = null;
  };

  const userInitials = useMemo(() => getInitials(user?.name), [user?.name]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
      className={`sticky top-0 z-50 w-full transition-shadow duration-200 ${
        scrolled
          ? 'bg-white/75 backdrop-blur-md shadow-md'
          : 'bg-white/80 backdrop-blur'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex-shrink-0">
              <img
                src={newLogo}
                alt="MakeEasy Logo"
                className="h-22 w-48"
                onError={handleLogoError}
              />
            </Link>
          </div>

            {/* Location Display */}
            <button
              onClick={openLocationModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent hover:bg-gray-200 transition-colors group whitespace-nowrap"
            >
              <MapPin size={16} className="text-brand-indigo flex-shrink-0" />
              <div className="text-left">
                {selectedLocation ? (
                  <>
                    <div className="text-xs font-semibold text-gray-900">
                      {selectedLocation.district}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedLocation.state}
                    </div>
                  </>
                ) : (
                  <div className="text-sm font-medium text-gray-600 group-hover:text-brand-indigo">
                    Select Location
                  </div>
                )}
              </div>
            </button>
          {/* Center Section: Location & Nav Links */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">

            {/* Desktop Nav */}
            <nav className="flex items-center space-x-1">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 text-sm font-bold rounded-md transition-colors duration-200 ${
                    activePage === link.name
                      ? 'text-brand-indigo'
                      : 'text-gray-700 hover:text-brand-indigo'
                  } group`}
                >
                  {link.name}
                  {activePage === link.name && (
                    <motion.span 
                      layoutId="active-nav-underline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-brand-indigo"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 relative">
            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <div className="w-7 h-7 bg-brand-indigo text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium pr-2">{user?.name}</span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border"
                    >
                      <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                      <Link to="/orders" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                      <Link to="/user-services" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Your Services</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Login"
              >
                <User size={18} />
              </button>
            )}

            <button
              onClick={() => navigate('/cart')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={18} />
              {/* Optional: Add a badge for cart items */}
              {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">3</span> */}
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Location Selector */}
              <button
                onClick={() => {
                  openLocationModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors mb-3"
              >
                <MapPin size={20} className="text-brand-indigo" />
                <div className="text-left flex-1">
                  {selectedLocation ? (
                    <>
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedLocation.district}, {selectedLocation.state}
                      </div>
                      <div className="text-xs text-gray-500">
                        Click to change location
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-gray-600">
                      Select Your Location
                    </div>
                  )}
                </div>
              </button>

              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 text-base rounded-md ${
                    activePage === link.name
                      ? 'text-brand-indigo bg-indigo-50 font-medium'
                      : 'text-gray-700 font-normal'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t my-2"></div>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 w-full py-2 text-left rounded-md text-base hover:bg-gray-100">
                    <div className="w-7 h-7 bg-brand-indigo text-white rounded-full flex items-center justify-center text-xs font-bold">{userInitials}</div>
                    <span className="font-medium">{user?.name}</span>
                  </Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2 px-3 text-left rounded-md text-base hover:bg-gray-100">Orders</Link>
                  <Link to="/user-services" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2 px-3 text-left rounded-md text-base hover:bg-gray-100">Your Services</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full mt-2 py-2 text-center rounded-md text-base font-medium bg-red-500 text-white">Logout</button>
                </>
              ) : (
                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full py-2.5 text-center rounded-md text-base font-medium bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white">
                  Login / Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
