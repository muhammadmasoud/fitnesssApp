import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, ProgressBar, Button, Carousel, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { ToastContainer } from 'react-toastify';
import CustomToast from '../components/CustomToast';
import DynamicBackground from '../components/DynamicBackground';

import './OrderTracking.css';
import ordertrackingBg from '../assets/optimized/order-tracking.jpg';

const OrderTracking = () => {
  const currentUser = useSelector(selectCurrentUser);
  const carouselRef = useRef(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingProgress, setTrackingProgress] = useState(35); // Initial progress (Processing)
  // State for storing user orders
  const [allOrders, setAllOrders] = useState([]);
  // State for tracking which order is currently being viewed
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  // State for manual order tracking
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Function to search for an order by tracking number
  const searchOrder = () => {
    if (!trackingNumber.trim()) {
      setSearchError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      // Get the order map from localStorage
      const savedOrderMap = localStorage.getItem('orderMap');
      if (!savedOrderMap) {
        setIsSearching(false);
        setSearchError('No orders found with this tracking number');
        return;
      }

      const orderMap = JSON.parse(savedOrderMap);
      const order = orderMap[trackingNumber.trim()];

      if (!order) {
        setIsSearching(false);
        setSearchError('No order found with this tracking number');
        return;
      }

      // Set the order details
      setOrderDetails(order);
      setIsSearching(false);
      CustomToast.success('Order found!');
    } catch (error) {
      console.error('Error searching for order:', error);
      setIsSearching(false);
      setSearchError('Error searching for order. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchOrder();
  };

  // Toggle manual search form
  const toggleManualSearch = () => {
    setShowManualSearch(!showManualSearch);
    setTrackingNumber('');
    setSearchError('');
  };

  // Function to load and process user orders - supporting multiple orders
  const loadUserOrders = useCallback(() => {
    console.log("Loading user orders");

    if (!currentUser) {
      console.log("No user logged in, cannot load orders");
      return;
    }

    try {
      console.log("Loading orders for user ID:", currentUser.id);

      // Get user-specific orders from localStorage
      const userOrdersKey = `userOrders_${currentUser.id}`;
      const savedOrdersJson = localStorage.getItem(userOrdersKey);

      if (!savedOrdersJson) {
        console.log("No saved orders found in localStorage for this user");
        setAllOrders([]);
        setOrderDetails(null);
        setActiveOrderIndex(0);
        CustomToast.info('You have no orders to track');
        return;
      }

      // Parse the saved orders
      let parsedOrders;
      try {
        parsedOrders = JSON.parse(savedOrdersJson);
        console.log(`Successfully parsed ${parsedOrders.length} orders from localStorage`);
      } catch (parseError) {
        console.error("Error parsing saved orders:", parseError);
        CustomToast.error('Error loading your orders');
        setAllOrders([]);
        setOrderDetails(null);
        setActiveOrderIndex(0);
        return;
      }

      if (!Array.isArray(parsedOrders)) {
        console.error("Parsed orders is not an array:", parsedOrders);
        CustomToast.error('Invalid order data format');
        setAllOrders([]);
        setOrderDetails(null);
        setActiveOrderIndex(0);
        return;
      }

      // Validate each order has the required fields
      const validOrders = parsedOrders.filter(order => {
        if (!order || !order.items || !Array.isArray(order.items) || !order.trackingNumber) {
          console.error("Invalid order format:", order);
          return false;
        }
        return true;
      });

      // Strictly filter orders to only include those belonging to the current user
      const userOrders = validOrders.filter(order => order.userId === currentUser.id);

      console.log(`Found ${userOrders.length} valid orders for current user`);

      // Ensure all orders have the correct user ID (should already be set, but just in case)
      userOrders.forEach(order => {
        order.userId = currentUser.id;
      });

      // Clear old userOrders data if it exists (migration step)
      if (localStorage.getItem('userOrders')) {
        console.log("Removing legacy userOrders data");
        localStorage.removeItem('userOrders');
      }

      if (userOrders.length > 0) {
        // Sort orders by date (newest first)
        const sortedOrders = [...userOrders].sort((a, b) =>
          new Date(b.orderDate) - new Date(a.orderDate)
        );

        // Store all sorted orders in state
        setAllOrders(sortedOrders);

        // Set the active order index to 0 (most recent order)
        setActiveOrderIndex(0);

        // Set the most recent order as the order details
        setOrderDetails(sortedOrders[0]);

        // Save the orders back to localStorage
        localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));

        // Show success message
        CustomToast.success('Order tracking information loaded successfully');
      } else {
        console.log("No valid orders found for user");
        setAllOrders([]);
        setOrderDetails(null);
        setActiveOrderIndex(0);
        CustomToast.info('You have no orders to track');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      CustomToast.error('Error loading order details');
      setAllOrders([]);
      setOrderDetails(null);
      setActiveOrderIndex(0);
    }
  }, [currentUser]);

  // Check for new completed orders in sessionStorage
  const checkForNewOrders = useCallback(() => {
    // Get completed order from sessionStorage
    const completedOrderJson = sessionStorage.getItem('completedOrder');
    if (!completedOrderJson) {
      // No new orders to process
      return;
    }

    try {
      console.log("Found new completed order in sessionStorage");

      // Parse the order JSON
      let completedOrder;
      try {
        completedOrder = JSON.parse(completedOrderJson);
      } catch (parseError) {
        console.error("Failed to parse completed order JSON:", parseError);
        sessionStorage.removeItem('completedOrder');
        return;
      }

      // Validate the order has required fields
      if (!completedOrder || !completedOrder.items || !completedOrder.trackingNumber) {
        console.error("Invalid order format");
        sessionStorage.removeItem('completedOrder');
        return;
      }

      // Only process if user is logged in
      if (!currentUser) {
        console.log("User not logged in, cannot process order");
        return;
      }

      // Verify the order belongs to the current user
      if (completedOrder.userId && completedOrder.userId !== currentUser.id) {
        console.log("Order belongs to a different user, not processing");
        return;
      }

      // Ensure the order has the correct user ID
      completedOrder.userId = currentUser.id;

      // Get existing orders from localStorage
      const userOrdersKey = `userOrders_${currentUser.id}`;
      const savedOrdersJson = localStorage.getItem(userOrdersKey);
      let existingOrders = [];

      if (savedOrdersJson) {
        try {
          existingOrders = JSON.parse(savedOrdersJson);
          if (!Array.isArray(existingOrders)) {
            existingOrders = [];
          }
        } catch (error) {
          console.error("Failed to parse existing orders", error);
        }
      }

      // Check if this order already exists to avoid duplicates
      const isDuplicate = existingOrders.some(order =>
        order.trackingNumber === completedOrder.trackingNumber
      );

      if (isDuplicate) {
        console.log("Order already exists in user's orders");
      } else {
        console.log("Adding new order to user's orders");

        // Add the new order to existing orders
        const updatedOrders = [...existingOrders, completedOrder];

        // Sort orders by date (newest first)
        const sortedOrders = [...updatedOrders].sort((a, b) =>
          new Date(b.orderDate) - new Date(a.orderDate)
        );

        // Save updated orders back to localStorage
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));

        // Update state with all sorted orders
        setAllOrders(sortedOrders);

        // Set the new order as the current order details (most recent)
        setOrderDetails(completedOrder);

        // Set active order index to 0 (the new order will be the most recent)
        setActiveOrderIndex(0);

        // Show success message to user
        CustomToast.success('New order added to your tracking');
      }

      // Clear the completed order from sessionStorage
      sessionStorage.removeItem('completedOrder');

    } catch (error) {
      console.error('Error processing new order:', error);
      CustomToast.error('Error processing your new order');

      // Still clear the sessionStorage to prevent repeated errors
      sessionStorage.removeItem('completedOrder');
    }
  }, [currentUser]);

  // Load order details from storage
  useEffect(() => {
    console.log("OrderTracking component mounted or currentUser changed");

    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Add a class to the body to ensure proper spacing
    document.body.classList.add('order-tracking-page');

    // If user is logged in, load their order details
    if (currentUser) {
      console.log("User is logged in, loading orders");
      loadUserOrders();
    }

    // Check for new orders
    checkForNewOrders();

    // Set up an interval to check for new orders periodically
    const newOrderCheckInterval = setInterval(() => {
      checkForNewOrders();
    }, 1000); // Check for new orders every second

    // Cleanup function
    return () => {
      console.log("Cleaning up OrderTracking component");
      document.body.classList.remove('order-tracking-page');
      clearInterval(newOrderCheckInterval);
    };
  }, [currentUser, loadUserOrders, checkForNewOrders]); // Include all dependencies

  // Update tracking progress when order details change
  useEffect(() => {
    if (orderDetails) {
      // Always set to Processing (40%) as requested
      setTrackingProgress(40);
    } else {
      setTrackingProgress(40); // Default to Processing
    }
  }, [orderDetails]); // Re-run when orderDetails changes

  // Add a separate effect to listen for storage changes
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'completedOrder' || e.key === `userOrders_${currentUser?.id}`) {
        if (currentUser) {
          loadUserOrders();
        }
        checkForNewOrders();
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Also manually check for new orders when this effect runs
    if (currentUser) {
      checkForNewOrders();
    }

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser, loadUserOrders, checkForNewOrders]);

  // No longer needed as we generate the tracking number inline

  // Function to handle switching between orders
  const handleOrderChange = (index) => {
    if (index >= 0 && index < allOrders.length) {
      setActiveOrderIndex(index);
      setOrderDetails(allOrders[index]);
    }
  };

  // Format date for estimated delivery
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);

    // Set delivery date based on shipping method
    if (orderDetails && orderDetails.shippingMethod) {
      switch(orderDetails.shippingMethod) {
        case 'express':
          deliveryDate.setDate(today.getDate() + 3); // Express delivery in 3 days
          break;
        case 'overnight':
          deliveryDate.setDate(today.getDate() + 1); // Overnight delivery next day
          break;
        default:
          deliveryDate.setDate(today.getDate() + 7); // Standard delivery in 7 days
      }
    } else {
      deliveryDate.setDate(today.getDate() + 7); // Default to standard delivery
    }

    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get current status based on progress
  const getOrderStatus = () => {
    // Always return "Processing" status
    return 'Processing';
  };

  // Get progress percentage based on status
  const getProgressPercentage = () => {
    // Return the actual tracking progress value
    // This ensures the progress bar matches the status exactly
    return trackingProgress;
  };

  // Get shipping method text
  const getShippingMethodText = () => {
    if (!orderDetails || !orderDetails.shippingMethod) return 'Standard Shipping';

    switch(orderDetails.shippingMethod) {
      case 'express': return 'Express Shipping';
      case 'overnight': return 'Overnight Shipping';
      default: return 'Standard Shipping';
    }
  };

  // Get shipping cost text
  const getShippingCostText = () => {
    if (!orderDetails) return 'Free';

    if (orderDetails.shippingCost && orderDetails.shippingCost > 0) {
      return `$${orderDetails.shippingCost.toFixed(2)}`;
    }

    return 'Free';
  };

  return (
    <DynamicBackground
      imageUrl={ordertrackingBg}
      className="tracking-page"
      style={{
        justifyContent: 'flex-start', // Override the default center alignment
        alignItems: 'center',
        paddingTop: '220px',
        paddingBottom: '100px',
        minHeight: 'calc(100vh - 60px)' // Account for the announcement bar
      }}
    >
      <ToastContainer />

      <Container fluid className="tracking-container">
        <div className="tracking-content">
          <h1 className="tracking-title ">
            Track Your Order
          </h1>

          {/* Tracking form for non-logged-in users removed */}

          {currentUser && !orderDetails && (
            <div className="no-orders-container ">
              <div className="no-orders-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <h2 className="no-orders-title">No Orders Found</h2>
              <p className="no-orders-message">
                You don&apos;t have any orders to track yet. Start shopping to see your orders here!
              </p>
              <div className="no-orders-actions">
                <Button
                  variant="primary"
                  as={Link}
                  to="/products"
                  className="shop-now-btn me-3"
                >
                  <i className="fas fa-shopping-bag me-2"></i> Shop Now
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={toggleManualSearch}
                  className="manual-search-btn"
                >
                  <i className="fas fa-search me-2"></i>
                  {showManualSearch ? 'Hide Search' : 'Search by Order Number'}
                </Button>
              </div>

              {showManualSearch && (
                <div className="manual-tracking-form-container  mt-4">
                  <p className="tracking-form-intro">
                    Can&apos;t find your order? Enter your order number to track it manually
                  </p>
                  <Form className="tracking-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Order Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. FT30221999"
                        className="tracking-input"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        required
                      />
                    </Form.Group>
                    {searchError && <div className="error-message">{searchError}</div>}
                    <Button
                      variant="primary"
                      type="submit"
                      className="tracking-submit-btn"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        'Track Order'
                      )}
                    </Button>
                  </Form>
                </div>
              )}
            </div>
          )}

          {orderDetails && (
            <div className="tracking-details ">
              {/* Order Navigation Tabs - Only show if there are multiple orders */}
              {allOrders.length > 1 && (
                <div className="order-navigation">
                  <h3 className="order-nav-title">Your Orders</h3>
                  <Nav variant="tabs" className="order-tabs">
                    {allOrders.map((order, index) => (
                      <Nav.Item key={order.trackingNumber}>
                        <Nav.Link
                          className={activeOrderIndex === index ? 'active' : ''}
                          onClick={() => handleOrderChange(index)}
                        >
                          Order #{order.trackingNumber}
                          <div className="order-tab-date">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                </div>
              )}

              <div className="tracking-card-header">
                <h2>Order #{orderDetails.trackingNumber}</h2>
                <span className="order-date">
                  Placed on {new Date(orderDetails.orderDate).toLocaleDateString()}
                </span>
              </div>

              <div className="tracking-status">
                <h3>Status: <span className="status-text">{getOrderStatus()}</span></h3>
                <div className="progress-container">
                  <ProgressBar
                    now={getProgressPercentage()}
                    variant="info"
                    className="tracking-progress"
                    animated
                    style={{ height: '12px' }}
                  />
                </div>
                <div className="tracking-milestones">
                  <div className={`milestone ${trackingProgress >= 15 ? 'active' : ''}`}>
                    <div className={`milestone-dot ${getOrderStatus() === 'Order Confirmed' ? 'current' : ''}`}>1</div>
                    <span>Confirmed</span>
                  </div>
                  <div className={`milestone ${trackingProgress >= 40 ? 'active' : ''}`}>
                    <div className={`milestone-dot ${getOrderStatus() === 'Processing' ? 'current' : ''}`}>2</div>
                    <span>Processing</span>
                  </div>
                  <div className={`milestone ${trackingProgress >= 70 ? 'active' : ''}`}>
                    <div className={`milestone-dot ${getOrderStatus() === 'Shipped' ? 'current' : ''}`}>3</div>
                    <span>Shipped</span>
                  </div>
                  <div className={`milestone ${trackingProgress >= 100 ? 'active' : ''}`}>
                    <div className={`milestone-dot ${getOrderStatus() === 'Delivered' ? 'current' : ''}`}>4</div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              <div className="delivery-info">
                <h3>Estimated Delivery</h3>
                <p className="delivery-date">{getEstimatedDelivery()}</p>
              </div>

              <Row className="mt-4">
                <Col md={6}>
                  <div className="shipping-details">
                    <h3>Shipping Address</h3>
                    <p>
                      {orderDetails.shippingInfo.firstName} {orderDetails.shippingInfo.lastName}<br />
                      {orderDetails.shippingInfo.address}<br />
                      {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zipCode}<br />
                      {orderDetails.shippingInfo.country}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="payment-details">
                    <h3>Payment Information</h3>
                    <p>
                      Method: {orderDetails.paymentMethod || 'Credit Card'}<br />
                      Total: <span className="total-amount">${orderDetails.totalAmount.toFixed(2)}</span>
                    </p>
                  </div>
                </Col>
              </Row>

              <div className="order-items-summary">
                <h3 className="order-summary-title">Ordered Items</h3>
                <div className="order-items">
                  {orderDetails.items.length > 3 ? (
                    <Carousel
                      ref={carouselRef}
                      className="items-carousel"
                      indicators={false}
                      interval={null}
                      controls={orderDetails.items.length > 1}
                    >
                      {/* Group items into sets of 3 for the carousel */}
                      {Array.from({ length: Math.ceil(orderDetails.items.length / 3) }).map((_, index) => (
                        <Carousel.Item key={index}>
                          <div className="carousel-items-group">
                            {orderDetails.items.slice(index * 3, index * 3 + 3).map(item => (
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
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    // If 3 or fewer items, display them normally
                    orderDetails.items.map(item => (
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
                    ))
                  )}
                </div>

                <div className="order-summary-totals mt-4">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${orderDetails.subtotal ? orderDetails.subtotal.toFixed(2) : (orderDetails.totalAmount - orderDetails.shippingCost).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping ({getShippingMethodText()}):</span>
                    <span>{getShippingCostText()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (8.5%):</span>
                    <span>${orderDetails.tax ? orderDetails.tax.toFixed(2) : ((orderDetails.totalAmount - orderDetails.shippingCost) * 0.085).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="tracking-card-footer">
                <Button
                  variant="outline-light"
                  as={Link}
                  to={currentUser ? "/authenticated-home" : "/"}
                  className="back-to-home-btn"
                >
                  <i className="fas fa-home me-2"></i> Back to Home
                </Button>
                <Button
                  variant="primary"
                  as={Link}
                  to="/products"
                  className="continue-shopping-btn"
                >
                  <i className="fas fa-shopping-bag me-2"></i> Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </DynamicBackground>
  );
};

export default OrderTracking;
