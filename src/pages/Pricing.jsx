import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { addToCart, clearCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useModal } from '../hooks/useModal';

import 'react-toastify/dist/ReactToastify.css';
import '../components/SubscriptionConfirmModal.css';
import './Pricing.css';

const Pricing = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { openSubscriptionModal } = useModal();


  // State for current subscription
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // State for pending package - used when storing data before showing modal
  // eslint-disable-next-line no-unused-vars
  const [pendingPackage, setPendingPackage] = useState({ name: '', price: 0 });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Add animation class to pricing title
    const titleElement = document.querySelector('.pricing-title');
    if (titleElement) {
      setTimeout(() => {
        titleElement.classList.add('animated');
      }, 10);
    }

    // Check if user has an active subscription
    if (currentUser) {
      // Get all users to find the complete user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userData = users.find(user => user.id === currentUser.id) || {};

      // Check for subscriptions array
      if (userData.subscriptions && Array.isArray(userData.subscriptions)) {
        // Find package subscription (not offer)
        const packageSubscription = userData.subscriptions.find(sub => sub.type === 'package');
        if (packageSubscription) {
          setCurrentSubscription(packageSubscription);
        }
      }
      // Check for legacy subscription
      else if (userData.subscriptionStatus && userData.subscriptionPackage) {
        // Check if it's not an offer
        const specialOffers = ['Summer Body Challenge', 'Couple\'s Package', 'First Month Free'];
        const isOffer = specialOffers.some(offer => userData.subscriptionPackage.includes(offer));

        if (!isOffer) {
          setCurrentSubscription({
            name: userData.subscriptionPackage,
            date: userData.subscriptionDate || new Date().toISOString()
          });
        }
      }
    }
  }, [currentUser]);

  const handleSubscribe = async (packageName, price) => {
    if (!currentUser) {
      // Redirect to signup if not logged in
      navigate('/signup');
      return;
    }

    // Check if user is already subscribed to a package
    if (currentSubscription && currentSubscription.name !== packageName) {
      // Store pending package data
      setPendingPackage({ name: packageName, price: price });

      // Use the Modal Context to show the confirmation modal
      openSubscriptionModal(
        packageName,
        currentSubscription.name,
        false, // isOffer = false (this is a regular package)
        () => proceedWithSubscription(packageName, price)
      );
      return;
    }

    // If no confirmation needed or user is subscribing to the same package
    proceedWithSubscription(packageName, price);
  };

  // Function to handle the actual subscription process
  const proceedWithSubscription = (packageName, price) => {
    try {
      // Clear the cart first to ensure only the subscription package is in it
      dispatch(clearCart());

      // Create a subscription product object
      const subscriptionProduct = {
        id: `subscription-${Date.now()}`,
        name: packageName,
        price: price,
        image: '/images/subscription.jpg',
        category: 'Subscription',
        description: `${packageName} subscription package`,
        isSubscription: true
      };

      // Add the subscription to the cart
      dispatch(addToCart(subscriptionProduct));

      // Show a toast notification
      toast.info(`Adding ${packageName} to cart...`);

      // Redirect to checkout page after a short delay
      setTimeout(() => {
        navigate('/checkout');
      }, 1500);
    } catch (error) {
      toast.error('Failed to process subscription. Please try again.');
      console.error('Subscription error:', error);
    }
  };

  return (
    <section className="pricing-section">
      <ToastContainer />
      <Container>
        <div className="pricing-header">
          <h1 className="pricing-title">PRICING</h1>
          {currentSubscription && (
            <div className="current-subscription-note">
              <i className="fas fa-info-circle me-2"></i>
              You are currently subscribed to <strong>{currentSubscription.name}</strong>
            </div>
          )}
        </div>

        <div className="pricing-container">
          {/* Basic Package */}
          <div className={`pricing-card ${currentSubscription && currentSubscription.name === 'Basic Package' ? 'current-subscription' : ''}`}>
            {currentSubscription && currentSubscription.name === 'Basic Package' && (
              <div className="current-badge">Current Plan</div>
            )}
            <div className="pricing-card-header">
              <h3 className="package-name">Basic Package</h3>
              <span className="price">$24/month</span>
            </div>
            <div className="pricing-card-body">
              <ul className="features-list">
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Access to Gym Facilities</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Group Fitness Classes</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Initial Fitness Assessment</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faTimes} className="feature-icon unavailable" />
                  <span>Locker Room and Showers</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faTimes} className="feature-icon unavailable" />
                  <span>Free Wi-Fi</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faTimes} className="feature-icon unavailable" />
                  <span>Member Support</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faTimes} className="feature-icon unavailable" />
                  <span>Nutritional Counseling</span>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe('Basic Package', 24)}
                className="pricing-btn"
                disabled={currentSubscription && currentSubscription.name === 'Basic Package'}
              >
                {currentSubscription && currentSubscription.name === 'Basic Package' ? 'Current Plan' : 'Subscribe Now'}
              </Button>
            </div>
          </div>

          {/* Standard Package */}
          <div className={`pricing-card featured ${currentSubscription && currentSubscription.name === 'Standard Package' ? 'current-subscription' : ''}`}>
            {currentSubscription && currentSubscription.name === 'Standard Package' && (
              <div className="current-badge">Current Plan</div>
            )}
            <div className="pricing-card-header">
              <h3 className="package-name">Standard Package</h3>
              <span className="price">$48/month</span>
            </div>
            <div className="pricing-card-body">
              <ul className="features-list">
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Access to Gym Facilities</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Group Fitness Classes</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Initial Fitness Assessment</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Locker Room and Showers</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Free Wi-Fi</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faTimes} className="feature-icon unavailable" />
                  <span>Member Support</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faTimes} className="feature-icon unavailable" />
                  <span>Nutritional Counseling</span>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe('Standard Package', 48)}
                className="pricing-btn"
                disabled={currentSubscription && currentSubscription.name === 'Standard Package'}
              >
                {currentSubscription && currentSubscription.name === 'Standard Package' ? 'Current Plan' : 'Subscribe Now'}
              </Button>
            </div>
          </div>

          {/* Premium Package */}
          <div className={`pricing-card ${currentSubscription && currentSubscription.name === 'Premium Package' ? 'current-subscription' : ''}`}>
            {currentSubscription && currentSubscription.name === 'Premium Package' && (
              <div className="current-badge">Current Plan</div>
            )}
            <div className="pricing-card-header">
              <h3 className="package-name">Premium Package</h3>
              <span className="price">$56/month</span>
            </div>
            <div className="pricing-card-body">
              <ul className="features-list">
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Access to Gym Facilities</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Group Fitness Classes</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Initial Fitness Assessment</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Locker Room and Showers</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Free Wi-Fi</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Member Support</span>
                </li>
                <li className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="feature-icon" />
                  <span>Nutritional Counseling</span>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe('Premium Package', 56)}
                className="pricing-btn"
                disabled={currentSubscription && currentSubscription.name === 'Premium Package'}
              >
                {currentSubscription && currentSubscription.name === 'Premium Package' ? 'Current Plan' : 'Subscribe Now'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Pricing;