import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useForm } from '../hooks/useForm';
import { useNotification } from '../hooks/useNotification';


import './Contact.css';

const Contact = () => {
  const [loaded, setLoaded] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const {
    forms,
    errors,
    submitting,
    updateFormField,
    validateForm,
    resetForm,
    setFormSubmitting
  } = useForm();
  const { success, error } = useNotification();

  // Get the contact form data from the form context
  const contactForm = forms.contact;
  const contactErrors = errors.contact;
  const isSubmitting = submitting.contact;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Set loaded state after a short delay for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormField('contact', name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm('contact')) {
      error('Please fill in all required fields correctly.');
      return;
    }

    // Set submitting state
    setFormSubmitting('contact', true);

    // Simulate API call
    setTimeout(() => {
      // Handle form submission logic here
      console.log('Form submitted:', contactForm);

      // Reset form after submission
      resetForm('contact');

      // Show success message
      success('Thank you for your message! We will get back to you soon.');

      // Reset submitting state
      setFormSubmitting('contact', false);
    }, 1500);
  };

  // Function to handle home link click
  const handleHomeClick = (e) => {
    e.preventDefault();
    // If user is logged in, navigate to authenticated home page
    if (currentUser) {
      navigate('/authenticated-home');
    } else {
      // If not logged in, navigate to regular home page
      navigate('/');
    }
  };

  return (
    <div className={`contact-page ${loaded ? 'loaded' : ''}`}>
      <div className="contact-background"></div>

      {/* Contact Header */}
      <div className="contact-header">
        <h1 className="contact-title ">Contact Us</h1>
        <div className="contact-breadcrumb  animate__delay-1s">
          <a href="#" onClick={handleHomeClick}>Home</a>
          <span>→</span>
          <span>Contact Us</span>
        </div>
      </div>

      <Container className="main-container">
        <div className="contact-container">
          {/* Left Side - Contact Info */}
          <div className="contact-info ">
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">Location:</h3>
                  <p className="contact-info-text">A108 Adam Street, New York, NY 635022</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">Email:</h3>
                  <p className="contact-info-text">admin@OnlineInstitute.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-info-content">
                  <h3 className="contact-info-label">Call:</h3>
                  <p className="contact-info-text">+1 5589 55488 55</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form-container ">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleChange}
                  isInvalid={!!contactErrors.name}
                  disabled={isSubmitting}
                />
                {contactErrors.name && (
                  <Form.Control.Feedback type="invalid">
                    {contactErrors.name}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleChange}
                  isInvalid={!!contactErrors.email}
                  disabled={isSubmitting}
                />
                {contactErrors.email && (
                  <Form.Control.Feedback type="invalid">
                    {contactErrors.email}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Message"
                  value={contactForm.message}
                  onChange={handleChange}
                  isInvalid={!!contactErrors.message}
                  disabled={isSubmitting}
                  className="message-textarea"
                />
                {contactErrors.message && (
                  <Form.Control.Feedback type="invalid">
                    {contactErrors.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Form>
          </div>
        </div>
      </Container>

      {/* Map Section in a separate container */}
      <Container className="map-wrapper">
        <div className="map-container  animate__delay-1s">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564562986!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
          ></iframe>
        </div>
      </Container>
    </div>
  );
};

export default Contact;