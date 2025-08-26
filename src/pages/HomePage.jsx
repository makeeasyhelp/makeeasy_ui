import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { motion } from 'framer-motion';
import { productsAPI, categoriesAPI, servicesAPI } from '../services/api';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [featuredListings, setFeaturedListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch all data in parallel
                const [categoriesRes, servicesRes, productsRes] = await Promise.all([
                    categoriesAPI.getCategories(),
                    servicesAPI.getServices(),
                    productsAPI.getFeaturedProducts()
                ]);

                if (categoriesRes.success) {
                    setCategories(categoriesRes.data);
                }
                if (servicesRes.success) {
                    setServices(servicesRes.data);
                }
                if (productsRes.success) {
                    setFeaturedListings(productsRes.data);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = () => {
        // Navigate to products page with search params
        navigate(`/products?search=${searchInput}&category=${searchCategory}&location=${searchLocation}`);
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-white py-24 bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-pink relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="text-center px-4 relative z-10 max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-7xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
                    >
                        make<span className="text-brand-lightBlue text-size-10"></span>easy
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight"
                    >
                        Rent Anything, Book Any Service
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-xl md:text-2xl mb-10 opacity-90"
                    >
                        Your one-stop marketplace for rentals and professional services
                    </motion.p>
                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input 
                                type="text" 
                                placeholder="What are you looking for?" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                aria-label="Search products or services"
                            />
                            <select 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                value={searchCategory}
                                onChange={e => setSearchCategory(e.target.value)}
                                aria-label="Select category"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.key} value={cat.key}>{cat.name}</option>
                                ))}
                            </select>
                            <input 
                                type="text" 
                                placeholder="Location" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                value={searchLocation}
                                onChange={e => setSearchLocation(e.target.value)}
                                aria-label="Location"
                            />
                            <button 
                                className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform shadow-button"
                                onClick={handleSearch}
                                aria-label="Search"
                            >
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <main className="w-full">
                {/* Categories Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="py-20 bg-background-faint"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Browse Categories</h2>
                        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Find exactly what you need from our wide range of services and rental options</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat.key}
                                    whileHover={{ scale: 1.07, boxShadow: '0 8px 24px rgba(79,70,229,0.10)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    onClick={() => navigate('/products', { state: { category: cat.key } })}
                                    className="bg-background-card rounded-xl shadow-card p-6 text-center transition-all duration-300 transform cursor-pointer group"
                                    aria-label={`Browse ${cat.name}`}
                                    tabIndex={0}
                                    role="button"
                                    onKeyPress={e => { if (e.key === 'Enter') navigate('/products', { state: { category: cat.key } }); }}
                                >
                                    <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Icon name={cat.icon} className="text-brand-indigo group-hover:text-brand-purple transition-colors duration-300" size={32} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-indigo transition-colors">{cat.name}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Popular Services Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="py-20 bg-background-light"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Popular Services</h2>
                        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Expert service providers at your doorstep</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {services.map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(236,72,153,0.10)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-white p-6 rounded-xl shadow-card border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                        <Icon name={service.icon} className="text-brand-indigo" size={32} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                    <button className="mt-4 w-full bg-brand-indigo/10 text-brand-indigo py-2 rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                        Book Now
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Handyman Services Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="py-20 bg-background-faint"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Handyman Services</h2>
                        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Professional home repair and maintenance services</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { title: "AC Service & Repair", icon: "Fan", description: "Professional AC maintenance and repair" },
                                { title: "Plumbing Services", icon: "Droplet", description: "Expert plumbing solutions" },
                                { title: "Electrical Services", icon: "Zap", description: "Licensed electrical contractors" },
                                { title: "Painting Services", icon: "PaintBucket", description: "Transform your space" }
                            ].map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(236,72,153,0.10)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-white p-6 rounded-xl shadow-card border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                        <Icon name={service.icon} className="text-brand-indigo" size={32} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                    <button className="mt-4 w-full bg-brand-indigo/10 text-brand-indigo py-2 rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                        Schedule Now
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Professional Services Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="py-20 bg-background-light"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Professional Services</h2>
                        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Expert consultants for your business needs</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { title: "Legal Consultation", icon: "Scale", description: "Expert legal advice and documentation" },
                                { title: "CA Services", icon: "Calculator", description: "Tax & financial consultation" },
                                { title: "Web Development", icon: "Code", description: "Custom website solutions" },
                                { title: "Digital Marketing", icon: "Megaphone", description: "Grow your online presence" }
                            ].map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(236,72,153,0.10)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-white p-6 rounded-xl shadow-card border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                        <Icon name={service.icon} className="text-brand-indigo" size={32} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                    <button className="mt-4 w-full bg-brand-indigo/10 text-brand-indigo py-2 rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                        Book Consultation
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Featured Listings Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="py-20 bg-background-faint"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Featured Listings</h2>
                        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">Explore our top picks for rentals and services</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {featuredListings.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(236,72,153,0.10)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-white p-6 rounded-xl shadow-card border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/product-details', { state: { productId: item.id } })}
                                    aria-label={`View details for ${item.title}`}
                                    tabIndex={0}
                                    role="button"
                                    onKeyPress={e => { if (e.key === 'Enter') navigate('/product-details', { state: { productId: item.id } }); }}
                                >
                                    <div className="font-bold text-lg text-brand-indigo mb-1">{item.title}</div>
                                    <div className="text-sm text-gray-500 mb-2 flex items-center">
                                        <Icon name="MapPin" size={14} className="mr-1 text-gray-400" /> {item.location}
                                    </div>
                                    <div className="text-brand-purple font-semibold">₹{item.price}/day</div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <motion.button
                                whileHover={{ scale: 1.07 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                onClick={() => navigate('/products')}
                                className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-8 py-3 rounded-full font-bold shadow-button hover:shadow-button-hover hover:scale-105 transition-transform"
                            >
                                View All Products
                            </motion.button>
                        </div>
                    </div>
                </motion.section>
            </main>
        </>
    );
};

export default HomePage;
