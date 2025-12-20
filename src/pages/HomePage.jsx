import React, { useState, useEffect, useRef,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { AnimatePresence, motion } from 'framer-motion';
import { productsAPI, categoriesAPI, servicesAPI, bannersAPI } from '../services/api';
import BannerCarousel from '../components/BannerCarousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SearchModal = ({ isVisible, onClose, onSearch, searchInput, setSearchInput, searchCategory, setSearchCategory, searchLocation, setSearchLocation, categories }) => {
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-start p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mt-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Search Products & Services</h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <Icon name="X" size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">What are you looking for?</label>
                                    <input
                                        type="text"
                                        placeholder="Search for products, services..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                        value={searchInput}
                                        onChange={e => setSearchInput(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                            value={searchCategory}
                                            onChange={e => setSearchCategory(e.target.value)}
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat.key} value={cat.key}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input
                                            type="text"
                                            placeholder="Enter location"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                            value={searchLocation}
                                            onChange={e => setSearchLocation(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                {/* Popular Searches */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Popular Searches</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Bed', 'Washing Machine', 'Fridge', 'Air Conditioner', 'Mattress', 'TV', 'IPhone', 'Sofa'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setSearchInput(tag)}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-brand-indigo hover:text-white transition-all"
                                            >
                                                🔥 {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <button
                                    className="w-full bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-3 rounded-lg font-semibold hover:opacity-95 transition-opacity shadow-lg"
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const categoriesScrollRef = useRef(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [featuredListings, setFeaturedListings] = useState([]);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isCategoriesPaused, setIsCategoriesPaused] = useState(false);
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

    const placeholderTexts = [
        "Bed",
        "Washing Machine",
        "Fridge",
        "Air Conditioner",
        "Mattress",
        "TV",
        "iPhone",
        "Sofa"
    ];

    // Scroll functions for categories carousel
 const scroll = useCallback((direction) => {
  if (!categoriesScrollRef.current) return;

  const scrollAmount = 260;
  categoriesScrollRef.current.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
}, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [categoriesRes, servicesRes, productsRes, bannersRes] = await Promise.all([
                    categoriesAPI.getCategories(),
                    servicesAPI.getServices(),
                    productsAPI.getFeaturedProducts(),
                    bannersAPI.getActiveBanners()
                ]);

                if (categoriesRes.success) setCategories(categoriesRes.data);
                if (servicesRes.success) setServices(servicesRes.data);
                if (productsRes.success) setFeaturedListings(productsRes.data);
                if (bannersRes.success) setBanners(bannersRes.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Rotating placeholder effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex((prevIndex) => 
                (prevIndex + 1) % placeholderTexts.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSearch = () => {
        navigate(`/products?search=${searchInput}&category=${searchCategory}&location=${searchLocation}`);
        setIsSearchVisible(false);
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-brand-indigo">Loading...</div>
        </div>;
    }
    

    return (
        <>
            {/* Hero Section with Dynamic Carousel Background */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-white relative overflow-hidden min-h-[600px] md:min-h-[700px]"
            >
                {/* Dynamic Banner Carousel Background */}
                <BannerCarousel banners={banners} />

                {/* Search Bar Overlay on Carousel */}
                <div className="absolute bottom-10 left-0 right-0 z-30 bg-transparent pt-6 pb-8 px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* New Simple Search Section - Blinkit Style with Rotating Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div 
                                onClick={toggleSearch}
                                className="bg-transparent border-2 border-brand-white rounded-full shadow-2xl p-1 flex items-center gap-2 cursor-pointer hover:shadow-3xl transition-shadow overflow-hidden"
                            >
                                <Icon name="Search" size={24} className="text-brand-white ml-2 flex-shrink-0" />
                                <div className="flex-1 relative h-10 flex items-center overflow-hidden">
                                    <span className="text-white-500 mr-2">Search for</span>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentPlaceholderIndex}
                                            className="text-white-500 font-medium"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            {placeholderTexts[currentPlaceholderIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                {/* <button className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-2 rounded-full font-medium text-sm md:text-base flex-shrink-0">
                                    Search
                                </button> */}
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Search Modal */}
                <SearchModal 
                    isVisible={isSearchVisible}
                    onClose={() => setIsSearchVisible(false)}
                    onSearch={handleSearch}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    searchCategory={searchCategory}
                    setSearchCategory={setSearchCategory}
                    searchLocation={searchLocation}
                    setSearchLocation={setSearchLocation}
                    categories={categories}
                />
            </motion.section>

            <main className="w-full">
                             {/* Categories Section - Horizontal Carousel */}
             {/* Categories Section */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="py-8 md:py-16 bg-background-faint"
>
  <div className="container mx-auto px-4">
    
    {/* Header */}
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
        Browse Categories
      </h2>
      <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
        Find exactly what you need from our wide range of options
      </p>
    </div>

    {/* Carousel Wrapper */}
    <div className="relative">

      {/* Left Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 
                   bg-white text-brand-indigo hover:bg-brand-indigo hover:text-white
                   shadow-lg rounded-full p-3 transition"
      >
        <ChevronLeft size={22} />
      </motion.button>

      {/* Scroll Area */}
      <div
        ref={categoriesScrollRef}
        role="list"
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
                   hide-scrollbar px-2 md:px-10 pb-4"
      >
        {categories.slice(0, 12).map((cat) => (
          <motion.div
            key={cat.key}
            role="listitem"
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260 }}
            onClick={() =>
              navigate('/products', { state: { category: cat.key } })
            }
            className="group snap-center flex-shrink-0 w-44 md:w-52
                       bg-white rounded-2xl border border-gray-100
                       shadow-md hover:shadow-xl cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-32 md:h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover
                             group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Icon
                    name={cat.icon}
                    size={36}
                    className="text-brand-indigo"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="p-3 text-center">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">
                {cat.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20
                   bg-white text-brand-indigo hover:bg-brand-indigo hover:text-white
                   shadow-lg rounded-full p-3 transition"
      >
        <ChevronRight size={22} />
      </motion.button>
    </div>
  </div>
</motion.section>

                     {/* Services Section */}
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
                        
                        {/* Popular Services - All in card format */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
                            {services.map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 cursor-pointer overflow-hidden transition-shadow duration-300"
                                    onClick={() => navigate('/services')}
                                >
                                    {/* Service Image */}
                                    <div className="relative w-full h-48 bg-gradient-to-br from-brand-indigo/5 to-brand-purple/5 overflow-hidden group">
                                        {service.image ? (
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icon name={service.icon} className="text-brand-indigo/20" size={48} />
                                            </div>
                                        )}
                                    </div>
                                    {/* Service Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-base text-gray-800 mb-1 line-clamp-1">{service.title}</h3>
                                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                                        <button className="w-full bg-gradient-to-r from-brand-indigo to-brand-purple text-white py-2 text-xs font-medium rounded-lg hover:shadow-md transition-all duration-300">
                                            Book Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Professional Services Section */}
                        {services.length > 0 && (
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 mt-16 tracking-tight">Professional Services</h2>
                                <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-6 md:mb-10">Expert consultants and professionals</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                    {services
                                        .filter(service => 
                                            ['Legal Consultation', 'CA Services', 'Web Development', 'Digital Marketing', 'Business Consulting', 'HR Solutions'].includes(service.title)
                                        )
                                        .map((service, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 cursor-pointer overflow-hidden transition-shadow duration-300"
                                                onClick={() => navigate('/services')}
                                            >
                                                {/* Service Image */}
                                                <div className="relative w-full h-48 bg-gradient-to-br from-brand-indigo/5 to-brand-purple/5 overflow-hidden group">
                                                    {service.image ? (
                                                        <img
                                                            src={service.image}
                                                            alt={service.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Icon name={service.icon} className="text-brand-indigo/30" size={48} />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Service Info */}
                                                <div className="p-4">
                                                    <h3 className="font-bold text-base text-gray-800 mb-1 line-clamp-1">{service.title}</h3>
                                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                                                    <button className="w-full bg-gradient-to-r from-brand-indigo to-brand-purple text-white py-2 text-xs font-medium rounded-lg hover:shadow-md transition-all duration-300">
                                                        Book Consultation
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        )}
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
