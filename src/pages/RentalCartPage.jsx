import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

/**
 * Rental Cart Page
 * Shows cart items, price breakdown, and proceed to checkout
 */
const RentalCartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('rentalCart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem('rentalCart', JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    if (!confirm('Remove this item from cart?')) return;
    
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('rentalCart', JSON.stringify(updatedCart));
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'FIRST10') {
      setDiscount(10);
      alert('Coupon applied! 10% discount');
    } else if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      alert('Coupon applied! 20% discount');
    } else {
      alert('Invalid coupon code');
      setDiscount(0);
    }
  };

  const calculateTotals = () => {
    let totalMonthlyRent = 0;
    let totalDeposit = 0;
    let totalDelivery = 0;

    cartItems.forEach(item => {
      totalMonthlyRent += item.monthlyRent * item.quantity;
      totalDeposit += item.deposit * item.quantity;
      totalDelivery += item.deliveryCharge * item.quantity;
    });

    const subtotal = totalMonthlyRent + totalDeposit + totalDelivery;
    const discountAmount = (subtotal * discount) / 100;
    const gst = ((subtotal - discountAmount) * 0.18);
    const total = subtotal - discountAmount + gst;

    return {
      totalMonthlyRent,
      totalDeposit,
      totalDelivery,
      subtotal,
      discountAmount,
      gst,
      total,
      monthlyPayment: totalMonthlyRent
    };
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Navigate to checkout with cart data
    navigate('/checkout', { state: { cartItems, totals: calculateTotals() } });
  };

  const totals = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Explore our amazing rental products and add items to your cart</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} item(s) in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.productName}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>City: {item.city}</span>
                          <span>Tenure: {item.tenure} months</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{item.monthlyRent}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>

                    {/* Additional Costs */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-semibold ml-2">₹{item.deposit}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-semibold ml-2">₹{item.deliveryCharge}</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/products')}
              className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 flex items-center gap-2"
                  >
                    <Tag size={16} />
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {discount}% discount applied
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-semibold">₹{totals.totalMonthlyRent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deposit (Refundable)</span>
                  <span className="font-semibold">₹{totals.totalDeposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-semibold">₹{totals.totalDelivery.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span className="font-semibold">-₹{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{totals.gst.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Total (First Payment)</span>
                  <span className="font-bold text-2xl text-purple-600">
                    ₹{totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Monthly Payment Info */}
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-700 mb-1">Monthly Payment (from 2nd month)</div>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{totals.monthlyPayment.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Paid automatically on your billing date
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              {/* Info */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Secure checkout • 100% Refundable deposit</p>
                <p className="mt-1">Free maintenance & relocation included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCartPage;
