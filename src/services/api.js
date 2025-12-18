/**
 * API service to communicate with the backend
 */
import { API_BASE_URL } from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/api`;

/**
 * Configure API auth token and local storage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
  return token;
};

/**
 * Get auth token from local storage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Set auth token in local storage
 */
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

/**
 * Headers for API requests
 */
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API responses and errors
 */
const handleResponse = async (response) => {
  try {
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Clear auth token on unauthorized
        setAuthToken(null);
      }

      // Enhanced error handling with status codes
      const error = new Error(data.error || 'Something went wrong');
      error.status = response.status;
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data
      };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Authentication API calls
 */
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  adminLogin: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  logout: async () => {
    setToken(null);

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  updateUserDetails: async (userData) => {
    const response = await fetch(`${API_URL}/auth/updatedetails`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  },

  updatePassword: async (passwordData) => {
    const response = await fetch(`${API_URL}/auth/updatepassword`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwordData),
    });

    return await handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgotpassword`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email }),
    });

    return await handleResponse(response);
  },

  googleAuth: async (userData) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  uploadProfileImage: async (formData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/upload-profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData, // Don't set Content-Type, let browser set it with boundary
    });

    return await handleResponse(response);
  },
};

/**
 * Products API calls
 */
export const productsAPI = {
  getProducts: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/products${queryString ? `?${queryString}` : ''}`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  getFeaturedProducts: async () => {
    const response = await fetch(`${API_URL}/products/featured`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },
};

/**
 * Categories API calls
 */
export const categoriesAPI = {
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getHeaders(false),
    });

    return await handleResponse(response);
  },

  getCategoryById: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      headers: getHeaders(false),
    });

    return await handleResponse(response);
  },

  createCategory: async (categoryData) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(categoryData),
    });

    return await handleResponse(response);
  },

  updateCategory: async (id, categoryData) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(categoryData),
    });

    return await handleResponse(response);
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },
};

/**
 * Services API calls
 */
export const servicesAPI = {
  getServices: async (params = {}) => {
    // Build query string from params
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    const url = `${API_URL}/services${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: getHeaders(false),
    });

    return await handleResponse(response);
  },

  getServiceById: async (id) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      headers: getHeaders(false),
    });

    return await handleResponse(response);
  },

  getFeaturedServices: async () => {
    const response = await fetch(`${API_URL}/services/featured`, {
      headers: getHeaders(false),
    });

    return await handleResponse(response);
  },

  createService: async (serviceData) => {
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(serviceData),
    });

    return await handleResponse(response);
  },

  updateService: async (id, serviceData) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(serviceData),
    });

    return await handleResponse(response);
  },

  deleteService: async (id) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },
};

/**
 * Bookings API calls
 */
export const bookingsAPI = {
  getBookings: async () => {
    const response = await fetch(`${API_URL}/bookings`, {
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  getBookingById: async (id) => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  createBooking: async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });

    return await handleResponse(response);
  },

  updateBooking: async (id, bookingData) => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });

    return await handleResponse(response);
  },

  deleteBooking: async (id) => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await fetch(`${API_URL}/bookings/${id}/payment`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ paymentStatus }),
    });

    return await handleResponse(response);
  },

  updateBookingStatus: async (id, bookingStatus) => {
    const response = await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ bookingStatus }),
    });

    return await handleResponse(response);
  },
};

/**
 * Orders API calls
 */
export const ordersAPI = {
  getOrders: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  getOrderById: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getHeaders(),
    });

    return await handleResponse(response);
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });

    return await handleResponse(response);
  },

  updateOrder: async (id, orderData) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });

    return await handleResponse(response);
  },
};

/**
 * Cart API calls
 */
export const cartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  addToCart: async (itemData) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(itemData),
    });
    return await handleResponse(response);
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return await handleResponse(response);
  },

  removeFromCart: async (itemId) => {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },
};

/**
 * Users API calls (Admin only)
 */
export const usersAPI = {
  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Create new user
  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },
};

/**
 * Banners API calls
 */
export const bannersAPI = {
  // Get active banners (public)
  getActiveBanners: async () => {
    const response = await fetch(`${API_URL}/banners/active`, {
      headers: getHeaders(false),
    });
    return await handleResponse(response);
  },

  // Get all banners (admin)
  getAllBanners: async () => {
    const response = await fetch(`${API_URL}/banners/all`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Get banner by ID (admin)
  getBannerById: async (id) => {
    const response = await fetch(`${API_URL}/banners/${id}`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Create banner (admin)
  createBanner: async (bannerData) => {
    const response = await fetch(`${API_URL}/banners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bannerData),
    });
    return await handleResponse(response);
  },

  // Update banner (admin)
  updateBanner: async (id, bannerData) => {
    const response = await fetch(`${API_URL}/banners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bannerData),
    });
    return await handleResponse(response);
  },

  // Delete banner (admin)
  deleteBanner: async (id) => {
    const response = await fetch(`${API_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Toggle banner status (admin)
  toggleBannerStatus: async (id) => {
    const response = await fetch(`${API_URL}/banners/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Update banner order (admin)
  updateBannerOrder: async (banners) => {
    const response = await fetch(`${API_URL}/banners/reorder/batch`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ banners }),
    });
    return await handleResponse(response);
  },
};

/**
 * Locations API calls
 */
export const locationsAPI = {
  // Get active locations (public)
  getActiveLocations: async () => {
    const response = await fetch(`${API_URL}/locations/active`, {
      headers: getHeaders(false),
    });
    return await handleResponse(response);
  },

  // Get all locations (admin)
  getAllLocations: async () => {
    const response = await fetch(`${API_URL}/locations/all`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Get states list
  getStates: async () => {
    const response = await fetch(`${API_URL}/locations/states`, {
      headers: getHeaders(false),
    });
    return await handleResponse(response);
  },

  // Get locations by state
  getLocationsByState: async (state) => {
    const response = await fetch(`${API_URL}/locations/state/${state}`, {
      headers: getHeaders(false),
    });
    return await handleResponse(response);
  },

  // Get location by ID (admin)
  getLocationById: async (id) => {
    const response = await fetch(`${API_URL}/locations/${id}`, {
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Create location (admin)
  createLocation: async (locationData) => {
    const response = await fetch(`${API_URL}/locations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(locationData),
    });
    return await handleResponse(response);
  },

  // Update location (admin)
  updateLocation: async (id, locationData) => {
    const response = await fetch(`${API_URL}/locations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(locationData),
    });
    return await handleResponse(response);
  },

  // Delete location (admin)
  deleteLocation: async (id) => {
    const response = await fetch(`${API_URL}/locations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // Toggle location status (admin)
  toggleLocationStatus: async (id) => {
    const response = await fetch(`${API_URL}/locations/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },
};

export default {
  setAuthToken,
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  services: servicesAPI,
  bookings: bookingsAPI,
  orders: ordersAPI,
  cart: cartAPI,
  users: usersAPI,
  banners: bannersAPI,
  locations: locationsAPI,
};
