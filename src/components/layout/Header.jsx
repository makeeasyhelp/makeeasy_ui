import React, { useState, useEffect, useRef, useContext } from 'react';
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import newLogo from '../../assets/newwlogo.png';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ activePage }) => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Services", path: "/services" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" }
    ];
    const { user, logout } = useContext(AuthContext);
    const isLoggedIn = !!user;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Improved scroll handler for performance
    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    setScrolled(currentY > 10);
                    if (currentY < 10) {
                        if (!showHeader) setShowHeader(true);
                        lastScrollY.current = currentY;
                        ticking.current = false;
                        return;
                    }
                    if (currentY > lastScrollY.current && showHeader) {
                        setShowHeader(false); // scrolling down
                    } else if (currentY < lastScrollY.current && !showHeader) {
                        setShowHeader(true); // scrolling up
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
    
    // Check if logo image exists and use onError fallback
    const handleLogoError = (e) => {
        console.error("Logo failed to load");
        e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
        e.target.onerror = null;
    };

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: showHeader ? 0 : -100 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className={`sticky top-0 z-50 w-full transition-all duration-200 ${
                scrolled 
                ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100' 
                : 'bg-white/50 backdrop-blur-sm'
            }`}
        >
            <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.07 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="flex-shrink-0"
                        >
                            <Link to="/">
                                <img 
                                    src={newLogo} 
                                    alt="MakeEasy Logo" 
                                    className="h-14 w-auto cursor-pointer" 
                                    onError={handleLogoError}
                                />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <motion.button
                                key={link.name}
                                onClick={() => navigate(link.path)}
                                className={`relative py-2 px-1 font-medium text-base focus:outline-none ${
                                    activePage === link.name 
                                    ? 'text-brand-indigo' 
                                    : 'text-gray-700'
                                }`}
                                whileHover={{ scale: 1.08, color: '#4f46e5' }}
                                transition={{ type: 'spring', stiffness: 350 }}
                            >
                                {link.name}
                                <motion.span
                                    layoutId="header-underline"
                                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink rounded-full"
                                    initial={false}
                                    animate={{
                                        scaleX: activePage === link.name ? 1 : 0,
                                        opacity: activePage === link.name ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{ transformOrigin: 'left' }}
                                />
                            </motion.button>
                        ))}
                    </nav>

                    {/* Right Side: Search & Login/Logout */}
                    <div className="hidden md:flex items-center space-x-4">
                  

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.07 }}
                                    transition={{ type: 'spring', stiffness: 350 }}
                                    className="flex items-center space-x-2 px-5 py-2 bg-indigo-100 text-brand-indigo rounded-full font-medium"
                                    onClick={() => navigate('/profile')}
                                >
                                    <User size={18} />
                                    <span>{user?.name || 'Profile'}</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.07 }}
                                    transition={{ type: 'spring', stiffness: 350 }}
                                    className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-full font-medium shadow-button hover:shadow-button-hover"
                                    onClick={handleLogout}
                                >
                                    <span>Logout</span>
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.07 }}
                                transition={{ type: 'spring', stiffness: 350 }}
                                className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-full font-medium shadow-button hover:shadow-button-hover"
                                onClick={() => navigate('/login')}
                            >
                                <User size={18} />
                                <span>Login</span>
                            </motion.button>
                        )}
                              {isLoggedIn && (
                            <div className="text-gray-600 text-sm mr-2">
                                Welcome back, <span className="font-semibold">{user?.name}</span>
                            </div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.15, color: '#4f46e5' }}
                            transition={{ type: 'spring', stiffness: 350 }}
                            className="text-gray-600 hover:text-brand-indigo transition-colors"
                        >
                        </motion.button>
                        {isLoggedIn && (
                            <motion.button
                                whileHover={{ scale: 1.15, color: '#4f46e5' }}
                                transition={{ type: 'spring', stiffness: 350 }}
                                className="text-gray-600 hover:text-brand-indigo transition-colors"
                                onClick={() => navigate('/cart')}
                            >
                                <ShoppingCart size={20} />
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-brand-indigo p-2 rounded-md transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden px-4 py-4 bg-white/95 backdrop-blur-md shadow-lg"
                >
                    <div className="space-y-3">
                        {navLinks.map(link => (
                            <motion.button
                                key={link.name}
                                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                                className={`block w-full text-left px-4 py-2 rounded-md font-medium text-base focus:outline-none ${
                                    activePage === link.name ? 'text-brand-indigo bg-indigo-50' : 'text-gray-800'
                                }`}
                                whileHover={{ scale: 1.04, color: '#4f46e5' }}
                                transition={{ type: 'spring', stiffness: 350 }}
                            >
                                {link.name}
                            </motion.button>
                        ))}
                        <div className="pt-2 border-t border-gray-100 mt-3">
                            {isLoggedIn ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 text-sm text-gray-600">
                                        Welcome, {user?.name}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        transition={{ type: 'spring', stiffness: 350 }}
                                        className="flex w-full items-center gap-2 py-2 px-4 rounded-md bg-indigo-50 text-brand-indigo font-medium"
                                        onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                                    >
                                        <User size={18} />
                                        <span>Profile</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        transition={{ type: 'spring', stiffness: 350 }}
                                        className="flex w-full items-center justify-center gap-2 py-2 rounded-full bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white font-medium shadow-md hover:shadow-lg"
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    >
                                        <span>Logout</span>
                                    </motion.button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.07 }}
                                    transition={{ type: 'spring', stiffness: 350 }}
                                    className="flex w-full items-center justify-center gap-2 py-2 rounded-full bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white font-medium shadow-md hover:shadow-lg"
                                    onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                                >
                                    <User size={18} />
                                    <span>Login</span>
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
};

export default Header;
