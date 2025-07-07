import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Modal, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

const Home = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomePackage, setWelcomePackage] = useState('');

  useEffect(() => {
    // Check for welcome message in sessionStorage
    const welcomeMessageJson = sessionStorage.getItem('welcomeMessage');
    if (welcomeMessageJson) {
      try {
        const welcomeMessage = JSON.parse(welcomeMessageJson);

        // Check if the message is recent (within the last 5 minutes)
        const now = new Date().getTime();
        const messageTime = welcomeMessage.timestamp || 0;
        const fiveMinutesInMs = 5 * 60 * 1000;

        if (welcomeMessage.show && (now - messageTime < fiveMinutesInMs)) {
          // Show the welcome modal
          setWelcomePackage(welcomeMessage.package || 'Fitness Package');
          setShowWelcomeModal(true);

          // Clear the welcome message from sessionStorage
          sessionStorage.removeItem('welcomeMessage');
        }
      } catch (error) {
        console.error('Error parsing welcome message:', error);
      }
    }
  }, []);

  // Handle closing the welcome modal
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="home">
      <ToastContainer />

      {/* Welcome Modal */}
      <Modal
        show={showWelcomeModal}
        onHide={handleCloseWelcomeModal}
        centered
        className="welcome-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Our Fitness Family!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-check-circle text-success welcome-icon"></i>
            <h4>Thank you for subscribing to {welcomePackage}!</h4>
            <p>Your subscription is now active. You can now access all the features and benefits of your package.</p>
            <p>Visit your profile page to see your active status and start your fitness journey today!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseWelcomeModal}>
            Let&apos;s Get Started!
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="hero-section">
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">TRANSFORM YOUR BODY</h1>
            <p className="hero-subtitle">
              Join our community and achieve your fitness goals with expert trainers and comprehensive programs.
            </p>
            <Link to="/signup" className="cta-button">
              <span>Get Started</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
            <div style={{ marginTop: '20px' }}>
              <Link to="/about" style={{ color: 'white', textDecoration: 'underline', marginRight: '20px' }}>
                Go to About Page
              </Link>
              <Link to="/trainers" style={{ color: 'white', textDecoration: 'underline' }}>
                Go to Trainers Page
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="features-section">
        <div className="particles-container">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="section-title-container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="title-underline"></div>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-container">
              <i className="fas fa-dumbbell"></i>
            </div>
            <h3>Expert Trainers</h3>
            <p>Our certified trainers are here to guide you through your fitness journey with personalized attention.</p>
            <div className="feature-card-overlay"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Proven Results</h3>
            <p>Join thousands of satisfied members who have achieved their fitness goals with our programs.</p>
            <div className="feature-card-overlay"></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Flexible Schedule</h3>
            <p>Work out on your own time with 24/7 access to our state-of-the-art facilities.</p>
            <div className="feature-card-overlay"></div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-shape shape1"></div>
          <div className="cta-shape shape2"></div>
          <div className="cta-shape shape3"></div>
        </div>
        <Container>
          <div className="cta-content">
            <h2 className="animated-heading">Ready to Start Your <span className="highlight">Fitness Journey</span>?</h2>
            <p>Transform your life with our comprehensive fitness tracking tools</p>
            <Link to="/signup" className="cta-button">
              <span className="button-text">Start Now</span>
              <span className="button-icon"><i className="fas fa-bolt"></i></span>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;