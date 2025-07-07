// Phone number validation patterns for different countries
export const phonePatterns = {
  // North America (US, Canada)
  US: {
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    example: "123-456-7890",
    minLength: 10,
    maxLength: 10
  },
  CA: {
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    example: "123-456-7890",
    minLength: 10,
    maxLength: 10
  },

  // UK
  GB: {
    pattern: /^(0|7|8)\d{9,10}$/,
    example: "07123456789",
    minLength: 10,
    maxLength: 11
  },

  // Australia
  AU: {
    pattern: /^(4|0[2-478])\d{8}$/,
    example: "0412345678",
    minLength: 9,
    maxLength: 10
  },

  // India
  IN: {
    pattern: /^[6-9]\d{9}$/,
    example: "9123456789",
    minLength: 10,
    maxLength: 10
  },

  // China
  CN: {
    pattern: /^1[3-9]\d{9}$/,
    example: "13123456789",
    minLength: 11,
    maxLength: 11
  },

  // Germany
  DE: {
    pattern: /^1[5-7]\d{8,9}$/,
    example: "1512345678",
    minLength: 10,
    maxLength: 11
  },

  // France
  FR: {
    pattern: /^[67]\d{8}$/,
    example: "612345678",
    minLength: 9,
    maxLength: 9
  },

  // Egypt
  EG: {
    pattern: /^1[0125]\d{8}$/,
    example: "1012345678",
    minLength: 10,
    maxLength: 10
  },

  // Default pattern for other countries
  default: {
    pattern: /^\d{6,15}$/,
    example: "Phone number",
    minLength: 6,
    maxLength: 15
  }
};

/**
 * Validates a phone number based on the country code
 * @param {string} phoneNumber - The phone number to validate (without country code)
 * @param {string} countryCode - The country code (e.g., 'US', 'GB')
 * @returns {boolean} - Whether the phone number is valid for the given country
 */
export const validatePhoneForCountry = (phoneNumber, countryCode) => {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Get the validation pattern for the country or use default
  const validationData = phonePatterns[countryCode] || phonePatterns.default;

  // Check if the length is within the allowed range
  if (digitsOnly.length < validationData.minLength ||
      digitsOnly.length > validationData.maxLength) {
    return false;
  }

  // For countries with specific patterns, check against the pattern
  if (validationData.pattern) {
    return validationData.pattern.test(digitsOnly);
  }

  // For countries without specific patterns, just check the length
  return true;
};

/**
 * Gets the example phone number format for a country
 * @param {string} countryCode - The country code (e.g., 'US', 'GB')
 * @returns {string} - An example phone number format
 */
export const getPhoneExample = (countryCode) => {
  const validationData = phonePatterns[countryCode] || phonePatterns.default;
  return validationData.example;
};

/**
 * Gets the expected length range for a phone number in a specific country
 * @param {string} countryCode - The country code (e.g., 'US', 'GB')
 * @returns {string} - The expected length range as a string
 */
export const getPhoneLengthInfo = (countryCode) => {
  const validationData = phonePatterns[countryCode] || phonePatterns.default;

  if (validationData.minLength === validationData.maxLength) {
    return `${validationData.minLength} digits`;
  }

  return `${validationData.minLength}-${validationData.maxLength} digits`;
};
