/**
 * API service to communicate with the backend
 */

const API_URL = process.env.VITE_API_URL || 'http://localhost:5050/api';

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
  const data = await response.json();
  
  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401) {
      // Clear auth token on unauthorized
      setAuthToken(null);
    }
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
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

export default {
  setAuthToken,
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  services: servicesAPI,
  bookings: bookingsAPI,
};
