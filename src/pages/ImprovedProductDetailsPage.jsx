import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/ui/Icon';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext) || {};
  const { state } = useContext(AppContext) || {};
  const user = state?.user || auth?.user;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    notes: ''
  });

  // Validation states
  const [formErrors, setFormErrors] = useState({});
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await api.products.getProductById(productId);
        if (data.success) {
          setProduct(data.data);
          // Also fetch related products
          fetchRelatedProducts(data.data.category);
        } else {
          setError('Failed to load product details');
        }
      } catch (err) {
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    // Update booking form when user data changes
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: user.phone || prev.customerPhone
      }));
    }
  }, [user]);

  const fetchRelatedProducts = async (category) => {
    try {
      const data = await api.products.getProducts({ category, limit: 4 });
      if (data.success) {
        // Filter out the current product
        const related = data.data.filter(item => item._id !== productId);
        setRelatedProducts(related.slice(0, 3)); // Show at most 3 related products
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const startDate = new Date(bookingForm.startDate);
    const endDate = new Date(bookingForm.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!bookingForm.startDate) {
      errors.startDate = 'Start date is required';
    } else if (startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }

    if (!bookingForm.endDate) {
      errors.endDate = 'End date is required';
    } else if (endDate < startDate) {
      errors.endDate = 'End date must be after start date';
    }

    if (!bookingForm.customerName) {
      errors.customerName = 'Name is required';
    }

    if (!bookingForm.customerEmail) {
      errors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingForm.customerEmail)) {
      errors.customerEmail = 'Email is invalid';
    }

    if (!bookingForm.customerPhone) {
      errors.customerPhone = 'Phone number is required';
    }

    return errors;
  };

  const calculateTotalDays = () => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 0;
    
    const startDate = new Date(bookingForm.startDate);
    const endDate = new Date(bookingForm.endDate);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotalAmount = () => {
    const days = calculateTotalDays();
    return days * (product?.price || 0);
  };

  const handleBookNow = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { state: { redirectTo: `/products/${productId}` } });
      return;
    }
    
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Calculate total amount
    const totalAmount = calculateTotalAmount();
    
    setBookingStatus({ loading: true, success: false, error: '' });
    
    try {
      const response = await api.bookings.createBooking({
        product: productId,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        totalAmount,
        customerName: bookingForm.customerName,
        customerEmail: bookingForm.customerEmail,
        customerPhone: bookingForm.customerPhone,
        notes: bookingForm.notes
      });
      
      if (response.success) {
        setBookingStatus({ 
          loading: false, 
          success: true, 
          error: '',
          bookingId: response.data._id 
        });
        
        // Reset form
        setBookingForm({
          startDate: '',
          endDate: '',
          customerName: user?.name || '',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '',
          notes: ''
        });
      } else {
        setBookingStatus({ 
          loading: false, 
          success: false, 
          error: response.message || 'Failed to create booking' 
        });
      }
    } catch (error) {
      setBookingStatus({ 
        loading: false, 
        success: false, 
        error: error.message || 'An error occurred while creating your booking' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-faint flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-faint flex flex-col justify-center items-center px-4 text-center">
        <Icon name="alert-triangle" size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || "We couldn't find the product you're looking for"}</p>
        <button 
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-indigoDark transition-colors"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  // Get product images or use placeholders
  const productImages = product.imageUrl 
    ? [product.imageUrl] 
    : product.images || ['https://via.placeholder.com/600x400?text=No+Image'];

  return (
    <div className="min-h-screen bg-background-faint">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-gray-500 hover:text-brand-indigo">Home</a></li>
            <li><span className="text-gray-400 mx-1">/</span></li>
            <li><a href="/products" className="text-gray-500 hover:text-brand-indigo">Products</a></li>
            <li><span className="text-gray-400 mx-1">/</span></li>
            <li className="text-brand-indigo font-medium truncate">{product.title}</li>
          </ol>
        </nav>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Product Image Gallery */}
            <div className="lg:col-span-2 p-6">
              <div className="relative rounded-xl overflow-hidden mb-4 aspect-w-16 aspect-h-10">
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={product.title} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {productImages.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-brand-indigo' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:border-l border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-brand-indigo mr-4">
                      <Icon name="map-pin" size={16} className="mr-1" />
                      <span className="text-gray-600">{product.location}</span>
                    </div>
                    <div className="flex items-center text-brand-indigo">
                      <Icon name="tag" size={16} className="mr-1" />
                      <span className="text-gray-600">{product.category}</span>
                    </div>
                  </div>
                </div>
                {product.available ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Unavailable
                  </span>
                )}
              </div>

              <div className="mt-4 mb-6">
                <p className="text-3xl font-bold text-brand-purple">₹{product.price}<span className="text-base font-normal text-gray-600">/day</span></p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{product.description || 'No description available for this product.'}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <Icon name="check-circle" size={16} className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <button 
                  onClick={handleBookNow}
                  disabled={!product.available}
                  className={`w-full px-6 py-3 rounded-lg font-medium text-white shadow-lg ${
                    product.available 
                      ? 'bg-gradient-to-r from-brand-indigo to-brand-purple hover:shadow-xl transform hover:-translate-y-1 transition-all' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.available ? 'Rent Now' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        {showBookingForm && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rent This Product</h2>
            
            {bookingStatus.success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Icon name="check" size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Successful!</h3>
                <p className="text-gray-600 mb-6">Your booking has been confirmed. You can view the details in your profile.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => navigate('/profile')}
                    className="px-6 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-indigoDark transition-colors"
                  >
                    View My Bookings
                  </button>
                  <button 
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingStatus({ loading: false, success: false, error: '' });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking}>
                {bookingStatus.error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                    {bookingStatus.error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={bookingForm.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]} // Today's date as min
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      required
                    />
                    {formErrors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={bookingForm.endDate}
                      onChange={handleInputChange}
                      min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      required
                    />
                    {formErrors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={bookingForm.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      required
                    />
                    {formErrors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customerName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={bookingForm.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      required
                    />
                    {formErrors.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customerEmail}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={bookingForm.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                      required
                    />
                    {formErrors.customerPhone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={bookingForm.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo"
                    ></textarea>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product</span>
                      <span className="font-medium">{product.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Rate</span>
                      <span className="font-medium">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Period</span>
                      <span className="font-medium">{calculateTotalDays()} days</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-brand-purple">₹{calculateTotalAmount()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        GST included. Payment will be processed on confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingStatus.loading}
                    className={`px-6 py-3 bg-brand-indigo text-white rounded-lg hover:bg-brand-indigoDark transition-colors ${
                      bookingStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {bookingStatus.loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(item => (
                <div 
                  key={item._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                  onClick={() => navigate(`/products/${item._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={item.imageUrl || 'https://via.placeholder.com/400x225?text=Product+Image'} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Icon name="map-pin" size={14} className="mr-1" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-brand-purple">₹{item.price}/day</span>
                      <button className="px-3 py-1 text-xs text-brand-indigo border border-brand-indigo rounded-full hover:bg-brand-indigo hover:text-white transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
