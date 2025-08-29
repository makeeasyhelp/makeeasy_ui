import React, { useState, useEffect, useRef } from 'react';
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
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchRef = useRef(null);
    const [activeServiceTab, setActiveServiceTab] = useState('Popular');
    const [isCategoriesPaused, setIsCategoriesPaused] = useState(false);

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

    // Close search form when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchExpanded(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        // Navigate to products page with search params
        navigate(`/products?search=${searchInput}&category=${searchCategory}&location=${searchLocation}`);
        setIsSearchExpanded(false);
    };

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-brand-indigo">Loading...</div>
        </div>;
    }

    return (
        <>
            {/* Hero Section - Optimized for mobile */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-white py-10 md:py-16 bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-pink relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="text-center px-4 relative z-10 max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-5xl md:text-7xl font-extrabold mb-3 md:mb-6 leading-tight tracking-tight"
                    >
                        make<span className="text-brand-lightBlue"></span>easy
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-2xl md:text-4xl font-bold mb-3 md:mb-6 leading-tight tracking-tight"
                    >
                        Rent Anything, Book Any Service
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-base md:text-xl mb-6 md:mb-10 opacity-90"
                    >
                        Your one-stop marketplace for rentals and services
                    </motion.p>
                    
                    {/* Mobile-friendly Search Bar */}
                    <div ref={searchRef} className="relative z-10">
                        {/* Collapsed Search Button on Mobile */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            onClick={toggleSearch}
                            className="md:hidden bg-white text-brand-indigo w-full py-3 px-4 rounded-lg shadow-lg font-medium flex items-center justify-center gap-2"
                        >
                            <Icon name="Search" size={18} />
                            <span>Search Products & Services</span>
                        </motion.button>
                        
                        {/* Expandable Search Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0,
                                height: isSearchExpanded ? 'auto' : 'auto',
                                display: isSearchExpanded ? 'block' : 'none'
                            }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl md:static md:mt-0 md:block md:bg-white/20 md:backdrop-blur-xl md:p-4 md:shadow-2xl"
                        >
                            <div className="flex flex-col gap-3">
                                <input 
                                    type="text" 
                                    placeholder="What are you looking for?" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo text-sm md:text-base"
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    aria-label="Search products or services"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo text-sm md:text-base"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo text-sm md:text-base"
                                        value={searchLocation}
                                        onChange={e => setSearchLocation(e.target.value)}
                                        aria-label="Location"
                                    />
                                </div>
                                <button 
                                    className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-4 py-2 rounded-lg font-medium hover:opacity-95 transition-opacity shadow-button text-sm md:text-base"
                                    onClick={handleSearch}
                                    aria-label="Search"
                                >
                                    Search Now
                                </button>
                            </div>
                        </motion.div>
                        
                        {/* Desktop Search Form (Always Visible) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="hidden md:block bg-white/20 backdrop-blur-xl rounded-2xl p-4 shadow-2xl"
                        >
                            <div className="grid grid-cols-4 gap-3">
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
                </div>
            </motion.section>

            <main className="w-full">
                {/* Categories Section - More compact for mobile */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="py-10 md:py-16 bg-background-faint"
                >
                   <div className="container mx-auto px-4">
  <h2 className="text-xl md:text-3xl font-bold text-center text-gray-900 mb-2 tracking-tight">
    Browse Categories
  </h2>
  <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-6 md:mb-10">
    Find exactly what you need from our wide range of options
  </p>

{/* Mobile → Horizontal scroll with snap + fade edges */}
<div
  className="flex md:hidden overflow-x-auto hide-scrollbar pb-4 space-x-3 
             snap-x snap-mandatory relative"
  onMouseEnter={() => setIsCategoriesPaused(true)}
  onMouseLeave={() => setIsCategoriesPaused(false)}
  onTouchStart={() => setIsCategoriesPaused(true)}
  onTouchEnd={() => setIsCategoriesPaused(false)}
>
  {/* Left fade overlay */}
  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
  {/* Right fade overlay */}
  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

  {categories.map((cat, idx) => (
    <motion.div
      key={cat.key}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 250 }}
      onClick={() => navigate('/products', { state: { category: cat.key } })}
      className="flex-shrink-0 snap-center w-28 bg-background-card 
                 rounded-xl shadow-sm p-3 text-center cursor-pointer group"
    >
      <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 
                      rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
        <Icon
          name={cat.icon}
          className="text-brand-indigo group-hover:text-brand-purple transition-colors duration-300"
          size={24}
        />
      </div>
      <h3 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-brand-indigo">
        {cat.name}
      </h3>
    </motion.div>
  ))}
</div>


  {/* Desktop → Grid with hover + fade-in animation */}
  <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
    {categories.map((cat, idx) => (
      <motion.div
        key={cat.key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05, duration: 0.3 }}
        whileHover={{ scale: 1.07 }}
        onClick={() => navigate('/products', { state: { category: cat.key } })}
        className="bg-background-card rounded-xl shadow-sm p-4 text-center cursor-pointer group"
        aria-label={`Browse ${cat.name}`}
        tabIndex={0}
        role="button"
        onKeyPress={e => { if (e.key === 'Enter') navigate('/products', { state: { category: cat.key } }); }}
      >
        <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
          <Icon name={cat.icon} className="text-brand-indigo group-hover:text-brand-purple transition-colors duration-300" size={26} />
        </div>
        <h3 className="font-medium text-sm text-gray-900 group-hover:text-brand-indigo transition-colors">
          {cat.name}
        </h3>
      </motion.div>
    ))}
  </div>
</div>

                </motion.section>

                {/* Services Sections - Combined and optimized */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="py-10 md:py-16 bg-background-light"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 tracking-tight">Popular Services</h2>
                        <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-6 md:mb-10">Expert service providers at your doorstep</p>
                        
                        {/* Tab-based navigation for mobile */}
                        <div className="flex justify-center mb-6 md:hidden">
                            <div className="inline-flex bg-gray-100 rounded-full p-1">
                                <button
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium ${activeServiceTab === 'Popular' ? 'bg-brand-indigo text-white' : 'text-gray-700'}`}
                                    onClick={() => setActiveServiceTab('Popular')}
                                >
                                    Popular
                                </button>
                                <button
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium ${activeServiceTab === 'Handyman' ? 'bg-brand-indigo text-white' : 'text-gray-700'}`}
                                    onClick={() => setActiveServiceTab('Handyman')}
                                >
                                    Handyman
                                </button>
                                <button
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium ${activeServiceTab === 'Professional' ? 'bg-brand-indigo text-white' : 'text-gray-700'}`}
                                    onClick={() => setActiveServiceTab('Professional')}
                                >
                                    Professional
                                </button>
                            </div>
                        </div>
                        
                        {/* Optimized service cards - grid on desktop, scrollable on mobile */}
                        <div className="flex overflow-x-auto pb-4 md:pb-0 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 max-w-6xl mx-auto">
                            {activeServiceTab === 'Popular' && services.slice(0, 4).map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex-shrink-0 w-60 mx-2 first:ml-0 last:mr-0 md:w-auto md:mx-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-10 h-10 flex items-center justify-center">
                                            <Icon name={service.icon} className="text-brand-indigo" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-base text-gray-800 mb-1">{service.title}</h3>
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                                            <button className="mt-1 w-full bg-brand-indigo/10 text-brand-indigo py-1.5 text-xs rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {activeServiceTab === 'Handyman' && [
                                { title: "AC Service & Repair", icon: "Fan", description: "Professional AC maintenance and repair" },
                                { title: "Plumbing Services", icon: "Droplet", description: "Expert plumbing solutions" },
                                { title: "Electrical Services", icon: "Zap", description: "Licensed electrical contractors" },
                                { title: "Painting Services", icon: "PaintBucket", description: "Transform your space" }
                            ].map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex-shrink-0 w-60 mx-2 first:ml-0 last:mr-0 md:w-auto md:mx-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-10 h-10 flex items-center justify-center">
                                            <Icon name={service.icon} className="text-brand-indigo" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-base text-gray-800 mb-1">{service.title}</h3>
                                            <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                                            <button className="mt-1 w-full bg-brand-indigo/10 text-brand-indigo py-1.5 text-xs rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                                Schedule Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {activeServiceTab === 'Professional' && [
                                { title: "Legal Consultation", icon: "Scale", description: "Expert legal advice and documentation" },
                                { title: "CA Services", icon: "Calculator", description: "Tax & financial consultation" },
                                { title: "Web Development", icon: "Code", description: "Custom website solutions" },
                                { title: "Digital Marketing", icon: "Megaphone", description: "Grow your online presence" }
                            ].map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex-shrink-0 w-60 mx-2 first:ml-0 last:mr-0 md:w-auto md:mx-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/services')}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-10 h-10 flex items-center justify-center">
                                            <Icon name={service.icon} className="text-brand-indigo" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-base text-gray-800 mb-1">{service.title}</h3>
                                            <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                                            <button className="mt-1 w-full bg-brand-indigo/10 text-brand-indigo py-1.5 text-xs rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                                Book Consultation
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* View more button for mobile */}
                        <div className="text-center mt-4 md:hidden">
                            <button className="text-brand-indigo text-sm font-medium flex items-center justify-center mx-auto">
                                View More <Icon name="ChevronRight" size={16} className="ml-1" />
                            </button>
                        </div>
                        
                        {/* Desktop - Additional service categories */}
                        <div className="hidden md:block">
                            <h3 className="text-xl font-bold text-center text-gray-900 mt-12 mb-8">Handyman Services</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                {[
                                    { title: "AC Service & Repair", icon: "Fan", description: "Professional AC maintenance and repair" },
                                    { title: "Plumbing Services", icon: "Droplet", description: "Expert plumbing solutions" },
                                    { title: "Electrical Services", icon: "Zap", description: "Licensed electrical contractors" },
                                    { title: "Painting Services", icon: "PaintBucket", description: "Transform your space" }
                                ].map((service, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                                        onClick={() => navigate('/services')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-10 h-10 flex items-center justify-center">
                                                <Icon name={service.icon} className="text-brand-indigo" size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-base text-gray-800 mb-1">{service.title}</h3>
                                                <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                                                <button className="mt-1 w-full bg-brand-indigo/10 text-brand-indigo py-1.5 text-xs rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                                    Schedule Now
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <h3 className="text-xl font-bold text-center text-gray-900 mt-12 mb-8">Professional Services</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                {[
                                    { title: "Legal Consultation", icon: "Scale", description: "Expert legal advice and documentation" },
                                    { title: "CA Services", icon: "Calculator", description: "Tax & financial consultation" },
                                    { title: "Web Development", icon: "Code", description: "Custom website solutions" },
                                    { title: "Digital Marketing", icon: "Megaphone", description: "Grow your online presence" }
                                ].map((service, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                                        onClick={() => navigate('/services')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-10 h-10 flex items-center justify-center">
                                                <Icon name={service.icon} className="text-brand-indigo" size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-base text-gray-800 mb-1">{service.title}</h3>
                                                <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                                                <button className="mt-1 w-full bg-brand-indigo/10 text-brand-indigo py-1.5 text-xs rounded-lg hover:bg-brand-indigo hover:text-white transition-all duration-300">
                                                    Book Consultation
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Featured Listings Section - Optimized for mobile */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="py-10 md:py-16 bg-background-faint"
                >
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Featured Listings</h2>
                            <button onClick={() => navigate('/products')} className="text-brand-indigo text-sm font-medium flex items-center">
                                View All <Icon name="ChevronRight" size={16} className="ml-1" />
                            </button>
                        </div>
                        
                        {/* Horizontal scrollable container for mobile, grid for desktop */}
                        <div className="flex overflow-x-auto pb-4 md:pb-0 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 max-w-6xl mx-auto">
                            {featuredListings.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex-shrink-0 w-56 mx-2 first:ml-0 last:mr-0 md:w-auto md:mx-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                                    onClick={() => navigate('/product-details', { state: { productId: item.id } })}
                                    aria-label={`View details for ${item.title}`}
                                    tabIndex={0}
                                    role="button"
                                    onKeyPress={e => { if (e.key === 'Enter') navigate('/product-details', { state: { productId: item.id } }); }}
                                >
                                    <div className="font-bold text-base text-brand-indigo mb-1 line-clamp-1">{item.title}</div>
                                    <div className="text-xs text-gray-500 mb-2 flex items-center">
                                        <Icon name="MapPin" size={12} className="mr-1 text-gray-400" /> 
                                        <span className="line-clamp-1">{item.location}</span>
                                    </div>
                                    <div className="text-brand-purple font-semibold text-sm">₹{item.price}/day</div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* CTA Button */}
                        <div className="text-center mt-8 md:mt-12">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                onClick={() => navigate('/products')}
                                className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-2.5 rounded-full font-medium shadow-button text-sm md:text-base"
                            >
                                Explore All Products
                            </motion.button>
                        </div>
                    </div>
                </motion.section>
            </main>
        </>
    );
};

export default HomePage;
