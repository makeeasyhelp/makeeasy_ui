import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

/**
 * Get authentication headers
 */
const getHeaders = (includeAuth = true, isJson = true) => {
  const headers = {};
  
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  
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
 * Rental API calls
 */
export const rentalAPI = {
  /**
   * Create a new rental
   * @param {Object} rentalData - { productId, city, tenureMonths, addOns[] }
   */
  createRental: async (rentalData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(rentalData),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's rentals with optional filters
   * @param {Object} filters - { status, city, productId }
   */
  getRentals: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.RENTALS}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single rental by ID
   * @param {String} rentalId
   */
  getRental: async (rentalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/${rentalId}`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request rental extension
   * @param {String} rentalId
   * @param {Number} months - Number of months to extend
   */
  requestExtension: async (rentalId, months) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/${rentalId}/extend`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ months }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request early closure of rental
   * @param {String} rentalId
   * @param {String} reason - Reason for closure
   */
  requestEarlyClosure: async (rentalId, reason) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/${rentalId}/close`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Pause rental
   * @param {String} rentalId
   * @param {Date} pauseDate - Date to pause from
   */
  pauseRental: async (rentalId, pauseDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/${rentalId}/pause`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ pauseDate }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resume paused rental
   * @param {String} rentalId
   * @param {Date} resumeDate - Date to resume from
   */
  resumeRental: async (rentalId, resumeDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/${rentalId}/resume`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ resumeDate }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel rental (before delivery)
   * @param {String} rentalId
   */
  cancelRental: async (rentalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/${rentalId}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // ============= ADMIN ENDPOINTS =============

  /**
   * Get all rentals (Admin only)
   * @param {Object} filters - { status, city, userId }
   */
  getAllRentals: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.RENTALS}/admin/all${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update rental status (Admin only)
   * @param {String} rentalId
   * @param {String} status - New status
   */
  updateRentalStatus: async (rentalId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/admin/${rentalId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Schedule delivery (Admin only)
   * @param {String} rentalId
   * @param {Object} deliveryInfo - { date, timeSlot, address }
   */
  scheduleDelivery: async (rentalId, deliveryInfo) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/admin/${rentalId}/schedule-delivery`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(deliveryInfo),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Schedule pickup (Admin only)
   * @param {String} rentalId
   * @param {Object} pickupInfo - { date, timeSlot }
   */
  schedulePickup: async (rentalId, pickupInfo) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/admin/${rentalId}/schedule-pickup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(pickupInfo),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Approve rental extension (Admin only)
   * @param {String} rentalId
   * @param {String} extensionId
   */
  approveExtension: async (rentalId, extensionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/admin/${rentalId}/extension/${extensionId}/approve`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject rental extension (Admin only)
   * @param {String} rentalId
   * @param {String} extensionId
   * @param {String} reason
   */
  rejectExtension: async (rentalId, extensionId, reason) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RENTALS}/admin/${rentalId}/extension/${extensionId}/reject`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

export default rentalAPI;
