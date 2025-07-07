import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalPrice, clearCart } from '../store/slices/cartSlice';
import { selectCurrentUser, updateUserProfile } from '../store/slices/authSlice';
import { ToastContainer } from 'react-toastify';
import CustomToast from '../components/CustomToast';
import PhoneInput from '../components/PhoneInput';
import { countryCodes } from '../data/countryCodes';
import { validatePhoneForCountry, getPhoneLengthInfo } from '../utils/phoneValidation';

import './Checkout.css';
import checkoutBg from '../assets/optimized/checkout-bg.jpg';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const currentUser = useSelector(selectCurrentUser);
  // State for subscription status
  const [, setHasSubscription] = useState(false);
  const [, setSubscriptionDetails] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompletePayment, setShowCompletePayment] = useState(false);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  // State for access validation (not currently used)
  const [, ] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phoneCountryCode: 'US' // Track the selected country code for phone validation
  });

  // Validation states
  const [shippingErrors, setShippingErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Initialize with all fields untouched to prevent immediate validation errors
  const initialTouchedState = {
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    country: false
  };

  const [formTouched, setFormTouched] = useState(initialTouchedState);

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [saveAddress, setSaveAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    sameAsShipping: true,
    // PayPal info
    paypalEmail: '',
    // Apple Pay info
    applePayIdentifier: '',
    // Google Pay info
    googlePayEmail: ''
  });

  // Payment validation states
  const [paymentErrors, setPaymentErrors] = useState({
    // Credit Card errors
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    // PayPal errors
    paypalEmail: '',
    // Apple Pay errors
    applePayIdentifier: '',
    // Google Pay errors
    googlePayEmail: ''
  });

  const [paymentTouched, setPaymentTouched] = useState({
    // Credit Card fields
    cardName: false,
    cardNumber: false,
    expiryDate: false,
    cvv: false,
    // PayPal fields
    paypalEmail: false,
    // Apple Pay fields
    applePayIdentifier: false,
    // Google Pay fields
    googlePayEmail: false
  });



  const [billingInfo, setBillingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  // Billing validation states
  const [billingErrors, setBillingErrors] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [billingTouched, setBillingTouched] = useState({
    address: false,
    city: false,
    state: false,
    zipCode: false,
    country: false
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Check if the user has cart items
    const hasCartItems = cartItems.length > 0;

    // Redirect to cart if empty cart
    if (!hasCartItems) {
      CustomToast.info('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Check if there's a subscription product in the cart
    const subscriptionItem = cartItems.find(item => item.isSubscription);
    if (subscriptionItem) {
      setHasSubscription(true);
      setSubscriptionDetails(subscriptionItem);
    }

    // Set loaded state after a short delay for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Preload the background image
    const img = new Image();
    img.src = checkoutBg;
  }, [cartItems, navigate, location]);



  // Calculate shipping cost based on method
  const getShippingCost = () => {
    switch(shippingMethod) {
      case 'express':
        return 15.99;
      case 'overnight':
        return 29.99;
      default: // standard
        return 0;
    }
  };

  // Calculate tax (simplified as 8.5% of subtotal)
  const getTax = () => {
    return totalPrice * 0.085;
  };

  // Calculate order total
  const getOrderTotal = () => {
    // Skip shipping costs for subscription-only orders
    const isSubscriptionOnly = cartItems.every(item => item.isSubscription);
    const shippingCost = isSubscriptionOnly ? 0 : getShippingCost();
    return totalPrice + shippingCost + getTax();
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validatePhone = (phone, countryCode = 'US') => {
    // More flexible validation for international phone numbers
    if (!phone) return 'Phone number is required';

    // The PhoneInput component already adds the country code with a space
    // So we need to check if it contains a plus sign rather than starts with it
    if (!phone.includes('+')) return 'Phone number must include country code';

    // Extract just the phone number part (without country code)
    const parts = phone.split(' ');
    const phoneNumberPart = parts.slice(1).join(''); // This is the actual phone number

    // Remove all non-digit characters for validation
    const digitsOnly = phoneNumberPart.replace(/\D/g, '');

    // Check if the phone number is valid for the selected country
    if (!validatePhoneForCountry(digitsOnly, countryCode)) {
      return `Invalid phone number format for the selected country. Expected: ${getPhoneLengthInfo(countryCode)}`;
    }

    return '';
  };

  const validateZipCode = (zipCode) => {
    const zipRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return zipRegex.test(zipCode) ? '' : 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
  };

  const validateRequired = (value, fieldName) => {
    return value.trim() ? '' : `${fieldName} is required`;
  };

  // Validate all shipping form fields
  const validateShippingForm = () => {
    const errors = {
      firstName: validateRequired(shippingInfo.firstName, 'First name'),
      lastName: validateRequired(shippingInfo.lastName, 'Last name'),
      email: validateEmail(shippingInfo.email),
      phone: validatePhone(shippingInfo.phone, shippingInfo.phoneCountryCode),
      address: validateRequired(shippingInfo.address, 'Address'),
      city: validateRequired(shippingInfo.city, 'City'),
      state: validateRequired(shippingInfo.state, 'State'),
      zipCode: validateZipCode(shippingInfo.zipCode),
      country: validateRequired(shippingInfo.country, 'Country')
    };

    setShippingErrors(errors);

    // Check if all fields are valid
    return Object.values(errors).every(error => error === '');
  };

  // Handle shipping form change
  const handleShippingInfoChange = (e) => {
    const { name, value, dataset } = e.target;

    // Special handling for phone input to capture country code
    if (name === 'phone' && dataset && dataset.countryCode) {
      // Update shipping info with both phone number and country code
      setShippingInfo(prev => ({
        ...prev,
        [name]: value,
        phoneCountryCode: dataset.countryCode
      }));
    } else {
      // Regular field update
      setShippingInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Mark field as touched
    setFormTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate the field
    let error = '';

    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone': {
        // Use the country code from the dataset or the stored one
        const countryCode = dataset?.countryCode || shippingInfo.phoneCountryCode;
        error = validatePhone(value, countryCode);
        break;
      }
      case 'zipCode':
        error = validateZipCode(value);
        break;
      default:
        error = validateRequired(value, name.charAt(0).toUpperCase() + name.slice(1));
    }

    // Update error state
    setShippingErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Validate billing form
  const validateBillingForm = () => {
    // Only validate if billing address is different from shipping
    if (paymentInfo.sameAsShipping) {
      return true;
    }

    const errors = {
      address: validateRequired(billingInfo.address, 'Address'),
      city: validateRequired(billingInfo.city, 'City'),
      state: validateRequired(billingInfo.state, 'State'),
      zipCode: validateZipCode(billingInfo.zipCode),
      country: validateRequired(billingInfo.country, 'Country')
    };

    setBillingErrors(errors);

    // Check if all fields are valid
    return Object.values(errors).every(error => error === '');
  };

  // Handle billing form change
  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;

    // Update billing info
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setBillingTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate the field
    let error = '';

    switch (name) {
      case 'zipCode':
        error = validateZipCode(value);
        break;
      default:
        error = validateRequired(value, name.charAt(0).toUpperCase() + name.slice(1));
    }

    // Update error state
    setBillingErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Validation functions for payment
  const validateCardNumber = (cardNumber) => {
    // Remove spaces and dashes
    const cleanCardNumber = cardNumber.replace(/[\s-]/g, '');
    // Check if it's 16 digits and only contains numbers
    const cardRegex = /^[0-9]{16}$/;
    return cardRegex.test(cleanCardNumber) ? '' : 'Please enter a valid 16-digit card number';
  };

  const validateExpiryDate = (expiryDate) => {
    // Check format MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }

    // Check if the date is in the future
    const [month, year] = expiryDate.split('/');
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt('20' + year, 10);

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = today.getFullYear();

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return 'Card has expired';
    }

    return '';
  };

  const validateCVV = (cvv) => {
    // Check if it's 3 or 4 digits
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv) ? '' : 'Please enter a valid CVV (3 or 4 digits)';
  };

  // Validate PayPal email
  const validatePayPalEmail = (email) => {
    if (!email) return 'PayPal email is required';
    return validateEmail(email);
  };

  // Validate Apple Pay identifier
  const validateApplePayIdentifier = (identifier) => {
    if (!identifier) return 'Apple ID is required';
    // Simple validation for Apple ID (email format)
    return validateEmail(identifier);
  };

  // Validate Google Pay email
  const validateGooglePayEmail = (email) => {
    if (!email) return 'Google account email is required';
    return validateEmail(email);
  };

  // Validate all payment form fields
  const validatePaymentForm = () => {
    let errors = {};

    // Validate based on selected payment method
    if (paymentMethod === 'creditCard') {
      errors = {
        cardName: validateRequired(paymentInfo.cardName, 'Name on card'),
        cardNumber: validateCardNumber(paymentInfo.cardNumber),
        expiryDate: validateExpiryDate(paymentInfo.expiryDate),
        cvv: validateCVV(paymentInfo.cvv),
        paypalEmail: '',
        applePayIdentifier: '',
        googlePayEmail: ''
      };
    } else if (paymentMethod === 'paypal') {
      errors = {
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        paypalEmail: validatePayPalEmail(paymentInfo.paypalEmail),
        applePayIdentifier: '',
        googlePayEmail: ''
      };
    } else if (paymentMethod === 'applePay') {
      errors = {
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        paypalEmail: '',
        applePayIdentifier: validateApplePayIdentifier(paymentInfo.applePayIdentifier),
        googlePayEmail: ''
      };
    } else if (paymentMethod === 'googlePay') {
      errors = {
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        paypalEmail: '',
        applePayIdentifier: '',
        googlePayEmail: validateGooglePayEmail(paymentInfo.googlePayEmail)
      };
    }

    setPaymentErrors(errors);

    // Check if all relevant fields for the selected payment method are valid
    const relevantErrors = Object.entries(errors)
      .filter(([key]) => {
        if (paymentMethod === 'creditCard') return ['cardName', 'cardNumber', 'expiryDate', 'cvv'].includes(key);
        if (paymentMethod === 'paypal') return ['paypalEmail'].includes(key);
        if (paymentMethod === 'applePay') return ['applePayIdentifier'].includes(key);
        if (paymentMethod === 'googlePay') return ['googlePayEmail'].includes(key);
        return false;
      })
      .map(([, value]) => value);

    return relevantErrors.every(error => error === '');
  };

  // Handle payment form change
  const handlePaymentInfoChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'sameAsShipping') {
      // If sameAsShipping is toggled, update the checkbox state
      setPaymentInfo(prev => ({
        ...prev,
        sameAsShipping: checked
      }));
    } else {
      // For other fields, update the value
      setPaymentInfo(prev => ({
        ...prev,
        [name]: value
      }));

      // Mark field as touched
      setPaymentTouched(prev => ({
        ...prev,
        [name]: true
      }));

      // Validate the field
      let error = '';

      switch (name) {
        case 'cardNumber':
          error = validateCardNumber(value);
          break;
        case 'expiryDate':
          error = validateExpiryDate(value);
          break;
        case 'cvv':
          error = validateCVV(value);
          break;
        case 'paypalEmail':
          error = validatePayPalEmail(value);
          break;
        case 'applePayIdentifier':
          error = validateApplePayIdentifier(value);
          break;
        case 'googlePayEmail':
          error = validateGooglePayEmail(value);
          break;
        default:
          error = validateRequired(value, name.charAt(0).toUpperCase() + name.slice(1));
      }

      // Update error state
      setPaymentErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    // Prevent changing payment method if payment is already completed
    if (paymentCompleted) {
      CustomToast.info('Payment already completed. Please proceed to review your order or go back to change shipping details.');
      return;
    }

    setPaymentMethod(method);

    // Reset touched state for all payment fields
    const resetTouched = Object.keys(paymentTouched).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setPaymentTouched(resetTouched);

    // Reset errors for all payment fields
    const resetErrors = Object.keys(paymentErrors).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setPaymentErrors(resetErrors);
  };



  // Handle next step
  const handleNextStep = () => {
    // If we're on the shipping step, validate the form before proceeding
    if (currentStep === 2) {
      // Check if this is a subscription-only order
      const isSubscriptionOnly = cartItems.every(item => item.isSubscription);

      // If it's a subscription-only order, we can skip shipping validation
      if (!isSubscriptionOnly) {
        // Mark all fields as touched
        const allTouched = Object.keys(formTouched).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setFormTouched(allTouched);

        // Validate the form
        const isValid = validateShippingForm();

        if (!isValid) {
          CustomToast.error('Please fill in all required fields correctly');
          return;
        }
      }
    }

    // If we're on the payment step, validate the payment form before proceeding
    if (currentStep === 3) {
      // Check if payment is completed
      if (!paymentCompleted) {
        // Show a message to the user
        CustomToast.error('Please complete your payment before proceeding');
        return;
      }

      // Mark all payment fields as touched
      const allTouched = Object.keys(paymentTouched).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setPaymentTouched(allTouched);

      // Validate the payment form
      const isPaymentValid = validatePaymentForm();

      // If billing address is different from shipping, validate billing info
      let isBillingValid = true;
      if (!paymentInfo.sameAsShipping) {
        // Mark all billing fields as touched
        const allBillingTouched = Object.keys(billingTouched).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setBillingTouched(allBillingTouched);

        isBillingValid = validateBillingForm();
      }

      if (!isPaymentValid || !isBillingValid) {
        CustomToast.error('Please fill in all payment and billing details correctly');
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  // Handle previous step
  const handlePrevStep = () => {
    // When going back to shipping from payment, don't trigger validation errors
    if (currentStep === 3) {
      // Reset touched state for shipping fields to prevent immediate validation errors
      const resetTouched = Object.keys(formTouched).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setFormTouched(resetTouched);
    }

    // When going back to payment from review, don't trigger validation errors
    if (currentStep === 4) {
      // Reset touched state for payment fields
      const resetPaymentTouched = Object.keys(paymentTouched).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setPaymentTouched(resetPaymentTouched);

      // Reset touched state for billing fields
      const resetBillingTouched = Object.keys(billingTouched).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setBillingTouched(resetBillingTouched);
    }

    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Handle place order
  const handlePlaceOrder = () => {
    // For credit card, process directly when the Process Payment button is clicked
    if (paymentMethod === 'creditCard' && !paymentCompleted) {
      // Validate credit card fields
      const allTouched = Object.keys(paymentTouched).reduce((acc, key) => {
        if (key !== 'paypalEmail' && key !== 'applePayIdentifier' && key !== 'googlePayEmail') {
          acc[key] = true;
        }
        return acc;
      }, {});
      setPaymentTouched(allTouched);

      // Check for validation errors
      const isPaymentValid = validatePaymentForm();

      // If billing address is different from shipping, validate billing info
      let isBillingValid = true;
      if (!paymentInfo.sameAsShipping) {
        // Mark all billing fields as touched
        const allBillingTouched = Object.keys(billingTouched).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setBillingTouched(allBillingTouched);

        isBillingValid = validateBillingForm();
      }

      // If validation passes, process the payment
      if (isPaymentValid && isBillingValid) {
        // Simulate credit card processing
        setIsProcessing(true);
        CustomToast.info('Processing credit card payment...');

        // Simulate credit card processing with a delay
        setTimeout(() => {
          CustomToast.success('Credit Card payment successful!');
          setIsProcessing(false);

          // Add a slight delay before enabling the button for better visual effect
          setTimeout(() => {
            // Mark payment as completed
            setPaymentCompleted(true);

            // Show a message to guide the user
            CustomToast.info('You can now continue to review your order');

            // Highlight the continue button to draw attention to it
            const continueButton = document.querySelector('.next-step-btn');
            if (continueButton) {
              continueButton.classList.add('button-highlight');

              // Remove the highlight after animation completes
              setTimeout(() => {
                continueButton.classList.remove('button-highlight');
              }, 2000);
            }
          }, 1000);
        }, 3000);
      } else {
        // If validation fails, show an error message
        CustomToast.error('Please fill in all required card details correctly');
      }
    }
    // For the review step, when the Place Order button is clicked
    else if (currentStep === 4) {
      // Proceed to final order placement
      handleFinalOrderPlacement();
    }
    // For other payment methods, they should use the redirect buttons in their respective forms
    else if (paymentCompleted) {
      // If payment is already completed, proceed to next step
      handleNextStep();
    }
    // For other payment methods that haven't been completed yet
    else {
      // This shouldn't be reached normally, as the other payment methods use their own buttons
      // But we'll handle it just in case
      if (paymentMethod === 'paypal' && paymentInfo.paypalEmail && !paymentErrors.paypalEmail) {
        handlePaymentRedirect('PayPal');
      } else if (paymentMethod === 'applePay' && paymentInfo.applePayIdentifier && !paymentErrors.applePayIdentifier) {
        handlePaymentRedirect('Apple Pay');
      } else if (paymentMethod === 'googlePay' && paymentInfo.googlePayEmail && !paymentErrors.googlePayEmail) {
        handlePaymentRedirect('Google Pay');
      } else {
        // If we get here, there's an issue with the payment method form
        CustomToast.error('Please complete the payment method form before proceeding');
      }
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="checkout-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Order Summary</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Payment</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Review</div>
        </div>
      </div>
    );
  };

  // Handle payment redirect to actual payment provider websites
  const handlePaymentRedirect = (method) => {
    // Calculate order total for payment
    const totalAmount = getOrderTotal().toFixed(2);
    const currency = 'USD';

    // Save order information to session storage before redirecting
    const orderInfo = {
      items: cartItems,
      totalAmount: totalAmount,
      shippingInfo: shippingInfo,
      paymentMethod: method
    };
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderInfo));

    // Set up URLs for different payment providers with appropriate parameters
    let redirectUrl = '';

    switch(method) {
      case 'PayPal':
        // PayPal checkout URL with parameters
        // Note: In a real implementation, you would use the PayPal SDK or API
        redirectUrl = `https://www.paypal.com/checkoutnow?token=EC-DEMO&amount=${totalAmount}&currency_code=${currency}`;
        if (paymentInfo.paypalEmail) {
          redirectUrl += `&email=${encodeURIComponent(paymentInfo.paypalEmail)}`;
        }
        break;

      case 'Apple Pay':
        // Apple Pay doesn't have a direct web URL for payments
        // In a real implementation, you would use the Apple Pay JS API
        // For demo purposes, we'll use Apple's site
        redirectUrl = 'https://www.apple.com/apple-pay/';
        break;

      case 'Google Pay':
        // Google Pay URL
        // In a real implementation, you would use the Google Pay API
        redirectUrl = 'https://pay.google.com/about/';
        if (paymentInfo.googlePayEmail) {
          redirectUrl += `?email=${encodeURIComponent(paymentInfo.googlePayEmail)}`;
        }
        break;

      default:
        redirectUrl = '';
    }

    // Show toast notification
    CustomToast.info(`Redirecting to ${method}...`);

    // Set the pending payment method
    setPendingPaymentMethod(method);

    // Open the payment provider website in a new tab
    if (redirectUrl) {
      // Use setTimeout to ensure the toast is shown before redirecting
      setTimeout(() => {
        // Open in a new tab
        window.open(redirectUrl, '_blank');

        // Show a message to the user about returning to complete the order
        CustomToast.info('After payment, return to this page to complete your order');

        // Show the complete payment button for reassurance
        setShowCompletePayment(true);

        // Add a simulated "complete payment" button for demo purposes
        setTimeout(() => {
          CustomToast.info('Payment verification in progress...');

          // Automatically trigger payment completion after a brief delay
          setTimeout(() => {
            // Automatically complete the payment
            handleCompletePayment();
          }, 4000);
        }, 3000);
      }, 1000);
    }
  };

  // Handle completing the payment (simulating return from payment provider)
  const handleCompletePayment = () => {
    // Hide the complete payment button
    setShowCompletePayment(false);

    // Show success message
    CustomToast.success(`${pendingPaymentMethod} payment successful!`);

    // Return to the payment step if we're on a different step
    if (currentStep !== 3) {
      setCurrentStep(3);
    }

    // Add a slight delay before enabling the button for better visual effect
    setTimeout(() => {
      // Mark payment as completed
      setPaymentCompleted(true);

      // Show a message to guide the user
      CustomToast.info('You can now continue to review your order');

      // Highlight the continue button to draw attention to it
      const continueButton = document.querySelector('.next-step-btn');
      if (continueButton) {
        continueButton.classList.add('button-highlight');

        // Remove the highlight after animation completes
        setTimeout(() => {
          continueButton.classList.remove('button-highlight');
        }, 2000);
      }
    }, 1000);
  };

  // Handle final order placement
  const handleFinalOrderPlacement = () => {
    // Simulate order processing
    setIsProcessing(true);

    try {
      // Ensure user is logged in before proceeding
      if (!currentUser) {
        CustomToast.error('You must be logged in to place an order');
        setIsProcessing(false);
        return;
      }

      // Check if there's a subscription product in the cart
      const subscriptionItem = cartItems.find(item => item.isSubscription);
      const isSubscriptionOnly = cartItems.every(item => item.isSubscription);

      // For subscription-only orders, we don't create a tracking order
      if (!isSubscriptionOnly) {
        // Generate a unique tracking number for physical products
        const trackingNumber = generateRandomTrackingNumber();

        // Save order information to session storage for tracking page
        const orderInfo = {
          items: cartItems.filter(item => !item.isSubscription), // Only include non-subscription items
          totalAmount: getOrderTotal(),
          shippingInfo: {...shippingInfo},
          paymentMethod: paymentMethod === 'creditCard' ? 'Credit Card' : pendingPaymentMethod,
          shippingMethod: shippingMethod,
          shippingCost: getShippingCost(),
          orderDate: new Date().toISOString(),
          trackingNumber: trackingNumber,
          userId: currentUser.id
        };

        // Store the order info in session storage
        sessionStorage.setItem('completedOrder', JSON.stringify(orderInfo));

        // Save to user-specific orders in localStorage
        const userOrdersKey = `userOrders_${currentUser.id}`;
        const savedOrdersJson = localStorage.getItem(userOrdersKey);
        let orders = [];

        if (savedOrdersJson) {
          try {
            const parsedOrders = JSON.parse(savedOrdersJson);
            if (Array.isArray(parsedOrders)) {
              orders = parsedOrders;
            }
          } catch (error) {
            console.error("Error parsing existing orders:", error);
          }
        }

        // Add the new order
        orders.push(orderInfo);

        // Save back to localStorage
        localStorage.setItem(userOrdersKey, JSON.stringify(orders));

        // Clear old userOrders data if it exists (migration step)
        if (localStorage.getItem('userOrders')) {
          localStorage.removeItem('userOrders');
        }

        // Save to orderMap for tracking when logged out (public tracking)
        const savedOrderMap = localStorage.getItem('orderMap');
        let orderMap = {};

        if (savedOrderMap) {
          try {
            const parsedMap = JSON.parse(savedOrderMap);
            if (typeof parsedMap === 'object') {
              orderMap = parsedMap;
            }
          } catch (error) {
            console.error("Error parsing order map:", error);
          }
        }

        // Add the new order to the map
        orderMap[trackingNumber] = orderInfo;

        // Save back to localStorage
        localStorage.setItem('orderMap', JSON.stringify(orderMap));
      }

      // If this is a subscription order, update the user's subscription status
      if (subscriptionItem) {
        // Get all users to find the current user
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(user => user.id === currentUser.id);

        if (userIndex !== -1) {
          // Get current user data
          const userData = users[userIndex];

          // Determine if this is a special offer or regular subscription
          const isOffer = subscriptionItem.category === 'Special Offer';

          // Calculate expiry date (30 days for regular packages, 60 days for "First Month Free" offer)
          const startDate = new Date();
          const expiryDate = new Date(startDate);

          // If it's the "First Month Free" offer, set expiry to 60 days
          if (subscriptionItem.name === 'First Month Free') {
            expiryDate.setDate(startDate.getDate() + 60); // 60 days (2 months)
          } else {
            expiryDate.setDate(startDate.getDate() + 30); // 30 days (1 month)
          }

          // Create a new subscription object
          const newSubscription = {
            id: `${isOffer ? 'offer' : 'subscription'}-${Date.now()}`,
            name: subscriptionItem.name,
            date: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            type: isOffer ? 'offer' : 'package',
            price: subscriptionItem.price
          };

          // Initialize or update the subscriptions array
          let subscriptions = [];

          if (userData.subscriptions && Array.isArray(userData.subscriptions)) {
            // Check if user already has a subscription of the same type
            const existingSubscriptionIndex = userData.subscriptions.findIndex(
              sub => sub.type === (isOffer ? 'offer' : 'package')
            );

            if (existingSubscriptionIndex !== -1) {
              // Replace existing subscription of the same type
              subscriptions = [...userData.subscriptions];

              // Store the name of the replaced subscription for notification
              const replacedSubscription = subscriptions[existingSubscriptionIndex];

              // Replace the existing subscription with the new one
              subscriptions[existingSubscriptionIndex] = newSubscription;

              // Show notification about replacement
              CustomToast.info(`Your previous ${isOffer ? 'special offer' : 'subscription plan'} "${replacedSubscription.name}" has been replaced with "${newSubscription.name}"`);
            } else {
              // Add new subscription to existing array
              subscriptions = [...userData.subscriptions, newSubscription];
            }
          } else {
            // Create new subscriptions array
            subscriptions = [newSubscription];

            // If user has a legacy subscription, add it to the array
            if (userData.subscriptionStatus && userData.subscriptionPackage) {
              const legacyType = isSpecialOffer(userData.subscriptionPackage) ? 'offer' : 'package';

              // Only add legacy subscription if it's of a different type than the new one
              if (legacyType !== (isOffer ? 'offer' : 'package')) {
                subscriptions.unshift({
                  id: 'legacy-subscription',
                  name: userData.subscriptionPackage,
                  date: userData.subscriptionDate || new Date().toISOString(),
                  type: legacyType
                });
              } else {
                // Show notification about replacement
                CustomToast.info(`Your previous ${isOffer ? 'special offer' : 'subscription plan'} "${userData.subscriptionPackage}" has been replaced with "${newSubscription.name}"`);
              }
            }
          }

          // Update the user's subscription status directly in localStorage
          users[userIndex].subscriptionStatus = true;
          users[userIndex].subscriptionPackage = subscriptionItem.name;
          users[userIndex].subscriptionDate = new Date().toISOString();
          users[userIndex].subscriptions = subscriptions;

          // Save the updated users array back to localStorage
          localStorage.setItem('users', JSON.stringify(users));

          // Also update the profile using Redux
          dispatch(updateUserProfile({
            subscriptionStatus: true,
            subscriptionPackage: subscriptionItem.name,
            subscriptionDate: new Date().toISOString(),
            subscriptions: subscriptions
          }));

          // Clear the cart immediately to prevent issues
          dispatch(clearCart());

          // Store welcome message in sessionStorage to display on home page
          sessionStorage.setItem('welcomeMessage', JSON.stringify({
            show: true,
            package: subscriptionItem.name,
            timestamp: new Date().getTime()
          }));

          // Force immediate hard redirect to home page for subscriptions
          window.location.replace('/');
        } else {
          throw new Error('User not found in localStorage');
        }
      } else {
        // Show success message for regular order
        CustomToast.success('Order placed successfully!');

        // Clear the cart immediately to prevent issues
        dispatch(clearCart());

        // Force immediate hard redirect to tracking page for regular orders
        window.location.replace('/order-tracking');
      }
    } catch (error) {
      console.error('Error during order placement:', error);
      CustomToast.error('There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  // Helper function to generate a unique tracking number
  const generateRandomTrackingNumber = () => {
    const prefix = 'FT';
    // Add timestamp component to ensure uniqueness
    const timestamp = new Date().getTime().toString().slice(-6);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);

    // Combine timestamp and random digits for uniqueness
    return `${prefix}${timestamp}${randomDigits}`;
  };

  // Helper function to check if a subscription is a special offer
  const isSpecialOffer = (packageName) => {
    // List of special offers from the Offers page
    const specialOffers = [
      'Summer Body Challenge',
      'Couple\'s Package',
      'First Month Free'
    ];

    return specialOffers.some(offer => packageName.includes(offer));
  };

  return (
    <div className={`checkout-page ${loaded ? 'loaded' : ''}`}>
      <ToastContainer />
      <div className="page-overlay"></div>

      {/* Complete Payment Button (shown after redirecting to payment provider) */}
      {showCompletePayment && (
        <div className="complete-payment-container">
          <Button
            variant="success"
            size="lg"
            className="complete-payment-button auto-complete"
            onClick={handleCompletePayment}
          >
            <div className="payment-verification-indicator">
              <span className="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true"></span>
              Verifying {pendingPaymentMethod} Payment...
            </div>
          </Button>
        </div>
      )}

      <Container className="checkout-container">
        <div className="checkout-progress-wrapper">
          {renderProgressIndicator()}
        </div>

        <div className="checkout-content">
          {/* Step 1: Order Summary */}
          {currentStep === 1 && (
            <div className="order-summary ">
              <h2 className="order-summary-title">Order Summary</h2>

              {cartItems.length > 0 ? (
                <>
                  <div className="order-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <img src={item.image} alt={item.name} className="order-item-image" />
                        <div className="order-item-details">
                          <h4 className="order-item-name">{item.name}</h4>
                          <p className="order-item-price">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="order-item-quantity">
                          Qty: {item.quantity}
                        </div>
                        <div className="order-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary-totals">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>${getShippingCost().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (8.5%):</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${getOrderTotal().toFixed(2)}</span>
                    </div>
                  </div>



                  <div className="cart-actions">
                    <Button
                      variant="outline-secondary"
                      className="prev-step-btn"
                      onClick={() => navigate('/cart')}
                    >
                      <i className="fas fa-arrow-left"></i> Back to Cart
                    </Button>
                    <Button
                      variant="primary"
                      className="next-step-btn"
                      onClick={() => setCurrentStep(2)}
                    >
                      Continue <i className="fas fa-arrow-right"></i>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="empty-cart-message">
                  <p>Your cart is empty. Please add items to your cart before proceeding to checkout.</p>
                  <Link to="/products" className="btn btn-primary mt-3">
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Shipping Information */}
          {currentStep === 2 && (
            <div className="shipping-info-section ">
              <h2 className="form-section-title">Shipping Information</h2>
              <p className="mb-4">Please enter your shipping details</p>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>First Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.firstName && !!shippingErrors.firstName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Last Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.lastName && !!shippingErrors.lastName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Email Address*</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.email && !!shippingErrors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <PhoneInput
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingInfoChange}
                      isInvalid={formTouched.phone && !!shippingErrors.phone}
                      errorMessage={shippingErrors.phone}
                      required
                    />
                  </Col>
                </Row>

                <Form.Group className="form-group">
                  <Form.Label>Address*</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    isInvalid={formTouched.address && !!shippingErrors.address}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {shippingErrors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.city && !!shippingErrors.city}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>State/Province*</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.state && !!shippingErrors.state}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Zip/Postal Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.zipCode && !!shippingErrors.zipCode}
                        placeholder="12345 or 12345-6789"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.zipCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Country*</Form.Label>
                      <Form.Select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingInfoChange}
                        isInvalid={formTouched.country && !!shippingErrors.country}
                        required
                      >
                        <option value="">Select a country</option>
                        {countryCodes.map(country => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {shippingErrors.country}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="form-check">
                  <Form.Check
                    type="checkbox"
                    id="saveAddress"
                    label="Save this address for future orders"
                    checked={saveAddress}
                    onChange={() => setSaveAddress(!saveAddress)}
                  />
                </Form.Group>
              </Form>

              {/* Only show shipping method for physical products */}
              {!cartItems.every(item => item.isSubscription) && (
                <div className="shipping-method-section mt-5">
                  <h3 className="mb-3">Shipping Method</h3>

                  <div className="shipping-options">
                    <div
                      className={`shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}
                      onClick={() => setShippingMethod('standard')}
                    >
                      <div className="shipping-option-header">
                        <span className="shipping-option-title">Standard Shipping</span>
                        <span className="shipping-option-price">FREE</span>
                      </div>
                      <p className="shipping-option-description">Delivery in 5-7 business days</p>
                    </div>

                    <div
                      className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}
                      onClick={() => setShippingMethod('express')}
                    >
                      <div className="shipping-option-header">
                        <span className="shipping-option-title">Express Shipping</span>
                        <span className="shipping-option-price">$15.99</span>
                      </div>
                      <p className="shipping-option-description">Delivery in 2-3 business days</p>
                    </div>

                    <div
                      className={`shipping-option ${shippingMethod === 'overnight' ? 'selected' : ''}`}
                      onClick={() => setShippingMethod('overnight')}
                    >
                      <div className="shipping-option-header">
                        <span className="shipping-option-title">Overnight Shipping</span>
                        <span className="shipping-option-price">$29.99</span>
                      </div>
                      <p className="shipping-option-description">Delivery next business day</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show subscription message for subscription-only orders */}
              {cartItems.every(item => item.isSubscription) && (
                <div className="subscription-info-section mt-5">
                  <h3 className="mb-3">Subscription Service</h3>
                  <div className="subscription-info-box">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <p className="mb-0">This is a digital subscription service. No shipping required.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <div className={`payment-section  ${paymentCompleted ? 'payment-section-completed' : ''}`}>
              {paymentCompleted && (
                <div className="payment-completed-indicator">
                  <i className="fas fa-check-circle"></i>
                  Payment Completed
                </div>
              )}
              <h2 className="form-section-title">Payment Method</h2>
              <p className="mb-4">Please select your preferred payment method</p>

              <div className="payment-methods">
                <div
                  className={`payment-method ${paymentMethod === 'creditCard' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('creditCard')}
                  style={{ pointerEvents: paymentCompleted ? 'none' : 'auto' }}
                >
                  <div className="payment-method-icon">
                    <i className="far fa-credit-card"></i>
                  </div>
                  <div className="payment-method-name">Credit Card</div>
                </div>

                <div
                  className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('paypal')}
                  style={{ pointerEvents: paymentCompleted ? 'none' : 'auto' }}
                >
                  <div className="payment-method-icon">
                    <i className="fab fa-paypal"></i>
                  </div>
                  <div className="payment-method-name">PayPal</div>
                </div>

                <div
                  className={`payment-method ${paymentMethod === 'applePay' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('applePay')}
                  style={{ pointerEvents: paymentCompleted ? 'none' : 'auto' }}
                >
                  <div className="payment-method-icon">
                    <i className="fab fa-apple-pay"></i>
                  </div>
                  <div className="payment-method-name">Apple Pay</div>
                </div>

                <div
                  className={`payment-method ${paymentMethod === 'googlePay' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('googlePay')}
                  style={{ pointerEvents: paymentCompleted ? 'none' : 'auto' }}
                >
                  <div className="payment-method-icon">
                    <i className="fab fa-google-pay"></i>
                  </div>
                  <div className="payment-method-name">Google Pay</div>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'creditCard' && (
                <div className="card-details mt-4">
                  <h3 className="mb-3">Card Details</h3>

                  <Form>
                    <Form.Group className="form-group">
                      <Form.Label>Name on Card*</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentInfoChange}
                        isInvalid={paymentTouched.cardName && !!paymentErrors.cardName}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {paymentErrors.cardName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>Card Number*</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentInfoChange}
                        isInvalid={paymentTouched.cardNumber && !!paymentErrors.cardNumber}
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {paymentErrors.cardNumber}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="card-row">
                      <div className="card-col">
                        <Form.Group className="form-group">
                          <Form.Label>Expiry Date*</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentInfoChange}
                            isInvalid={paymentTouched.expiryDate && !!paymentErrors.expiryDate}
                            placeholder="MM/YY"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {paymentErrors.expiryDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>

                      <div className="card-col">
                        <Form.Group className="form-group">
                          <Form.Label>CVV*</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentInfoChange}
                            isInvalid={paymentTouched.cvv && !!paymentErrors.cvv}
                            placeholder="123"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {paymentErrors.cvv}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="form-check mt-4">
                      <Form.Check
                        type="checkbox"
                        id="sameAsShipping"
                        name="sameAsShipping"
                        label="Billing address same as shipping address"
                        checked={paymentInfo.sameAsShipping}
                        onChange={handlePaymentInfoChange}
                      />
                    </Form.Group>

                    <Form.Group className="form-check mt-4">
                      <Form.Check
                        type="checkbox"
                        id="agreeToTerms"
                        label={
                          <span>
                            I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>
                          </span>
                        }
                        checked={agreeToTerms}
                        onChange={() => setAgreeToTerms(!agreeToTerms)}
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      className="mt-4 w-100 process-card-button"
                      onClick={() => handlePlaceOrder()}
                      disabled={
                        !paymentInfo.cardName ||
                        !paymentInfo.cardNumber ||
                        !paymentInfo.expiryDate ||
                        !paymentInfo.cvv ||
                        !!paymentErrors.cardName ||
                        !!paymentErrors.cardNumber ||
                        !!paymentErrors.expiryDate ||
                        !!paymentErrors.cvv ||
                        !agreeToTerms ||
                        isProcessing
                      }
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-credit-card me-2"></i> Process Payment
                        </>
                      )}
                    </Button>
                  </Form>
                </div>
              )}

              {/* PayPal Form */}
              {paymentMethod === 'paypal' && (
                <div className="paypal-details mt-4">
                  <h3 className="mb-3">PayPal Details</h3>
                  <div className="payment-method-info">
                    <p>You will be redirected to PayPal to complete your payment securely.</p>
                    <div className="paypal-logo-container">
                      <i className="fab fa-paypal fa-3x mb-3"></i>
                    </div>
                    <Form>
                      <Form.Group className="form-group">
                        <Form.Label>PayPal Email*</Form.Label>
                        <Form.Control
                          type="email"
                          name="paypalEmail"
                          value={paymentInfo.paypalEmail}
                          onChange={handlePaymentInfoChange}
                          isInvalid={paymentTouched.paypalEmail && !!paymentErrors.paypalEmail}
                          placeholder="your-email@example.com"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {paymentErrors.paypalEmail}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="form-check mt-4">
                        <Form.Check
                          type="checkbox"
                          id="sameAsShippingPaypal"
                          name="sameAsShipping"
                          label="Billing address same as shipping address"
                          checked={paymentInfo.sameAsShipping}
                          onChange={handlePaymentInfoChange}
                        />
                      </Form.Group>

                      <Form.Group className="form-check mt-4">
                        <Form.Check
                          type="checkbox"
                          id="agreeToTermsPaypal"
                          label={
                            <span>
                              I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>
                            </span>
                          }
                          checked={agreeToTerms}
                          onChange={() => setAgreeToTerms(!agreeToTerms)}
                          required
                        />
                      </Form.Group>

                      <div className="paypal-info mt-3">
                        <p className="small payment-security-info">
                          <i className="fas fa-lock me-2"></i>
                          Your payment information is secure. We do not store your PayPal credentials.
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        className="mt-3 w-100 paypal-button"
                        onClick={() => handlePaymentRedirect('PayPal')}
                        disabled={!paymentInfo.paypalEmail || !!paymentErrors.paypalEmail || !agreeToTerms}
                      >
                        <i className="fab fa-paypal me-2"></i> Continue to PayPal
                      </Button>
                    </Form>
                  </div>
                </div>
              )}

              {/* Apple Pay Form */}
              {paymentMethod === 'applePay' && (
                <div className="apple-pay-details mt-4">
                  <h3 className="mb-3">Apple Pay Details</h3>
                  <div className="payment-method-info">
                    <p>Complete your purchase quickly and securely with Apple Pay.</p>
                    <div className="apple-pay-logo-container">
                      <i className="fab fa-apple-pay fa-3x mb-3"></i>
                    </div>
                    <Form>
                      <Form.Group className="form-group">
                        <Form.Label>Apple ID*</Form.Label>
                        <Form.Control
                          type="email"
                          name="applePayIdentifier"
                          value={paymentInfo.applePayIdentifier}
                          onChange={handlePaymentInfoChange}
                          isInvalid={paymentTouched.applePayIdentifier && !!paymentErrors.applePayIdentifier}
                          placeholder="your-apple-id@icloud.com"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {paymentErrors.applePayIdentifier}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="form-check mt-4">
                        <Form.Check
                          type="checkbox"
                          id="sameAsShippingApplePay"
                          name="sameAsShipping"
                          label="Billing address same as shipping address"
                          checked={paymentInfo.sameAsShipping}
                          onChange={handlePaymentInfoChange}
                        />
                      </Form.Group>

                      <Form.Group className="form-check mt-4">
                        <Form.Check
                          type="checkbox"
                          id="agreeToTermsApplePay"
                          label={
                            <span>
                              I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>
                            </span>
                          }
                          checked={agreeToTerms}
                          onChange={() => setAgreeToTerms(!agreeToTerms)}
                          required
                        />
                      </Form.Group>

                      <div className="apple-pay-info mt-3">
                        <p className="small payment-security-info">
                          <i className="fas fa-lock me-2"></i>
                          Your payment information is secure. We do not store your Apple Pay credentials.
                        </p>
                      </div>
                      <Button
                        variant="dark"
                        className="mt-3 w-100 apple-pay-button"
                        onClick={() => handlePaymentRedirect('Apple Pay')}
                        disabled={!paymentInfo.applePayIdentifier || !!paymentErrors.applePayIdentifier || !agreeToTerms}
                      >
                        <i className="fab fa-apple me-2"></i> Continue with Apple Pay
                      </Button>
                    </Form>
                  </div>
                </div>
              )}

              {/* Google Pay Form */}
              {paymentMethod === 'googlePay' && (
                <div className="google-pay-details mt-4">
                  <h3 className="mb-3">Google Pay Details</h3>
                  <div className="payment-method-info">
                    <p>Complete your purchase quickly and securely with Google Pay.</p>
                    <div className="google-pay-logo-container">
                      <i className="fab fa-google-pay fa-3x mb-3"></i>
                    </div>
                    <Form>
                      <Form.Group className="form-group">
                        <Form.Label>Google Account Email*</Form.Label>
                        <Form.Control
                          type="email"
                          name="googlePayEmail"
                          value={paymentInfo.googlePayEmail}
                          onChange={handlePaymentInfoChange}
                          isInvalid={paymentTouched.googlePayEmail && !!paymentErrors.googlePayEmail}
                          placeholder="your-email@gmail.com"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {paymentErrors.googlePayEmail}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="form-check mt-4">
                        <Form.Check
                          type="checkbox"
                          id="sameAsShippingGooglePay"
                          name="sameAsShipping"
                          label="Billing address same as shipping address"
                          checked={paymentInfo.sameAsShipping}
                          onChange={handlePaymentInfoChange}
                        />
                      </Form.Group>

                      <Form.Group className="form-check mt-4">
                        <Form.Check
                          type="checkbox"
                          id="agreeToTermsGooglePay"
                          label={
                            <span>
                              I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>
                            </span>
                          }
                          checked={agreeToTerms}
                          onChange={() => setAgreeToTerms(!agreeToTerms)}
                          required
                        />
                      </Form.Group>

                      <div className="google-pay-info mt-3">
                        <p className="small payment-security-info">
                          <i className="fas fa-lock me-2"></i>
                          Your payment information is secure. We do not store your Google Pay credentials.
                        </p>
                      </div>
                      <Button
                        variant="light"
                        className="mt-3 w-100 google-pay-button"
                        onClick={() => handlePaymentRedirect('Google Pay')}
                        disabled={!paymentInfo.googlePayEmail || !!paymentErrors.googlePayEmail || !agreeToTerms}
                      >
                        <i className="fab fa-google me-2"></i> Continue with Google Pay
                      </Button>
                    </Form>
                  </div>
                </div>
              )}

              {/* Billing Address - Show for all payment methods when not same as shipping */}
              {!paymentInfo.sameAsShipping && (
                <div className="billing-address mt-4">
                  <h3 className="mb-3">Billing Address</h3>
                  <Form>

                      <Form.Group className="form-group">
                        <Form.Label>Address*</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={billingInfo.address}
                          onChange={handleBillingInfoChange}
                          isInvalid={billingTouched.address && !!billingErrors.address}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {billingErrors.address}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>City*</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={billingInfo.city}
                              onChange={handleBillingInfoChange}
                              isInvalid={billingTouched.city && !!billingErrors.city}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {billingErrors.city}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>State/Province*</Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              value={billingInfo.state}
                              onChange={handleBillingInfoChange}
                              isInvalid={billingTouched.state && !!billingErrors.state}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {billingErrors.state}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>Zip/Postal Code*</Form.Label>
                            <Form.Control
                              type="text"
                              name="zipCode"
                              value={billingInfo.zipCode}
                              onChange={handleBillingInfoChange}
                              isInvalid={billingTouched.zipCode && !!billingErrors.zipCode}
                              placeholder="12345 or 12345-6789"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {billingErrors.zipCode}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>Country*</Form.Label>
                            <Form.Select
                              name="country"
                              value={billingInfo.country}
                              onChange={handleBillingInfoChange}
                              isInvalid={billingTouched.country && !!billingErrors.country}
                              required
                            >
                              <option value="">Select a country</option>
                              {countryCodes.map(country => (
                                <option key={country.code} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {billingErrors.country}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Order Review */}
          {currentStep === 4 && (
            <div className="review-section ">
              <h2 className="form-section-title">Order Review</h2>
              <p className="mb-4">Please review your order before placing it</p>

              <div className="review-order-summary">
                <h3 className="review-section-title">Items in Your Order</h3>

                <div className="order-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} className="order-item-image" />
                      <div className="order-item-details">
                        <h4 className="order-item-name">{item.name}</h4>
                        <p className="order-item-price">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="order-item-quantity">
                        Qty: {item.quantity}
                      </div>
                      <div className="order-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary-totals">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {/* Only show shipping for physical products */}
                  {!cartItems.every(item => item.isSubscription) && (
                    <div className="summary-row">
                      <span>Shipping ({shippingMethod}):</span>
                      <span>${getShippingCost().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Tax (8.5%):</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${getOrderTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Only show shipping info for physical products */}
              {!cartItems.every(item => item.isSubscription) ? (
                <div className="review-shipping-info mt-4">
                  <h3 className="review-section-title">Shipping Information</h3>

                  <div className="review-info-grid">
                    <div className="review-info">
                      <span className="review-label">Name:</span>
                      <span className="review-value">{shippingInfo.firstName} {shippingInfo.lastName}</span>
                    </div>

                    <div className="review-info">
                      <span className="review-label">Email:</span>
                      <span className="review-value">{shippingInfo.email}</span>
                    </div>

                    <div className="review-info">
                      <span className="review-label">Phone:</span>
                      <span className="review-value">{shippingInfo.phone}</span>
                    </div>

                    <div className="review-info">
                      <span className="review-label">Address:</span>
                      <span className="review-value">
                        {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}, {shippingInfo.country}
                      </span>
                    </div>

                    <div className="review-info">
                      <span className="review-label">Shipping Method:</span>
                      <span className="review-value">
                        {shippingMethod === 'standard' && 'Standard Shipping (5-7 business days)'}
                        {shippingMethod === 'express' && 'Express Shipping (2-3 business days)'}
                        {shippingMethod === 'overnight' && 'Overnight Shipping (Next business day)'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="review-subscription-info mt-4">
                  <h3 className="review-section-title">Subscription Information</h3>
                  <div className="review-info-grid">
                    <div className="review-info">
                      <span className="review-label">Name:</span>
                      <span className="review-value">{shippingInfo.firstName} {shippingInfo.lastName}</span>
                    </div>
                    <div className="review-info">
                      <span className="review-label">Email:</span>
                      <span className="review-value">{shippingInfo.email}</span>
                    </div>
                    <div className="review-info">
                      <span className="review-label">Phone:</span>
                      <span className="review-value">{shippingInfo.phone}</span>
                    </div>
                    <div className="review-info">
                      <span className="review-label">Service Type:</span>
                      <span className="review-value">Digital Subscription (No Shipping Required)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="review-payment-info mt-4">
                <h3 className="review-section-title">Payment Information</h3>

                <div className="review-info-grid">
                  <div className="review-info">
                    <span className="review-label">Payment Method:</span>
                    <span className="review-value">
                      {paymentMethod === 'creditCard' && 'Credit Card'}
                      {paymentMethod === 'paypal' && 'PayPal'}
                      {paymentMethod === 'applePay' && 'Apple Pay'}
                      {paymentMethod === 'googlePay' && 'Google Pay'}
                    </span>
                  </div>

                  {paymentMethod === 'creditCard' && (
                    <div className="review-info">
                      <span className="review-label">Card Number:</span>
                      <span className="review-value">
                        **** **** **** {paymentInfo.cardNumber.slice(-4) || '****'}
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="review-info">
                      <span className="review-label">PayPal Email:</span>
                      <span className="review-value">
                        {paymentInfo.paypalEmail || 'Not provided'}
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'applePay' && (
                    <div className="review-info">
                      <span className="review-label">Apple ID:</span>
                      <span className="review-value">
                        {paymentInfo.applePayIdentifier || 'Not provided'}
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'googlePay' && (
                    <div className="review-info">
                      <span className="review-label">Google Account:</span>
                      <span className="review-value">
                        {paymentInfo.googlePayEmail || 'Not provided'}
                      </span>
                    </div>
                  )}

                  <div className="review-info">
                    <span className="review-label">Billing Address:</span>
                    <span className="review-value">
                      {paymentInfo.sameAsShipping
                        ? `Same as shipping address`
                        : `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}, ${billingInfo.country}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms and conditions checkbox moved to payment step */}
            </div>
          )}

          {/* Navigation Buttons - Only show for steps 2-4 */}
          {currentStep > 1 && (
            <div className="step-buttons">
              <Button
                variant="outline-light"
                className="prev-step-btn"
                onClick={handlePrevStep}
              >
                <i className="fas fa-arrow-left"></i> Back
              </Button>

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  className={`next-step-btn ${currentStep === 3 && !paymentCompleted ? 'disabled-btn' : 'enabled-btn'}`}
                  onClick={handleNextStep}
                  disabled={currentStep === 3 && !paymentCompleted}
                  title={currentStep === 3 && !paymentCompleted ? "Please complete payment before continuing" : "Continue to review your order"}
                >
                  {currentStep === 3 && !paymentCompleted ? (
                    <>Payment Required <i className="fas fa-lock"></i></>
                  ) : (
                    <>Continue <i className="fas fa-arrow-right"></i></>
                  )}
                </Button>
              ) : (
                <Button
                  variant="success"
                  className="place-order-btn"
                  onClick={handleFinalOrderPlacement}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {cartItems.some(item => item.isSubscription) ? 'Complete Subscription' : 'Place Order'} <i className="fas fa-check"></i>
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Checkout;
