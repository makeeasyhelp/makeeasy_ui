import React, { useState, useEffect } from "react";
import { Search, Filter, Star, MapPin } from "lucide-react";
import { productsAPI } from "../services/api";

// Skeleton loader (grid style)
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
  </div>
);

const ProductsPage = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [locationFilter, setLocationFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, categoryFilter, searchTerm, locationFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...products];

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search)
      );
    }

    if (locationFilter) {
      const location = locationFilter.toLowerCase();
      result = result.filter((item) =>
        item.location?.toLowerCase().includes(location)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-sm p-3 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-indigo"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="vehicles">Vehicles</option>
            <option value="home-services">Home Services</option>
            <option value="professional">Professional Services</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-indigo"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Extra Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-xl bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-indigo"
          />
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found ⚡</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-transform"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-brand-indigo">
                    ₹{product.price}
                  </span>
                  <span className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {product.location}
                  </span>
                </div>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    <Star size={12} /> Featured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
