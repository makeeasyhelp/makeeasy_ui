import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { serviceRequestAPI } from '../services/serviceRequestAPI';
import { rentalAPI } from '../services/rentalAPI';

/**
 * Service Request Form Component
 * Create service requests for rentals
 */
const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rentalIdParam = searchParams.get('rentalId');

  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    rentalId: rentalIdParam || '',
    type: 'maintenance',
    title: '',
    description: '',
    priority: 'medium'
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const requestTypes = [
    { value: 'maintenance', label: 'Maintenance', description: 'Regular maintenance or check-up' },
    { value: 'repair', label: 'Repair', description: 'Something is broken or not working' },
    { value: 'relocation', label: 'Relocation', description: 'Move product to different address' },
    { value: 'swap', label: 'Product Swap', description: 'Exchange for different product' },
    { value: 'complaint', label: 'Complaint', description: 'Issue with product or service' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', description: 'Not urgent', color: 'gray' },
    { value: 'medium', label: 'Medium', description: 'Normal priority', color: 'blue' },
    { value: 'high', label: 'High', description: 'Important', color: 'orange' },
    { value: 'urgent', label: 'Urgent', description: 'Requires immediate attention', color: 'red' }
  ];

  useEffect(() => {
    fetchActiveRentals();
  }, []);

  const fetchActiveRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalAPI.getRentals({ status: 'active' });
      
      if (response.success) {
        setActiveRentals(response.data);
        
        // If rentalId param exists and is valid, set it
        if (rentalIdParam && response.data.some(r => r._id === rentalIdParam)) {
          setFormData(prev => ({ ...prev, rentalId: rentalIdParam }));
        }
      }
    } catch (err) {
      console.error('Error fetching rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files exceeds the limit
    if (images.length + files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }

    // Validate each file
    const validFiles = [];
    const validPreviews = [];

    files.forEach(file => {
      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result);
        if (validPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...validPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rentalId) newErrors.rentalId = 'Please select a rental';
    if (!formData.type) newErrors.type = 'Please select request type';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.priority) newErrors.priority = 'Please select priority';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('rentalId', formData.rentalId);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priority', formData.priority);

      // Append images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await serviceRequestAPI.createServiceRequest(formDataToSend);

      if (response.success) {
        alert('Service request created successfully!');
        navigate('/user/rentals?tab=service');
      }
    } catch (err) {
      alert(err.message || 'Failed to create service request');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (activeRentals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Rentals</h2>
            <p className="text-gray-600 mb-6">
              You need an active rental to create a service request
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Service Request</h1>
          <p className="text-gray-600 mb-8">
            Need help with your rental? Submit a service request and our team will assist you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Rental */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Rental *
              </label>
              <select
                name="rentalId"
                value={formData.rentalId}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.rentalId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a rental</option>
                {activeRentals.map(rental => (
                  <option key={rental._id} value={rental._id}>
                    {rental.product?.name} - {rental.city} (Started: {new Date(rental.startDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
              {errors.rentalId && (
                <p className="text-red-500 text-xs mt-1">{errors.rentalId}</p>
              )}
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Request Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requestTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.type === type.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title * (Short description)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., AC not cooling properly"
                maxLength={100}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">{formData.title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about the issue..."
                rows={5}
                maxLength={500}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">{formData.description.length}/500</p>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorityLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: level.value }))}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.priority === level.value
                        ? `border-${level.color}-600 bg-${level.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{level.label}</h4>
                    <p className="text-xs text-gray-600">{level.description}</p>
                  </button>
                ))}
              </div>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (Optional, max 5)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Add photos to help us understand the issue better
              </p>

              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors mb-4">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPEG, PNG - Max 5MB each ({images.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                What happens next?
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Our team will review your request within 24 hours</li>
                <li>• You'll receive updates via email and notifications</li>
                <li>• A service engineer may be assigned based on the issue</li>
                <li>• You can track the status in your dashboard</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
