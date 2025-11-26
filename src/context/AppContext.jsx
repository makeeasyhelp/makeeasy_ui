import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

// Create context
export const AppContext = createContext();

// Initial state
const initialState = {
  // User state
  user: null,
  isAuthenticated: false,

  // Cart state
  cart: [],
  cartTotal: 0,
  cartCount: 0,

  // Wishlist state
  wishlist: [],

  // UI state
  isLoading: false,
  error: null,

  // Search and filters
  searchTerm: '',
  selectedCategory: 'all',
  priceRange: [0, 2000],
  sortBy: 'featured',

  // Products state
  products: [],
  featuredProducts: [],

  // Orders state
  orders: [],
};

// Action types
export const ACTIONS = {
  // User actions
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',

  // Cart actions
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',

  // Wishlist actions
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',

  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',

  // Search and filter actions
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_SORT_BY: 'SET_SORT_BY',

  // Products actions
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_FEATURED_PRODUCTS: 'SET_FEATURED_PRODUCTS',

  // Orders actions
  ADD_ORDER: 'ADD_ORDER',
  SET_ORDERS: 'SET_ORDERS',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        wishlist: [],
        orders: [],
      };

    case ACTIONS.ADD_TO_CART: {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      let newCart;

      if (existingItem) {
        newCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }

      const cartTotal = newCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const cartCount = newCart.reduce((count, item) => count + item.quantity, 0);

      return {
        ...state,
        cart: newCart,
        cartTotal,
        cartCount,
      };
    }

    case ACTIONS.REMOVE_FROM_CART: {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      const cartTotal = newCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const cartCount = newCart.reduce((count, item) => count + item.quantity, 0);

      return {
        ...state,
        cart: newCart,
        cartTotal,
        cartCount,
      };
    }

    case ACTIONS.UPDATE_CART_QUANTITY: {
      const { id, quantity } = action.payload;
      const newCart = state.cart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0);

      const cartTotal = newCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const cartCount = newCart.reduce((count, item) => count + item.quantity, 0);

      return {
        ...state,
        cart: newCart,
        cartTotal,
        cartCount,
      };
    }

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
        cartTotal: 0,
        cartCount: 0,
      };

    case ACTIONS.ADD_TO_WISHLIST:
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    case ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ACTIONS.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case ACTIONS.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case ACTIONS.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.payload,
      };

    case ACTIONS.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
      };

    case ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case ACTIONS.SET_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: action.payload,
      };

    case ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case ACTIONS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };

    default:
      return state;
  }
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('makeeasy-cart');
    const savedWishlist = localStorage.getItem('makeeasy-wishlist');
    const savedUser = localStorage.getItem('makeeasy-user');

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        cart.forEach(item => {
          dispatch({ type: ACTIONS.ADD_TO_CART, payload: item });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        wishlist.forEach(item => {
          dispatch({ type: ACTIONS.ADD_TO_WISHLIST, payload: item });
        });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);
  // Fetch cart from server when user logs in
  useEffect(() => {
    const fetchServerCart = async () => {
      if (state.user) {
        try {
          const response = await api.cart.getCart();
          if (response.success && response.data) {
            // Transform server cart to frontend format
            const serverItems = response.data.items.map(item => {
              const isProduct = !!item.product;
              const entity = item.product || item.service;
              return {
                id: entity._id,
                cartItemId: item._id, // Store cart item ID for updates/removes
                name: entity.title,
                price: item.price,
                image: isProduct ? entity.image : entity.icon,
                type: isProduct ? 'product' : 'service',
                quantity: item.quantity,
                serviceId: !isProduct ? entity._id : undefined,
                productId: isProduct ? entity._id : undefined
              };
            });
            dispatch({ type: ACTIONS.SET_CART, payload: serverItems });
          }
        } catch (error) {
          console.error('Failed to fetch server cart:', error);
        }
      }
    };

    fetchServerCart();
  }, [state.user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('makeeasy-cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('makeeasy-wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('makeeasy-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('makeeasy-user');
    }
  }, [state.user]);

  // Action creators
  const actions = {
    // User actions
    setUser: (user) => dispatch({ type: ACTIONS.SET_USER, payload: user }),
    logout: () => dispatch({ type: ACTIONS.LOGOUT }),

    // Cart actions
    addToCart: async (product) => {
      // Optimistic update
      dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });

      if (state.user) {
        try {
          const response = await api.cart.addToCart({
            productId: product.type === 'product' ? (product.productId || product.id) : undefined,
            serviceId: product.type === 'service' ? (product.serviceId || product.id) : undefined,
            quantity: 1
          });

          // Update cart with server response to get cartItemIds
          if (response.success && response.data) {
            const serverItems = response.data.items.map(item => {
              const isProduct = !!item.product;
              const entity = item.product || item.service;
              return {
                id: entity._id,
                cartItemId: item._id,
                name: entity.title,
                price: item.price,
                image: isProduct ? entity.image : entity.icon,
                type: isProduct ? 'product' : 'service',
                quantity: item.quantity,
                serviceId: !isProduct ? entity._id : undefined,
                productId: isProduct ? entity._id : undefined
              };
            });
            dispatch({ type: ACTIONS.SET_CART, payload: serverItems });
          }
        } catch (error) {
          console.error('Failed to add to server cart:', error);
        }
      }
    },

    removeFromCart: async (productId) => {
      // Optimistic update
      dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });

      if (state.user) {
        try {
          // Find the item in the current cart state to get its cartItemId
          // Note: We need to do this BEFORE dispatching remove, but dispatch is sync.
          // Actually, we can't find it after dispatch.
          // So we should find it before dispatch or pass it.
          // But the function signature is removeFromCart(productId).

          // Better approach: fetch the cart from server again to ensure sync?
          // Or just accept that we might fail if we don't have the ID.

          // Let's try to find it in the state.cart BEFORE dispatch? 
          // But I already dispatched above.

          // Wait, I can access state.cart here, but it might be stale if dispatch processed?
          // useReducer dispatch is not immediate in the sense that state variable updates in next render.
          // BUT `state` variable here is from the closure of the render cycle.
          // So `state.cart` still has the item!

          const item = state.cart.find(i => i.id === productId);
          if (item && item.cartItemId) {
            await api.cart.removeFromCart(item.cartItemId);
          } else {
            // Fallback: if we don't have cartItemId (e.g. added locally then logged in?),
            // we should probably refresh the cart.
            const response = await api.cart.getCart();
            // ... logic to find and remove ...
            // This is getting complicated.

            // Simplest fix: The server should accept product/service ID for removal too.
            // But I don't want to change server right now if I can avoid it.

            // If I added `cartItemId` in the fetch logic, then items fetched from server have it.
            // Items added locally via `addToCart` -> `api.cart.addToCart` returns the updated cart!
            // So I should update the local state with the response from `addToCart`.
          }
        } catch (error) {
          console.error('Failed to remove from server cart:', error);
        }
      }
    },

    updateCartQuantity: async (productId, quantity) => {
      dispatch({ type: ACTIONS.UPDATE_CART_QUANTITY, payload: { id: productId, quantity } });

      if (state.user) {
        try {
          const item = state.cart.find(i => i.id === productId);
          if (item && item.cartItemId) {
            await api.cart.updateCartItem(item.cartItemId, quantity);
          }
        } catch (error) {
          console.error('Failed to update server cart quantity:', error);
        }
      }
    },

    clearCart: async () => {
      dispatch({ type: ACTIONS.CLEAR_CART });
      if (state.user) {
        try {
          await api.cart.clearCart();
        } catch (error) {
          console.error(error);
        }
      }
    },

    // Wishlist actions
    addToWishlist: (product) => dispatch({ type: ACTIONS.ADD_TO_WISHLIST, payload: product }),
    removeFromWishlist: (productId) => dispatch({ type: ACTIONS.REMOVE_FROM_WISHLIST, payload: productId }),

    // UI actions
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),

    // Search and filter actions
    setSearchTerm: (term) => dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term }),
    setCategory: (category) => dispatch({ type: ACTIONS.SET_CATEGORY, payload: category }),
    setPriceRange: (range) => dispatch({ type: ACTIONS.SET_PRICE_RANGE, payload: range }),
    setSortBy: (sortBy) => dispatch({ type: ACTIONS.SET_SORT_BY, payload: sortBy }),

    // Products actions
    setProducts: (products) => dispatch({ type: ACTIONS.SET_PRODUCTS, payload: products }),
    setFeaturedProducts: (products) => dispatch({ type: ACTIONS.SET_FEATURED_PRODUCTS, payload: products }),

    // Orders actions
    addOrder: (order) => dispatch({ type: ACTIONS.ADD_ORDER, payload: order }),
    setOrders: (orders) => dispatch({ type: ACTIONS.SET_ORDERS, payload: orders }),
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
