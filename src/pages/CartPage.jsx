import React, { useContext, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const { 
    cart, 
    cartTotal, 
    cartCount, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    isLoading,
    setLoading,
    error
  } = useApp();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [user, authLoading, navigate]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart size={30} className="text-brand-indigo" />
            Your Cart {cartCount > 0 && `(${cartCount})`}
          </h1>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            to="/products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-full font-medium shadow-button hover:shadow-button-hover transition-all transform hover:scale-105"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 relative"
                  >
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>

                    <div className="flex-shrink-0 w-full sm:w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.image || `https://placehold.co/300x300/f3f4f6/4f46e5?text=${encodeURIComponent(item.name.charAt(0))}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow pr-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-brand-indigo font-semibold">₹{item.price} / day</p>
                          <p className="text-gray-700 text-sm">Subtotal: ₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-24">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹49.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-brand-indigo">₹{(cartTotal + 49 + cartTotal * 0.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white rounded-lg font-medium shadow-button hover:shadow-button-hover transition-all transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 text-center">
                  <Link 
                    to="/products"
                    className="text-brand-indigo hover:text-brand-purple hover:underline text-sm font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
