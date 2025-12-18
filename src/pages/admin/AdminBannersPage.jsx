import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Save, X } from 'lucide-react';
import { bannersAPI } from '../../services/api';
import Icon from '../../components/ui/Icon';

const AdminBannersPage = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        link: '',
        buttonText: 'Learn More',
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setIsLoading(true);
            const response = await bannersAPI.getAllBanners();
            if (response.success) {
                setBanners(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch banners');
            console.error('Error fetching banners:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                subtitle: banner.subtitle || '',
                description: banner.description || '',
                image: banner.image,
                link: banner.link || '',
                buttonText: banner.buttonText || 'Learn More',
                isActive: banner.isActive,
                displayOrder: banner.displayOrder
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                image: '',
                link: '',
                buttonText: 'Learn More',
                isActive: true,
                displayOrder: banners.length
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            link: '',
            buttonText: 'Learn More',
            isActive: true,
            displayOrder: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                await bannersAPI.updateBanner(editingBanner._id, formData);
            } else {
                await bannersAPI.createBanner(formData);
            }
            fetchBanners();
            closeModal();
        } catch (err) {
            setError(err.message || 'Failed to save banner');
            console.error('Error saving banner:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await bannersAPI.deleteBanner(id);
                fetchBanners();
            } catch (err) {
                setError(err.message || 'Failed to delete banner');
                console.error('Error deleting banner:', err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await bannersAPI.toggleBannerStatus(id);
            fetchBanners();
        } catch (err) {
            setError(err.message || 'Failed to toggle banner status');
            console.error('Error toggling status:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-brand-indigo text-xl">Loading banners...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
                    <p className="text-gray-600 mt-2">Manage hero carousel banners</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    Add Banner
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Banners List */}
            <div className="grid gap-4">
                {banners.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No banners found. Create your first banner!</p>
                    </div>
                ) : (
                    banners.map((banner) => (
                        <motion.div
                            key={banner._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Banner Preview */}
                                <div className="md:w-1/3 h-48 md:h-auto relative">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        {banner.isActive ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Banner Details */}
                                <div className="md:w-2/3 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {banner.title}
                                            </h3>
                                            {banner.subtitle && (
                                                <p className="text-lg text-gray-700 mb-2">{banner.subtitle}</p>
                                            )}
                                            {banner.description && (
                                                <p className="text-gray-600">{banner.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <GripVertical size={20} />
                                            <span className="text-sm">Order: {banner.displayOrder}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {banner.link && (
                                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                🔗 {banner.link}
                                            </span>
                                        )}
                                        {banner.buttonText && (
                                            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                🔘 {banner.buttonText}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(banner._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            {banner.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                            {banner.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => openModal(banner)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Edit size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                        placeholder="Welcome to MakeEasy"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                        placeholder="Rent Anything, Book Any Service"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                        placeholder="Your one-stop marketplace for rentals and services"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Link
                                        </label>
                                        <input
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                            placeholder="/products"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Button Text
                                        </label>
                                        <input
                                            type="text"
                                            name="buttonText"
                                            value={formData.buttonText}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                            placeholder="Learn More"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            name="displayOrder"
                                            value={formData.displayOrder}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-brand-indigo border-gray-300 rounded focus:ring-brand-indigo"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Active
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <Save size={20} />
                                        {editingBanner ? 'Update Banner' : 'Create Banner'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminBannersPage;
