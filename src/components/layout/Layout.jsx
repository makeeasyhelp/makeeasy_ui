import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';

const Layout = () => {
    // Hooks
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isLoading: authLoading } = useContext(AuthContext);
    const { isLoading: appLoading } = useContext(AppContext);
    const [activePage, setActivePage] = useState('Home');
    const [error, setError] = useState(null);
    
    // Effects - all hooks must be called before any conditional returns
    useEffect(() => {
        // Update active page based on location
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
        // Set body background color and text color
        document.body.style.backgroundColor = '#f9fafb';
        document.body.style.color = '#1f2937';
        
        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, []);

    // Derived state - after hooks, before conditional returns
    const isAdmin = user && user.role === 'admin';

    // Early returns for loading and error states
    if (authLoading || appLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-indigo border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-brand-indigo text-white rounded-lg hover:bg-opacity-90"
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
            <Header activePage={activePage} />
            {isAdmin && (
                <div className="bg-brand-indigo/10 py-2 px-4 flex gap-4 items-center justify-center">
                    <button onClick={() => navigate('/admin/dashboard')} className="text-brand-indigo font-bold">Dashboard</button>
                    <button onClick={() => navigate('/admin/products')} className="text-brand-indigo">Products</button>
                    <button onClick={() => navigate('/admin/categories')} className="text-brand-indigo">Categories</button>
                    <button onClick={() => navigate('/admin/services')} className="text-brand-indigo">Services</button>
                    <button onClick={handleAdminLogout} className="ml-4 text-red-500 font-bold">Logout</button>
                </div>
            )}
            <main className="flex-grow w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Layout;
