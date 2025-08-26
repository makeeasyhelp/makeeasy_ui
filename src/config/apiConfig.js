const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment
  ? 'http://localhost:8080'  // Development API URL
  : 'https://makeeasy-backend.vercel.app';  // Production API URL

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Categories
  CATEGORIES: '/api/categories',
  
  // Services
  SERVICES: '/api/services',
  
  // Products
  PRODUCTS: '/api/products',
  
  // Bookings
  BOOKINGS: '/api/bookings',
  
  // Users
  USERS: '/api/users'
};

export default {
  API_BASE_URL,
  API_ENDPOINTS
};