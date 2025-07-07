import { useEffect, useState, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/slices/authSlice';
import './AuthenticatedHome.css';

const AuthenticatedHome = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const statsSectionRef = useRef(null);
  const statsValueRefs = useRef([]);

  // Function removed as we're not using animations anymore

  useEffect(() => {
    // Set the stat values directly without animation
    statsValueRefs.current.forEach(el => {
      if (el) {
        const finalValue = parseInt(el.getAttribute('data-value'));
        // Create a span with black text color and set its content
        const span = document.createElement('span');
        span.style.color = 'black';
        span.textContent = finalValue;

        // Clear the element and append the span
        if (el && el.innerHTML !== undefined) {
          el.innerHTML = '';
          el.appendChild(span);
        }
      }
    });
  }, []);


  const confirmLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="authenticated-home">
      {/* Hero Section with Background Image */}
      <section className="auth-hero-section">
        <div className="auth-hero-overlay"></div>
        <Container fluid className="d-flex justify-content-center align-items-center h-100">
          <div className="auth-hero-content">
            <h1 className="auth-hero-title">Welcome Back, {currentUser?.fullName || 'Fitness Enthusiast'}!</h1>
            <p className="auth-hero-subtitle">
              Your fitness journey continues. Let&apos;s crush those goals together!
            </p>
            <div className="auth-hero-buttons">
              <Link to="/dashboard" className="auth-cta-button">
                <span>Dashboard</span>
                <i className="fas fa-chart-line"></i>
              </Link>
              <Link to="/exercises" className="auth-secondary-button">
                <span>Workout Library</span>
                <i className="fas fa-dumbbell"></i>
              </Link>
            </div>
          </div>
        </Container>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section ref={statsSectionRef} className="stats-section" style={{backgroundColor: 'white', padding: '5rem 0', textAlign: 'center'}}>
        <div className="fitness-journey-title animated-title">YOUR FITNESS JOURNEY</div>
        <div className="fitness-journey-underline"></div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1.5rem', width: '100%', margin: '0 auto', padding: '1rem 0'}}>
          <div style={{background: 'white', borderRadius: '10px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', width: '220px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <div style={{fontSize: '2.5rem', color: '#0088ff', marginBottom: '1rem'}}>
                <i className="fas fa-fire"></i>
              </div>
              <div
                ref={el => statsValueRefs.current[0] = el}
                className="stat-value"
                data-value="1250"
                style={{fontSize: '3.5rem', fontWeight: 700, color: 'black', marginBottom: '0.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >1250</div>
              <div style={{fontSize: '1rem', color: 'black', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', width: '100%', display: 'block', lineHeight: '1.2', marginTop: '0.5rem', fontWeight: 500}}>CALORIES BURNED</div>
            </div>
          </div>
          <div style={{background: 'white', borderRadius: '10px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', width: '220px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <div style={{fontSize: '2.5rem', color: '#0088ff', marginBottom: '1rem'}}>
                <i className="fas fa-running"></i>
              </div>
              <div
                ref={el => statsValueRefs.current[1] = el}
                className="stat-value"
                data-value="12"
                style={{fontSize: '3.5rem', fontWeight: 700, color: 'black', marginBottom: '0.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >12</div>
              <div style={{fontSize: '1rem', color: 'black', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', width: '100%', display: 'block', lineHeight: '1.2', marginTop: '0.5rem', fontWeight: 500}}>WORKOUTS COMPLETED</div>
            </div>
          </div>
          <div style={{background: 'white', borderRadius: '10px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', width: '220px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <div style={{fontSize: '2.5rem', color: '#0088ff', marginBottom: '1rem'}}>
                <i className="fas fa-stopwatch"></i>
              </div>
              <div
                ref={el => statsValueRefs.current[2] = el}
                className="stat-value"
                data-value="320"
                style={{fontSize: '3.5rem', fontWeight: 700, color: 'black', marginBottom: '0.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >320</div>
              <div style={{fontSize: '1rem', color: 'black', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', width: '100%', display: 'block', lineHeight: '1.2', marginTop: '0.5rem', fontWeight: 500}}>MINUTES ACTIVE</div>
            </div>
          </div>
          <div style={{background: 'white', borderRadius: '10px', padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', width: '220px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <div style={{fontSize: '2.5rem', color: '#0088ff', marginBottom: '1rem'}}>
                <i className="fas fa-medal"></i>
              </div>
              <div
                ref={el => statsValueRefs.current[3] = el}
                className="stat-value"
                data-value="5"
                style={{fontSize: '3.5rem', fontWeight: 700, color: 'black', marginBottom: '0.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >5</div>
              <div style={{fontSize: '1rem', color: 'black', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', width: '100%', display: 'block', lineHeight: '1.2', marginTop: '0.5rem', fontWeight: 500}}>ACHIEVEMENTS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Workouts Section */}
      <section className="workouts-section" style={{backgroundColor: '#474747', padding: '5rem 0', textAlign: 'center'}}>
        <div className="recommended-title animated-title">RECOMMENDED FOR YOU</div>
        <div className="recommended-underline"></div>
        <div className="workouts-grid">
          <div className="workout-card">
            <div className="workout-card-image workout-1"></div>
            <div className="workout-card-content">
              <h3>HIIT Cardio Blast</h3>
              <p className="workout-details">30 min • High Intensity • 350 cal</p>
              <Link to="/exercises" className="workout-card-button">Start Workout</Link>
            </div>
          </div>
          <div className="workout-card">
            <div className="workout-card-image workout-2"></div>
            <div className="workout-card-content">
              <h3>Core Strength</h3>
              <p className="workout-details">25 min • Medium Intensity • 220 cal</p>
              <Link to="/exercises" className="workout-card-button">Start Workout</Link>
            </div>
          </div>
          <div className="workout-card">
            <div className="workout-card-image workout-3"></div>
            <div className="workout-card-content">
              <h3>Full Body Power</h3>
              <p className="workout-details">45 min • High Intensity • 450 cal</p>
              <Link to="/exercises" className="workout-card-button">Start Workout</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Log Out</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-modal-buttons">
              <Button variant="outline-secondary" onClick={cancelLogout}>Cancel</Button>
              <Button variant="danger" onClick={confirmLogout}>Log Out</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedHome;