/**
 * Utility functions for profile validation
 */

/**
 * Check if user profile is complete
 * A complete profile requires: email, phone, and password (or OAuth provider)
 * @param {Object} user - User object from the backend
 * @returns {Boolean} - true if profile is complete, false otherwise
 */
export const isProfileComplete = (user) => {
  if (!user) return false;
  
  // Check if user has email
  const hasEmail = !!user.email;
  
  // Check if user has phone number
  const hasPhone = !!user.phone;
  
  // Check if user has password set (for local auth) or is using OAuth
  const hasAuthMethod = !!user.password || (user.authProvider && user.authProvider !== 'local');
  
  // For OAuth users, we need them to have phone and optionally set a password
  if (user.authProvider === 'google' || user.authProvider === 'facebook') {
    // OAuth users need at least phone number
    return hasEmail && hasPhone;
  }
  
  // For local users, all three are required
  return hasEmail && hasPhone && hasAuthMethod;
};

/**
 * Get missing profile fields
 * @param {Object} user - User object from the backend
 * @returns {Array} - Array of missing field names
 */
export const getMissingProfileFields = (user) => {
  if (!user) return ['email', 'phone', 'password'];
  
  const missingFields = [];
  
  if (!user.email) missingFields.push('email');
  if (!user.phone) missingFields.push('phone');
  
  // For OAuth users, password is optional but phone is required
  if (user.authProvider === 'local' || !user.authProvider) {
    if (!user.password) missingFields.push('password');
  }
  
  return missingFields;
};

/**
 * Get profile completion message
 * @param {Object} user - User object from the backend
 * @returns {String} - Message to display to user
 */
export const getProfileCompletionMessage = (user) => {
  const missingFields = getMissingProfileFields(user);
  
  if (missingFields.length === 0) {
    return 'Your profile is complete!';
  }
  
  const fieldsText = missingFields.map(field => {
    if (field === 'phone') return 'mobile number';
    return field;
  }).join(', ');
  
  return `Please update your profile with: ${fieldsText}`;
};
