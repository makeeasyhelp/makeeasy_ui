import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, MapPin, Save, X } from 'lucide-react';
import { locationsAPI } from '../../services/api';

const AdminLocationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        district: '',
        state: '',
        icon: '🏙️',
        isActive: true,
        displayOrder: 0,
        isNew: false
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await locationsAPI.getAllLocations();
            if (response.success) {
                setLocations(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch locations');
            console.error('Error fetching locations:', err);
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

    const openModal = (location = null) => {
        if (location) {
            setEditingLocation(location);
            setFormData({
                city: location.city,
                district: location.district,
                state: location.state,
                icon: location.icon || '🏙️',
                isActive: location.isActive,
                displayOrder: location.displayOrder,
                isNew: location.isNew || false
            });
        } else {
            setEditingLocation(null);
            setFormData({
                city: '',
                district: '',
                state: '',
                icon: '🏙️',
                isActive: true,
                displayOrder: locations.length,
                isNew: false
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
        setFormData({
            city: '',
            district: '',
            state: '',
            icon: '🏙️',
            isActive: true,
            displayOrder: 0,
            isNew: false
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingLocation) {
                await locationsAPI.updateLocation(editingLocation._id, formData);
                setSuccess('Location updated successfully!');
            } else {
                await locationsAPI.createLocation(formData);
                setSuccess('Location created successfully!');
            }
            await fetchLocations();
            closeModal();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save location');
            console.error('Error saving location:', err);
        }
    };

    const handleToggleStatus = async (locationId, currentStatus) => {
        try {
            await locationsAPI.toggleLocationStatus(locationId);
            await fetchLocations();
            setSuccess(`Location ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to toggle location status');
            console.error('Error toggling location:', err);
        }
    };

    const handleDelete = async (locationId) => {
        try {
            await locationsAPI.deleteLocation(locationId);
            await fetchLocations();
            setDeleteConfirm(null);
            setSuccess('Location deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete location');
            console.error('Error deleting location:', err);
        }
    };

    const cityIcons = ['🏙️', '🌆', '🏛️', '🕌', '🏰', '🗼', '🌃', '🏢', '🏬', '🏭'];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <MapPin className="text-brand-indigo" size={32} />
                        Manage Locations
                    </h1>
                    <p className="text-gray-600">Add, edit, or remove cities and locations</p>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                {error && !isModalOpen && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                {/* Add Location Button */}
                <button
                    onClick={() => openModal()}
                    className="mb-6 flex items-center gap-2 px-4 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-purple transition-colors"
                >
                    <Plus size={20} />
                    Add New Location
                </button>

                {/* Locations List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-indigo"></div>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
                        <p className="text-gray-500 text-lg">No locations found</p>
                        <p className="text-gray-400 text-sm mt-2">Click "Add New Location" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((location) => (
                            <motion.div
                                key={location._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 relative"
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    {location.isActive ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                {/* New Badge */}
                                {location.isNew && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                                            NEW
                                        </span>
                                    </div>
                                )}

                                {/* Location Icon */}
                                <div className="text-5xl mb-4 mt-8">
                                    {location.icon || '🏙️'}
                                </div>

                                {/* Location Info */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {location.city}
                                </h3>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">District:</span> {location.district}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <span className="font-medium">State:</span> {location.state}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Order: {location.displayOrder}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(location)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(location._id, location.isActive)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                            location.isActive
                                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                    >
                                        {location.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                        {location.isActive ? 'Hide' : 'Show'}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(location._id)}
                                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Delete Confirmation */}
                                <AnimatePresence>
                                    {deleteConfirm === location._id && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center p-4"
                                        >
                                            <div className="text-center">
                                                <p className="text-gray-900 font-medium mb-4">
                                                    Delete this location?
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDelete(location._id)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeModal}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editingLocation ? 'Edit Location' : 'Add New Location'}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={24} className="text-gray-600" />
                                    </button>
                                </div>

                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* City Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-transparent"
                                            placeholder="e.g., Mumbai, Delhi, Bangalore"
                                        />
                                    </div>

                                    {/* District */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District *
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-transparent"
                                            placeholder="e.g., Mumbai, New Delhi, Bangalore Urban"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-transparent"
                                            placeholder="e.g., Maharashtra, Delhi, Karnataka"
                                        />
                                    </div>

                                    {/* Icon Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City Icon
                                        </label>
                                        <div className="grid grid-cols-5 gap-2 mb-2">
                                            {cityIcons.map((icon) => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                                    className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                                                        formData.icon === icon
                                                            ? 'border-brand-indigo bg-indigo-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            name="icon"
                                            value={formData.icon}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-transparent"
                                            placeholder="Or enter custom emoji"
                                        />
                                    </div>

                                    {/* Display Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            name="displayOrder"
                                            value={formData.displayOrder}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-transparent"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Lower numbers appear first
                                        </p>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-brand-indigo rounded focus:ring-brand-indigo"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Active (visible to users)
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                name="isNew"
                                                checked={formData.isNew}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-brand-indigo rounded focus:ring-brand-indigo"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Mark as New (shows "NEW" badge)
                                            </span>
                                        </label>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-purple transition-colors font-medium"
                                        >
                                            <Save size={20} />
                                            {editingLocation ? 'Update Location' : 'Create Location'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminLocationsPage;
