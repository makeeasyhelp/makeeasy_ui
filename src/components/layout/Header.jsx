import React, { useState, useEffect, useRef, useContext } from 'react';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import newLogo from '../../assets/newwlogo.png';

const Header = ({ activePage }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrolled(currentY > 10);
          if (currentY > lastScrollY.current && showHeader) {
            setShowHeader(false);
          } else if (currentY < lastScrollY.current && !showHeader) {
            setShowHeader(true);
          }
          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showHeader]);

  const handleLogoError = (e) => {
    e.target.src = "https://placehold.co/120x40/4f46e5/ffffff?text=MakeEasy";
    e.target.onerror = null;
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{ type: 'tween', duration: 0.25 }}
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b'
          : 'bg-white/70 backdrop-blur'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={newLogo}
              alt="MakeEasy Logo"
              className="h-10 w-auto"
              onError={handleLogoError}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  activePage === link.name
                    ? 'text-brand-indigo'
                    : 'text-gray-700 hover:text-brand-indigo'
                } group`}
              >
                {link.name}
                {/* Hover underline */}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-brand-indigo transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3 relative">
            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  <User size={18} />
                  <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border animate-fadeIn">
                    <button
                      onClick={() => navigate('/profile')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/orders')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => navigate('/services')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Your Services
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <User size={18} />
              </button>
            )}

            <button
              onClick={() => navigate('/cart')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ShoppingCart size={18} />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-t px-4 py-3 space-y-2"
        >
          {navLinks.map(link => (
            <button
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm rounded-md ${
                activePage === link.name
                  ? 'text-brand-indigo bg-indigo-50'
                  : 'text-gray-700'
              }`}
            >
              {link.name}
            </button>
          ))}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-left rounded-md text-sm hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  navigate('/orders');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-left rounded-md text-sm hover:bg-gray-100"
              >
                Orders
              </button>
              <button
                onClick={() => {
                  navigate('/services');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-left rounded-md text-sm hover:bg-gray-100"
              >
                Your Services
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center rounded-md text-sm font-medium bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center rounded-md text-sm font-medium bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white"
            >
              Login
            </button>
          )}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
