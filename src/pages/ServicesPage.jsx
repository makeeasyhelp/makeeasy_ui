import React, { useState, useEffect } from 'react';
import { servicesAPI, productsAPI } from '../services/api';
import Icon from '../components/ui/Icon';
import newLogo from '../assets/newwlogo.png';

const ServicesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [services, setServices] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                // Fetch services using the API service
                const servicesData = await servicesAPI.getServices();
                // Fetch products using the API service
                const listingsData = await productsAPI.getProducts();
                
                setServices(servicesData.data || []);
                setListings(listingsData.data || []);
            } catch (err) {
                setError(err.message || 'Failed to load services or listings');
                console.error('Error fetching data:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleLogoError = (e) => {
        e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
        e.target.onerror = null;
    };

    // Filter services based on search term
    const filteredServices = services.filter(service => 
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter listings based on category and search
    const filteredListings = listings.filter(item => 
        (activeCategory === 'all' || item.category === activeCategory) &&
        (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.location?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleBookNow = (service) => {
        // TODO: Implement booking logic or navigation
        alert(`Book Now for ${service.title}`);
    };
    const handleLearnMore = (service) => {
        // TODO: Implement learn more logic or navigation
        alert(`Learn more about ${service.title}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-faint min-h-screen">
            {/* Hero Banner with Search */}
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple py-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Professional Services</h1>
                    <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
                        Discover top-rated services from verified professionals across multiple categories
                    </p>
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="w-full px-6 py-4 rounded-full shadow-xl border-none focus:ring-2 focus:ring-brand-lightBlue/50"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            aria-label="Search services"
                        />
                        <button className="absolute right-2 top-2 bg-brand-indigo hover:bg-brand-indigoDark text-white p-2 rounded-full transition duration-300">
                            <Icon name="search" size={24} />
                        </button>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-20 text-xl text-brand-indigo">Loading services...</div>
            ) : error ? (
                <div className="text-center py-20 text-xl text-red-500">{error}</div>
            ) : (
                <section className="container mx-auto px-4 py-16 max-w-7xl">
                    <div className="flex flex-col items-center mb-12">
                        <img 
                            src={newLogo} 
                            alt="MakeEasy Logo" 
                            className="h-16 mb-6 hover:scale-105 transition-transform duration-300" 
                            onError={handleLogoError}
                        />
                        <h2 className="text-4xl font-bold mb-4 text-center relative">
                            <span className="text-gradient">Our Services</span>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                        </h2>
                        <p className="text-gray-600 text-center max-w-2xl">
                            We offer a wide range of professional services to meet your needs, all delivered by verified experts
                        </p>
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <button 
                            className={`px-4 py-2 rounded-full transition-all ${activeCategory === 'all' 
                                ? 'bg-brand-indigo text-white shadow-md' 
                                : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                            onClick={() => setActiveCategory('all')}
                            aria-label="Show all services"
                        >
                            All
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-full transition-all ${activeCategory === 'home-services' 
                                ? 'bg-brand-indigo text-white shadow-md' 
                                : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                            onClick={() => setActiveCategory('home-services')}
                            aria-label="Show home services"
                        >
                            Home Services
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-full transition-all ${activeCategory === 'professional' 
                                ? 'bg-brand-indigo text-white shadow-md' 
                                : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                            onClick={() => setActiveCategory('professional')}
                            aria-label="Show professional services"
                        >
                            Professional
                        </button>
                    </div>
                    
                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredServices.length > 0 ? filteredServices.map((service, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center card-hover-effect shine-effect">
                                <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                                    <Icon name={service.icon} className="text-brand-indigo" size={32} />
                                </div>
                                <h3 className="font-bold text-xl mb-3 text-gray-800">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                                <button className="mt-4 px-6 py-2 bg-brand-indigo/10 text-brand-indigo font-medium rounded-full hover:bg-brand-indigo hover:text-white transition-all duration-300"
                                    onClick={() => handleLearnMore(service)}
                                    aria-label={`Learn more about ${service.title}`}
                                >
                                    Learn More
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-xl text-gray-500">No services found matching your search.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Featured Service Listings */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                        <h3 className="text-2xl font-bold mb-8 text-center relative inline-block">
                            <span className="text-gradient">Featured Service Listings</span>
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredListings.length > 0 ? filteredListings.map(item => (
                                <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="mb-3 font-bold text-xl text-brand-indigo">{item.title}</div>
                                    <div className="flex items-center mb-2 text-sm text-gray-600">
                                        <Icon name="location" size={16} className="mr-1 text-brand-pink" />
                                        {item.location}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-brand-purple font-bold text-lg">₹{item.price}</div>
                                        <button className="btn-glow px-4 py-2 bg-brand-indigo text-white rounded-full hover:bg-brand-indigoDark transition-all duration-300"
                                            onClick={() => handleBookNow(item)}
                                            aria-label={`Book now for ${item.title}`}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-xl text-gray-500">No listings found matching your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* CTA Section */}
                    <div className="text-center bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl p-10 shadow-xl">
                        <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust MakeEasy for their service needs
                        </p>
                        <button className="px-8 py-3 bg-white text-brand-indigo font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg">
                            Book a Service Now
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ServicesPage;
