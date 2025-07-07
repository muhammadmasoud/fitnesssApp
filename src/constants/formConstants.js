/**
 * Form validation functions
 */
export const FORM_VALIDATION = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
  isValidPassword: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },
  
  // Required field validation
  isRequired: (value) => {
    return value !== undefined && value !== null && value.toString().trim() !== '';
  },
  
  // Minimum length validation
  minLength: (value, length) => {
    return value && value.length >= length;
  },
  
  // Maximum length validation
  maxLength: (value, length) => {
    return value && value.length <= length;
  },
  
  // Numeric validation
  isNumeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  // Match validation (e.g., for password confirmation)
  matches: (value, matchValue) => {
    return value === matchValue;
  }
};
