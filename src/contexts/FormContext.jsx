import { useState, useCallback } from 'react';
import { FormContext } from './FormContextDefinition';

/**
 * Form provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Form provider component
 */
export const FormProvider = ({ children }) => {
  // State for different forms
  const [forms, setForms] = useState({
    contact: {
      name: '',
      email: '',
      message: ''
    },
    login: {
      email: '',
      password: '',
      rememberMe: false
    },
    signup: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    },
    profile: {
      fullName: '',
      email: '',
      bio: '',
      age: '',
      weight: '',
      height: '',
      fitnessGoal: 'weight-loss',
      activityLevel: 'beginner'
    },
    checkout: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      paymentMethod: 'credit-card'
    }
  });

  // State for form validation errors
  const [errors, setErrors] = useState({
    contact: {},
    login: {},
    signup: {},
    profile: {},
    checkout: {}
  });

  // State for form submission status
  const [submitting, setSubmitting] = useState({
    contact: false,
    login: false,
    signup: false,
    profile: false,
    checkout: false
  });

  /**
   * Update a form field
   * @param {string} formName - Name of the form
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const updateFormField = useCallback((formName, field, value) => {
    setForms(prevForms => ({
      ...prevForms,
      [formName]: {
        ...prevForms[formName],
        [field]: value
      }
    }));

    // Clear error for this field if it exists
    if (errors[formName] && errors[formName][field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [formName]: {
          ...prevErrors[formName],
          [field]: null
        }
      }));
    }
  }, [errors]);

  /**
   * Set form data
   * @param {string} formName - Name of the form
   * @param {Object} data - Form data
   */
  const setFormData = useCallback((formName, data) => {
    setForms(prevForms => ({
      ...prevForms,
      [formName]: {
        ...prevForms[formName],
        ...data
      }
    }));
  }, []);

  /**
   * Reset a form
   * @param {string} formName - Name of the form
   */
  const resetForm = useCallback((formName) => {
    setForms(prevForms => ({
      ...prevForms,
      [formName]: { ...forms[formName] }
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [formName]: {}
    }));
    setSubmitting(prevSubmitting => ({
      ...prevSubmitting,
      [formName]: false
    }));
  }, [forms]);

  /**
   * Set form errors
   * @param {string} formName - Name of the form
   * @param {Object} formErrors - Form errors
   */
  const setFormErrors = useCallback((formName, formErrors) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [formName]: formErrors
    }));
  }, []);

  /**
   * Set form submitting state
   * @param {string} formName - Name of the form
   * @param {boolean} isSubmitting - Whether the form is submitting
   */
  const setFormSubmitting = useCallback((formName, isSubmitting) => {
    setSubmitting(prevSubmitting => ({
      ...prevSubmitting,
      [formName]: isSubmitting
    }));
  }, []);

  /**
   * Validate a form
   * @param {string} formName - Name of the form
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = useCallback((formName) => {
    const formData = forms[formName];
    const formErrors = {};
    let isValid = true;

    // Common validation for all forms
    Object.keys(formData).forEach(field => {
      // Skip validation for boolean fields
      if (typeof formData[field] === 'boolean') {
        return;
      }

      // Required field validation
      if (formData[field] === '' && field !== 'bio') {
        formErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    // Form-specific validation
    if (formName === 'signup' || formName === 'profile') {
      // Password match validation for signup
      if (formName === 'signup' && formData.password !== formData.confirmPassword) {
        formErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      // Email format validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        formErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Set form errors
    setFormErrors(formName, formErrors);

    return isValid;
  }, [forms, setFormErrors]);

  // Context value
  const contextValue = {
    forms,
    errors,
    submitting,
    updateFormField,
    setFormData,
    resetForm,
    setFormErrors,
    setFormSubmitting,
    validateForm
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};


