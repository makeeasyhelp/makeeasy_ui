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
 * KYC API calls
 */
export const kycAPI = {
  /**
   * Submit KYC documents
   * @param {FormData} formData - Contains idProofType, idProofNumber, addressProofType, address fields, and files
   */
  submitKYC: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}`, {
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
   * Get KYC status for current user
   */
  getKYCStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}/status`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update KYC documents (for pending or rejected KYC)
   * @param {FormData} formData - Updated KYC data
   */
  updateKYC: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}`, {
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
   * Delete KYC submission (if pending or rejected)
   */
  deleteKYC: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // ============= ADMIN ENDPOINTS =============

  /**
   * Get all KYC submissions (Admin only)
   * @param {Object} filters - { status, userId }
   */
  getAllKYCSubmissions: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.KYC}/admin/all${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get KYC statistics (Admin only)
   */
  getKYCStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}/admin/stats`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single KYC submission by ID (Admin only)
   * @param {String} kycId
   */
  getKYCById: async (kycId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}/admin/${kycId}`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify KYC submission (Admin only)
   * @param {String} kycId
   */
  verifyKYC: async (kycId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}/admin/${kycId}/verify`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject KYC submission (Admin only)
   * @param {String} kycId
   * @param {String} reason - Reason for rejection
   */
  rejectKYC: async (kycId, reason) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}/admin/${kycId}/reject`, {
        method: 'PUT',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark KYC as under review (Admin only)
   * @param {String} kycId
   */
  markUnderReview: async (kycId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.KYC}/admin/${kycId}/review`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

export default kycAPI;
