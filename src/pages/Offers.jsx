import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { addToCart, clearCart } from '../store/slices/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useModal } from '../hooks/useModal';

import 'react-toastify/dist/ReactToastify.css';

import '../components/SubscriptionConfirmModal.css';
import './Offers.css';

const Offers = () => {
  const [loaded, setLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { openSubscriptionModal } = useModal();


  // State for current subscription
  const [currentOffer, setCurrentOffer] = useState(null);

  // State for pending offer - used when storing data before showing modal
  // eslint-disable-next-line no-unused-vars
  const [pendingOffer, setPendingOffer] = useState({ name: '', price: 0 });

  useEffect(() => {
    setLoaded(true);

    // Add cleanup to reset any animations when component unmounts
    return () => {
      setHoveredCard(null);
    };
  }, []);

  useEffect(() => {
    // Check if user has an active offer subscription
    if (currentUser) {
      // Get all users to find the complete user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userData = users.find(user => user.id === currentUser.id) || {};

      // Check for subscriptions array
      if (userData.subscriptions && Array.isArray(userData.subscriptions)) {
        // Find offer subscription
        const offerSubscription = userData.subscriptions.find(sub => sub.type === 'offer');
        if (offerSubscription) {
          setCurrentOffer(offerSubscription);
        }
      }
      // Check for legacy subscription
      else if (userData.subscriptionStatus && userData.subscriptionPackage) {
        // Check if it's an offer
        const specialOffers = ['Summer Body Challenge', 'Couple\'s Package', 'First Month Free'];
        const isOffer = specialOffers.some(offer => userData.subscriptionPackage.includes(offer));

        if (isOffer) {
          setCurrentOffer({
            name: userData.subscriptionPackage,
            date: userData.subscriptionDate || new Date().toISOString()
          });
        }
      }
    }
  }, [currentUser]);

  const handleSubscribe = async (offerName, price) => {
    if (!currentUser) {
      // Redirect to signup if not logged in
      navigate('/signup');
      return;
    }

    // Check if user is already subscribed to an offer
    if (currentOffer && currentOffer.name !== offerName) {
      // Store pending offer data
      setPendingOffer({ name: offerName, price: price });

      // Use the Modal Context to show the confirmation modal
      openSubscriptionModal(
        offerName,
        currentOffer.name,
        true, // isOffer = true
        () => proceedWithSubscription(offerName, price)
      );
      return;
    }

    // If no confirmation needed or user is subscribing to the same offer
    proceedWithSubscription(offerName, price);
  };

  // Function to handle the actual subscription process
  const proceedWithSubscription = (offerName, price) => {
    try {
      // Clear the cart first to ensure only the subscription package is in it
      dispatch(clearCart());

      // Create a subscription product object
      const subscriptionProduct = {
        id: `offer-${Date.now()}`,
        name: offerName,
        price: price,
        image: '/images/subscription.jpg',
        category: 'Special Offer',
        description: `${offerName} special offer`,
        isSubscription: true
      };

      // Add the subscription to the cart
      dispatch(addToCart(subscriptionProduct));

      // Show a toast notification
      toast.info(`Adding ${offerName} to cart...`);

      // Redirect to checkout page after a short delay
      setTimeout(() => {
        navigate('/checkout');
      }, 1500);
    } catch (error) {
      toast.error('Failed to process offer. Please try again.');
      console.error('Subscription error:', error);
    }
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div className={`offers-page ${loaded ? 'loaded' : ''}`}>
      <ToastContainer />
      <div className="offers-content-wrapper">
        <div className="offers-header">
          <h1 className="offers-title ">Special Offers</h1>
          <p className="offers-subtitle  animate__delay-1s">
            Exclusive deals to help you achieve your fitness goals
          </p>
          {currentOffer && (
            <div className="current-offer-note  animate__delay-1s">
              <i className="fas fa-info-circle me-2"></i>
              You are currently subscribed to <strong>{currentOffer.name}</strong>
            </div>
          )}
        </div>

        <div className="offers-container">
          <div
            className={`special-offer-card ${hoveredCard === 0 ? 'card-hovered' : ''} ${currentOffer && currentOffer.name === 'Summer Body Challenge' ? 'current-offer' : ''}`}
            onMouseEnter={() => handleCardHover(0)}
            onMouseLeave={handleCardLeave}
          >
            {currentOffer && currentOffer.name === 'Summer Body Challenge' && (
              <div className="current-offer-badge">Current Offer</div>
            )}
            <div className="card-glow"></div>
            <div className="special-offer-badge  animate__infinite">Limited Time</div>
            <h2 className="special-offer-heading">Summer Body Challenge</h2>
            <p className="special-offer-description">Join our 8-week transformation program and get ready for summer. Includes personalized workout plans and nutrition guidance.</p>
            <div className="special-offer-price">
              <span className="original-price">$299</span>
              <span className="discounted-price price-animation">$199</span>
            </div>
            <button
              className="special-offer-button"
              onClick={() => handleSubscribe('Summer Body Challenge', 199)}
              disabled={currentOffer && currentOffer.name === 'Summer Body Challenge'}
            >
              <span className="button-text">
                {currentOffer && currentOffer.name === 'Summer Body Challenge' ? 'Current Offer' : 'Claim Offer'}
              </span>
              <span className="button-shine"></span>
            </button>
          </div>

          <div
            className={`special-offer-card ${hoveredCard === 1 ? 'card-hovered' : ''} ${currentOffer && currentOffer.name === 'Couple\'s Package' ? 'current-offer' : ''}`}
            onMouseEnter={() => handleCardHover(1)}
            onMouseLeave={handleCardLeave}
          >
            {currentOffer && currentOffer.name === 'Couple\'s Package' && (
              <div className="current-offer-badge">Current Offer</div>
            )}
            <div className="card-glow"></div>
            <div className="special-offer-badge  animate__infinite">Most Popular</div>
            <h2 className="special-offer-heading">Couple&apos;s Package</h2>
            <p className="special-offer-description">Train together, achieve together. Special package for couples with shared personal training sessions.</p>
            <div className="special-offer-price">
              <span className="original-price">$399</span>
              <span className="discounted-price price-animation">$299</span>
            </div>
            <button
              className="special-offer-button"
              onClick={() => handleSubscribe('Couple\'s Package', 299)}
              disabled={currentOffer && currentOffer.name === 'Couple\'s Package'}
            >
              <span className="button-text">
                {currentOffer && currentOffer.name === 'Couple\'s Package' ? 'Current Offer' : 'Claim Offer'}
              </span>
              <span className="button-shine"></span>
            </button>
          </div>

          <div
            className={`special-offer-card ${hoveredCard === 2 ? 'card-hovered' : ''} ${currentOffer && currentOffer.name === 'First Month Free' ? 'current-offer' : ''}`}
            onMouseEnter={() => handleCardHover(2)}
            onMouseLeave={handleCardLeave}
          >
            {currentOffer && currentOffer.name === 'First Month Free' && (
              <div className="current-offer-badge">Current Offer</div>
            )}
            <div className="card-glow"></div>
            <div className="special-offer-badge  animate__infinite">New Members</div>
            <h2 className="special-offer-heading">First Month Free</h2>
            <p className="special-offer-description">Sign up for a 12-month membership and get your first month absolutely free. Includes all premium facilities.</p>
            <div className="special-offer-price">
              <span className="original-price">$59/month</span>
              <span className="discounted-price price-animation">$49/month</span>
            </div>
            <button
              className="special-offer-button"
              onClick={() => handleSubscribe('First Month Free', 49)}
              disabled={currentOffer && currentOffer.name === 'First Month Free'}
            >
              <span className="button-text">
                {currentOffer && currentOffer.name === 'First Month Free' ? 'Current Offer' : 'Claim Offer'}
              </span>
              <span className="button-shine"></span>
            </button>
          </div>
        </div>

        <div className="offers-footer  animate__delay-2s">
          <p>All offers are subject to terms and conditions. Limited time only.</p>
          <p className="subscription-policy">You can have one subscription plan and one special offer active at a time.</p>
        </div>
      </div>
    </div>
  );
};

export default Offers;
