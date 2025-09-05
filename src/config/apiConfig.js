const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment
  ? 'http://localhost:5050'  // Development API URL
  : 'https://makeeasy-backend.vercel.app';  // Production API URL

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  CATEGORIES: '/api/categories',
  SERVICES: '/api/services',
  PRODUCTS: '/api/products',
  BOOKINGS: '/api/bookings',
  USERS: '/api/users',
  ABOUT: '/api/about',
  CONTACT: '/api/contact'
};

export default {
  API_BASE_URL,
  API_ENDPOINTS
};