import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import LogoAnimation from './LogoAnimation';
import './Footer.css';

const Footer = () => {
  const currentUser = useSelector(selectCurrentUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    const email = e.target.elements.email.value;
    if (email) {
      // You can implement actual subscription logic here
      alert(`Thank you for subscribing with: ${email}`);
      e.target.reset();
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <Fragment>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to={currentUser ? "/authenticated-home" : "/"}>Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/programs">Programs</Link></li>
              <li><Link to="/membership">Membership</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal Links</h3>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            </ul>
          </div>
        </Fragment>

        <Fragment>
          <div className="footer-section">
            <h3>Stay Connected</h3>
            <ul className="social-links">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i> YouTube</a></li>
              <li><a href="https://x.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-x-twitter"></i> X corp</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Subscribe to Newsletter</h3>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="newsletter-input"
              />
              <button type="submit" className="subscribe-btn">Subscribe</button>
            </form>
          </div>
        </Fragment>
      </div>

      <div className="footer-bottom">
        <Fragment>
          <div className="footer-logo-container">
            <LogoAnimation width={80} height={80} />
            <div className="footer-logo">FITNESS</div>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} FITNESS. All rights reserved.</p>
        </Fragment>
      </div>
    </footer>
  );
};

export default Footer;
