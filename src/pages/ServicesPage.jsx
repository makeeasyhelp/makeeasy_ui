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
        const servicesData = await servicesAPI.getServices();
        const listingsData = await productsAPI.getProducts();
        setServices(servicesData.data || []);
        setListings(listingsData.data || []);
      } catch (err) {
        setError(err.message || "Failed to load services or listings");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogoError = (e) => {
    e.target.src = "https://placehold.co/160x60/4f46e5/ffffff?text=MakeEasy";
    e.target.onerror = null;
  };

  const filteredServices = services.filter(
    (service) =>
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredListings = listings.filter(
    (item) =>
      (activeCategory === "all" || item.category === activeCategory) &&
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookNow = (service) => {
    alert(`Book Now for ${service.title}`);
  };

  const handleLearnMore = (service) => {
    alert(`Learn more about ${service.title}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-md text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-faint min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-indigo to-brand-purple py-12 px-4 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4">
            Professional Services
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 px-2">
            Discover top-rated services from verified professionals across multiple categories
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for services..."
              className="w-full px-5 py-3 sm:px-6 sm:py-4 rounded-full shadow-lg border-none text-sm sm:text-base focus:ring-2 focus:ring-brand-lightBlue/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search services"
            />
            <button className="absolute right-2 top-1.5 sm:top-2 bg-brand-indigo hover:bg-brand-indigoDark text-white p-2 sm:p-2.5 rounded-full transition duration-300">
              <Icon name="search" size={20} />
            </button>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-10 sm:py-16 max-w-7xl">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <img
            src={newLogo}
            alt="MakeEasy Logo"
            className="h-12 sm:h-16 mb-4 hover:scale-105 transition-transform duration-300"
            onError={handleLogoError}
          />
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 text-center relative">
            <span className="text-gradient">Our Services</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl text-sm sm:text-base px-2">
            We offer a wide range of professional services to meet your needs, all delivered by verified experts
          </p>
        </div>

        {/* Category Filter - Scrollable on mobile */}
        <div className="flex gap-3 mb-8 sm:mb-10 overflow-x-auto scrollbar-hide px-1 sm:px-0">
          {["all", "home-services", "professional"].map((cat) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-4 py-2 rounded-full transition-all text-sm sm:text-base ${
                activeCategory === cat
                  ? "bg-brand-indigo text-white shadow-md"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveCategory(cat)}
              aria-label={`Show ${cat}`}
            >
              {cat === "all"
                ? "All"
                : cat === "home-services"
                ? "Home Services"
                : "Professional"}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-5 sm:p-6 flex flex-col items-center text-center"
              >
                <div className="bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6">
                  <Icon
                    name={service.icon}
                    className="text-brand-indigo"
                    size={28}
                  />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {service.description}
                </p>
                <button
                  className="mt-4 px-5 py-2 text-sm sm:text-base bg-brand-indigo/10 text-brand-indigo font-medium rounded-full hover:bg-brand-indigo hover:text-white transition-all"
                  onClick={() => handleLearnMore(service)}
                >
                  Learn More
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-base sm:text-xl text-gray-500">
                No services found.
              </p>
            </div>
          )}
        </div>

        {/* Featured Listings */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center relative inline-block">
            <span className="text-gradient">Featured Service Listings</span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition border border-gray-100"
                >
                  <div className="font-bold text-lg sm:text-xl text-brand-indigo mb-2">
                    {item.title}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Icon
                      name="location"
                      size={14}
                      className="mr-1 text-brand-pink"
                    />
                    {item.location}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-brand-purple font-bold text-base sm:text-lg">
                      ₹{item.price}
                    </div>
                    <button
                      className="px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-brand-indigo text-white rounded-full hover:bg-brand-indigoDark transition"
                      onClick={() => handleBookNow(item)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-base sm:text-xl">
                  No listings found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl p-8 sm:p-10 shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-white/90 mb-5 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of satisfied customers who trust MakeEasy for their service needs
          </p>
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-brand-indigo font-bold rounded-full hover:bg-gray-100 transition shadow-md">
            Book a Service Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
