import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, Star, Check, MapPin, 
  Package, Shield, Truck, RefreshCw, Heart, Share2,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { productsAPI } from '../services/api';
import { useRentalContext } from '../context/RentalContext';
import { AuthContext } from '../context/AuthContext';

/**
 * Enhanced Product Details Page with Tenure Selection & Reviews
 */
const EnhancedProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Use optional chaining for rental context
  let selectedCity = null;
  let calculateRentalCost = null;
  
  try {
    const rentalContext = useRentalContext();
    selectedCity = rentalContext?.selectedCity;
    calculateRentalCost = rentalContext?.calculateRentalCost;
  } catch (error) {
    console.warn('RentalContext not available, using fallback');
  }

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenure, setSelectedTenure] = useState(6);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProductById(id);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get city pricing
    const cityPricing = product.cityPricing?.find(cp => cp.city === selectedCity?.city);
    if (!cityPricing) {
      alert('Product not available in selected city');
      return;
    }

    // Get tenure pricing
    const tenurePricing = cityPricing.tenures?.find(t => t.months === selectedTenure);
    if (!tenurePricing) {
      alert('Selected tenure not available');
      return;
    }

    // Add to cart
    const cartItem = {
      productId: product._id,
      productName: product.title,
      productImage: product.images?.[0] || product.image,
      city: selectedCity.city,
      tenure: selectedTenure,
      monthlyRent: tenurePricing.monthlyRent,
      deposit: cityPricing.deposit,
      deliveryCharge: cityPricing.deliveryCharge,
      quantity
    };

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('rentalCart') || '[]');
    
    // Check if product already in cart
    const existingIndex = existingCart.findIndex(item => item.productId === product._id);
    
    if (existingIndex !== -1) {
      // Update quantity
      existingCart[existingIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.push(cartItem);
    }

    localStorage.setItem('rentalCart', JSON.stringify(existingCart));
    alert('Added to cart!');
    
    // Ask if user wants to continue or go to cart
    if (confirm('Go to cart?')) {
      navigate('/rental-cart');
    }
  };

  const getCityPricing = () => {
    if (!product || !product.cityPricing || product.cityPricing.length === 0) return null;
    
    // If city is selected, use it
    if (selectedCity) {
      return product.cityPricing?.find(cp => cp.city === selectedCity.city);
    }
    
    // Otherwise, return the first available city pricing as default
    return product.cityPricing[0];
  };

  const getTenurePricing = () => {
    const cityPricing = getCityPricing();
    if (!cityPricing) return null;
    return cityPricing.tenures?.find(t => t.months === selectedTenure);
  };

  const calculateSavings = (tenure) => {
    const cityPricing = getCityPricing();
    if (!cityPricing) return 0;
    
    const baseTenure = cityPricing.tenures?.find(t => t.months === 3);
    const selectedTenurePricing = cityPricing.tenures?.find(t => t.months === tenure);
    
    if (!baseTenure || !selectedTenurePricing) return 0;
    
    const baseCost = baseTenure.monthlyRent * tenure;
    const selectedCost = selectedTenurePricing.monthlyRent * tenure;
    
    return ((baseCost - selectedCost) / baseCost * 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <button onClick={() => navigate('/products')} className="text-purple-600 hover:underline">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const cityPricing = getCityPricing();
  const tenurePricing = getTenurePricing();
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-lg p-4 mb-4 relative">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-96 object-contain"
              />
              
              {/* Wishlist & Share */}
              <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart size={20} className="text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Booking */}
          <div>
            {/* Product Title & Rating */}
            <div className="bg-white rounded-lg p-6 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.averageRating || 4.5}</span>
                </div>
                <span className="text-gray-500">({product.totalReviews || 0} reviews)</span>
              </div>

              {/* Price */}
              {cityPricing && tenurePricing && (
                <div className="border-t pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-purple-600">
                      ₹{tenurePricing.monthlyRent}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  {calculateSavings(selectedTenure) > 0 && (
                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
                      Save {calculateSavings(selectedTenure)}% vs 3 months
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Refundable Deposit:</span>
                      <span className="font-semibold ml-2">₹{cityPricing.deposit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-semibold ml-2">₹{cityPricing.deliveryCharge}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* City Selection Warning */}
            {!selectedCity && cityPricing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <MapPin size={20} />
                  <div>
                    <div className="font-medium">Showing prices for {cityPricing.city}</div>
                    <div className="text-sm">Select your city from header to see accurate pricing</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tenure Selection */}
            {cityPricing && (
              <div className="bg-white rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold mb-4">Select Rental Period</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {cityPricing.tenures?.map((tenure) => (
                    <button
                      key={tenure.months}
                      onClick={() => setSelectedTenure(tenure.months)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTenure === tenure.months
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{tenure.months}</div>
                        <div className="text-xs text-gray-600 mb-2">months</div>
                        <div className="text-lg font-semibold text-purple-600">
                          ₹{tenure.monthlyRent}
                        </div>
                        <div className="text-xs text-gray-500">/month</div>
                        {tenure.discount > 0 && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            {tenure.discount}% OFF
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Total Cost Preview */}
                {tenurePricing && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Monthly Rent × {selectedTenure}</span>
                      <span className="font-semibold">₹{tenurePricing.monthlyRent * selectedTenure}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Deposit (refundable)</span>
                      <span className="font-semibold">₹{cityPricing.deposit}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span className="font-semibold">₹{cityPricing.deliveryCharge}</span>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between">
                      <span className="font-semibold">Total (First Payment)</span>
                      <span className="text-xl font-bold text-purple-600">
                        ₹{cityPricing.deposit + tenurePricing.monthlyRent + cityPricing.deliveryCharge}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            {cityPricing && (
              <div className="bg-white rounded-lg p-6 mb-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className="w-full mt-3 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  Browse More Products
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4">Why Rent?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="text-purple-600" size={20} />
                  <span className="text-sm text-gray-700">Free maintenance & repairs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="text-purple-600" size={20} />
                  <span className="text-sm text-gray-700">Free relocation support</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="text-purple-600" size={20} />
                  <span className="text-sm text-gray-700">Upgrade anytime</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="text-purple-600" size={20} />
                  <span className="text-sm text-gray-700">Refundable deposit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg p-6">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-600">No reviews yet. Be the first to rent and review!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductDetailsPage;
