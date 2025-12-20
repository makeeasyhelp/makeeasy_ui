import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

/**
 * Get authentication headers
 */
const getHeaders = (includeAuth = true) => {
  const headers = {};
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new Error(error.message || 'Request failed');
  }
  return await response.json();
};

/**
 * Service Request API calls
 */
export const serviceRequestAPI = {
  /**
   * Create a new service request
   * @param {FormData} formData - Contains rentalId, type, title, description, priority, and images
   */
  createServiceRequest: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}`, {
        method: 'POST',
        headers: getHeaders(), // Don't set Content-Type for FormData
        body: formData, // FormData automatically sets correct Content-Type with boundary
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get service requests for current user
   * @param {Object} filters - { status, type, rentalId }
   */
  getServiceRequests: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single service request by ID
   * @param {String} requestId
   */
  getServiceRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update service request (before assignment)
   * @param {String} requestId
   * @param {FormData} formData - Updated data (can include new images)
   */
  updateServiceRequest: async (requestId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: formData,
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel service request
   * @param {String} requestId
   */
  cancelServiceRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Rate a resolved service request
   * @param {String} requestId
   * @param {Object} ratingData - { rating, feedback }
   */
  rateServiceRequest: async (requestId, ratingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/${requestId}/rate`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // ============= ADMIN ENDPOINTS =============

  /**
   * Get all service requests (Admin only)
   * @param {Object} filters - { status, type, priority, assignedTo, userId }
   */
  getAllServiceRequests: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/all${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get service request statistics (Admin only)
   */
  getServiceRequestStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/stats`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Assign service request to engineer (Admin only)
   * @param {String} requestId
   * @param {String} engineerId - User ID of the service engineer
   */
  assignServiceRequest: async (requestId, engineerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/${requestId}/assign`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ engineerId }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Schedule a visit for service request (Admin only)
   * @param {String} requestId
   * @param {Object} visitInfo - { date, timeSlot }
   */
  scheduleVisit: async (requestId, visitInfo) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/${requestId}/schedule`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitInfo),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark service request as in progress (Admin only)
   * @param {String} requestId
   */
  markInProgress: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/${requestId}/in-progress`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resolve service request (Admin only)
   * @param {String} requestId
   * @param {String} resolution - Resolution description
   */
  resolveServiceRequest: async (requestId, resolution) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/${requestId}/resolve`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolution }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Close service request (Admin only)
   * @param {String} requestId
   */
  closeServiceRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/${requestId}/close`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get service engineers list (Admin only)
   * Used for assigning service requests
   */
  getServiceEngineers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_REQUESTS}/admin/engineers`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

export default serviceRequestAPI;
