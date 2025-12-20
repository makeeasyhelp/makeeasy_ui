import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../services/api';
import { Upload, X, Loader } from 'lucide-react';

const PROFESSIONAL_SERVICES_DATA = [
    { title: "Legal Consultation", icon: "Scale", description: "Expert legal advice and documentation" },
    { title: "CA Services", icon: "Calculator", description: "Tax & financial consultation" },
    { title: "Web Development", icon: "Code", description: "Custom website solutions" },
    { title: "Digital Marketing", icon: "Megaphone", description: "Grow your online presence" },
    { title: "Business Consulting", icon: "Briefcase", description: "Strategic business guidance" },
    { title: "HR Solutions", icon: "Users", description: "Human resources management" }
];

const AdminProfessionalServicesCRUDPage = () => {
    const [services, setServices] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', icon: '', price: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState('all');

    // Fetch services on component mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getServices();
            // Filter only professional services
            const professionalServices = response.data?.filter(s => 
                PROFESSIONAL_SERVICES_DATA.some(ps => ps.title === s.title)
            ) || [];
            setServices(professionalServices);
        } catch (err) {
            setError(err.message || 'Failed to fetch services');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditing(service._id);
        setForm({
            title: service.title,
            description: service.description,
            icon: service.icon,
            price: service.price,
            image: null
        });
        setImagePreview(service.image || null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this professional service?')) {
            try {
                await servicesAPI.deleteService(id);
                setServices(services.filter(s => s._id !== id));
            } catch (err) {
                setError(err.message || 'Failed to delete service');
                console.error('Error deleting service:', err);
            }
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setForm({ ...form, image: null });
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");

            // Create FormData to handle file uploads
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('icon', form.icon);
            formData.append('price', form.price);
            
            if (form.image instanceof File) {
                formData.append('image', form.image);
            }

            if (editing) {
                const updated = await servicesAPI.updateService(editing, formData);
                setServices(services.map(s => s._id === editing ? updated.data : s));
                setEditing(null);
            } else {
                const created = await servicesAPI.createService(formData);
                setServices([...services, created.data]);
            }
            
            setForm({ title: '', description: '', icon: '', price: '', image: null });
            setImagePreview(null);
        } catch (err) {
            setError(err.message || 'Failed to save service');
            console.error('Error saving service:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-background-faint">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Professional Services Management</h1>
                <p className="text-gray-600">Manage legal, consulting, and professional service offerings</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                    <p>{error}</p>
                    <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                        <X size={20} />
                    </button>
                </div>
            )}
            
            <form className="bg-white p-8 rounded-2xl shadow-lg mb-12" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Add/Edit Professional Service</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Title *</label>
                        <select 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo" 
                            required 
                        >
                            <option value="">Select a professional service</option>
                            {PROFESSIONAL_SERVICES_DATA.map((ps) => (
                                <option key={ps.title} value={ps.title}>{ps.title}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <input 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange} 
                            placeholder="Brief service description" 
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name *</label>
                        <input 
                            name="icon" 
                            value={form.icon} 
                            onChange={handleChange} 
                            placeholder="e.g., Scale, Calculator, Code" 
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                        <input 
                            name="price" 
                            type="number" 
                            value={form.price} 
                            onChange={handleChange} 
                            placeholder="0" 
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo" 
                            required 
                        />
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Service Image</label>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {imagePreview ? (
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Image Selected</p>
                                        <p className="text-xs text-gray-500">Click to change or remove</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer">
                                <Upload className="text-gray-400 mb-2" size={32} />
                                <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                                <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                                <span className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 5MB</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="hidden" 
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        type="submit" 
                        className="flex items-center gap-2 bg-gradient-to-r from-brand-indigo to-brand-purple text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        disabled={submitting}
                    >
                        {submitting && <Loader size={18} className="animate-spin" />}
                        {submitting ? 'Processing...' : (editing ? 'Update Service' : 'Add Service')}
                    </button>
                    
                    {editing && (
                        <button 
                            type="button" 
                            className="px-8 py-3 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
                            onClick={() => {
                                setEditing(null);
                                setForm({ title: '', description: '', icon: '', price: '', image: null });
                                setImagePreview(null);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-brand-indigo"></div>
                </div>
            ) : services.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
                    <p className="text-gray-500 text-lg">No professional services yet. Add your first professional service!</p>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Services ({services.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <div key={service._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Image */}
                                <div className="w-full h-40 bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 overflow-hidden">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                
                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                                    <p className="text-brand-indigo font-semibold text-lg mb-4">₹{service.price}</p>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all font-medium text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfessionalServicesCRUDPage;
