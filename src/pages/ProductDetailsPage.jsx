import React, { useState, useEffect } from 'react';
import { allListingsData } from '../data/appData';
import Icon from '../components/ui/Icon';
import BookNowDrawer from '../components/BookNowDrawer';
import { productsAPI } from '../services/api';

const ProductDetailsPage = ({ productId, onNavigate }) => {
    const [product, setProduct] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        productsAPI.getProductById(productId).then(data => {
            setProduct(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [productId]);

    const handlePay = (product) => {
        setDrawerOpen(false);
        alert('Payment flow would start for: ' + product.title);
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <button onClick={() => onNavigate && onNavigate('Products')} className="mb-6 text-brand-indigo hover:underline">&larr; Back</button>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Placeholder for product image */}
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon name="Image" size={80} className="text-gray-300" />
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2 text-brand-indigo">{product.title}</h1>
                    <div className="text-gray-500 mb-2 flex items-center">
                        <Icon name="MapPin" size={16} className="mr-1 text-gray-400" /> {product.location}
                    </div>
                    <div className="text-brand-purple font-semibold text-xl mb-4">₹{product.price}/day</div>
                    <p className="mb-6 text-gray-700">{product.description || 'No description available.'}</p>
                    <button className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform shadow-button" onClick={() => setDrawerOpen(true)}>Book Now</button>
                </div>
            </div>
            <BookNowDrawer open={drawerOpen} product={product} onClose={() => setDrawerOpen(false)} onPay={handlePay} />
        </div>
    );
};

export default ProductDetailsPage;
