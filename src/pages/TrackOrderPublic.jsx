import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ProgressBar, Button, Carousel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CustomToast from '../components/CustomToast';
import DynamicBackground from '../components/DynamicBackground';

import './OrderTracking.css';
import './TrackOrderPublic.css';
import trackingBg from '../assets/optimized/order-tracking.jpg';

const TrackOrderPublic = () => {
  const carouselRef = useRef(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingProgress] = useState(35); // Initial progress (Processing)
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Load order details from storage
  useEffect(() => {
    console.log("TrackOrderPublic component mounted");

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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
    if (trackingProgress < 25) return 'Order Confirmed';
    if (trackingProgress < 50) return 'Processing';
    if (trackingProgress < 75) return 'Shipped';
    return 'Delivered';
  };

  // Get progress percentage based on status
  const getProgressPercentage = () => {
    const status = getOrderStatus();
    switch(status) {
      case 'Order Confirmed': return 12.5;
      case 'Processing': return 37.5;
      case 'Shipped': return 62.5;
      case 'Delivered': return 100;
      default: return 12.5;
    }
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
    <DynamicBackground imageUrl={trackingBg} className="tracking-page">
      <ToastContainer />

      <Container className="tracking-container">
        <div className="tracking-content">
          <h1 className="tracking-title ">
            Track Your Order
          </h1>

          {/* Tracking form for non-logged-in users */}
          {!orderDetails && (
            <div className="tracking-form-container ">
              <p className="tracking-form-intro">
                Enter your order number to track your shipment
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
              <div className="tracking-form-footer">
                <p>Don&apos;t have an account? <Link to="/signup">Sign up</Link> or <Link to="/login">sign in</Link> to easily track all your orders.</p>
              </div>
            </div>
          )}

          {orderDetails && (
            <div className="tracking-details ">
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
                  />
                </div>
                <div className="tracking-milestones">
                  <div className={`milestone ${getOrderStatus() === 'Order Confirmed' || getOrderStatus() === 'Processing' || getOrderStatus() === 'Shipped' || getOrderStatus() === 'Delivered' ? 'active' : ''}`}>
                    <div className="milestone-dot">1</div>
                    <span>Confirmed</span>
                  </div>
                  <div className={`milestone ${getOrderStatus() === 'Processing' || getOrderStatus() === 'Shipped' || getOrderStatus() === 'Delivered' ? 'active' : ''}`}>
                    <div className="milestone-dot">2</div>
                    <span>Processing</span>
                  </div>
                  <div className={`milestone ${getOrderStatus() === 'Shipped' || getOrderStatus() === 'Delivered' ? 'active' : ''}`}>
                    <div className="milestone-dot">3</div>
                    <span>Shipped</span>
                  </div>
                  <div className={`milestone ${getOrderStatus() === 'Delivered' ? 'active' : ''}`}>
                    <div className="milestone-dot">4</div>
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
                  onClick={() => setOrderDetails(null)}
                  className="back-to-search-btn"
                >
                  <i className="fas fa-search me-2"></i> Track Another Order
                </Button>
                <div className="auth-buttons-container">
                  <Button
                    variant="primary"
                    as={Link}
                    to="/signup"
                    className="signup-btn"
                  >
                    <i className="fas fa-user-plus me-2"></i> Sign Up
                  </Button>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/login"
                    className="login-btn-track"
                  >
                    <i className="fas fa-sign-in-alt me-2"></i> Log In
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </DynamicBackground>
  );
};

export default TrackOrderPublic;
