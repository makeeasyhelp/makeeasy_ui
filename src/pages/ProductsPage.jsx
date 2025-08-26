import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { productsAPI } from '../services/api';

const ProductCardSkeleton = () => (
    <div className="bg-white p-4 rounded-xl shadow-card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
);

const ProductsPage = ({ onNavigate }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const [locationFilter, setLocationFilter] = useState('');
    const [error, setError] = useState('');

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
                setError('Failed to fetch products');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        let result = [...products];

        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter(item => item.category === categoryFilter);
        }

        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(item => 
                item.title?.toLowerCase().includes(search) ||
                item.description?.toLowerCase().includes(search)
            );
        }

        // Apply location filter
        if (locationFilter) {
            const location = locationFilter.toLowerCase();
            result = result.filter(item => 
                item.location?.toLowerCase().includes(location)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'featured':
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex-1 w-full md:w-auto mb-4 md:mb-0 md:mr-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                    >
                        <Filter size={20} />
                        Filters
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="mb-6 p-4 border rounded-lg bg-white">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="Filter by location..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No products found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="bg-white p-4 rounded-xl shadow-card">
                            <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-brand-indigo">₹{product.price}</span>
                                <span className="text-sm text-gray-500">{product.location}</span>
                            </div>
                            {product.featured && (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                                    Featured
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
