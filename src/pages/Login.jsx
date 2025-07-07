import { useEffect, useRef } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthError } from '../store/slices/authSlice';
import { useForm } from '../hooks/useForm';
import { useNotification } from '../hooks/useNotification';


import './Login.css';

const Login = () => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const navigate = useNavigate();

  const {
    forms,
    errors,
    submitting,
    updateFormField,
    validateForm,
    setFormErrors,
    setFormSubmitting
  } = useForm();
  const { success, error, info } = useNotification();

  // Get the login form data from the form context
  const loginForm = forms.login;
  const loginErrors = errors.login;
  const isSubmitting = submitting.login;

  // Force the form to be visible immediately
  useEffect(() => {
    // Apply styles to the form using the ref
    if (formRef.current) {
      formRef.current.style.opacity = "1";
      formRef.current.style.transform = "translateY(0)";
      formRef.current.style.visibility = "visible";
      formRef.current.classList.add('form-loaded');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form
    if (!validateForm('login')) {
      error('Please fill in all required fields correctly.');
      return;
    }

    // Set submitting state
    setFormSubmitting('login', true);

    try {
      // Attempt to login using Redux
      const resultAction = await dispatch(loginUser({
        email: loginForm.email,
        password: loginForm.password
      }));

      // Check if the login was successful
      if (loginUser.fulfilled.match(resultAction)) {
        // If successful, show success notification and redirect
        success('Login successful! Welcome back.');
        navigate('/authenticated-home');
      }
    } catch {
      // Show error notification
      error('Login failed. Please check your credentials and try again.');

      // Set form errors
      setFormErrors('login', {
        email: 'Invalid email or password',
        password: 'Invalid email or password'
      });
    } finally {
      setFormSubmitting('login', false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="particle-container">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className={`particle particle-${index + 1}`}></div>
          ))}
        </div>
      </div>
      <Container>
        <div className="login-container">
          <div className="login-content">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Log in to continue your fitness journey</p>
            </div>

            {authError && <Alert variant="danger">{authError}</Alert>}

            <Form
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
              className="animated-form"
              style={{ opacity: 1, transform: 'translateY(0)', visibility: 'visible' }}>
              <Form.Group className="mb-4 form-item" data-animation-delay="100">
                <div className="input-icon-wrapper">
                  <i className="fas fa-envelope input-icon"></i>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => updateFormField('login', 'email', e.target.value)}
                    required
                    isInvalid={!!loginErrors.email}
                    disabled={isSubmitting}
                    className="form-input-animation"
                    style={{ paddingLeft: '45px' }} /* Inline style to ensure padding */
                    id="email-input"
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {loginErrors.email || 'Please enter a valid email address.'}
                </Form.Control.Feedback>
                <Form.Label htmlFor="email-input">Email address</Form.Label>
              </Form.Group>

              <Form.Group className="mb-4 form-item" data-animation-delay="200">
                <div className="input-icon-wrapper">
                  <i className="fas fa-lock input-icon"></i>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => updateFormField('login', 'password', e.target.value)}
                    required
                    isInvalid={!!loginErrors.password}
                    disabled={isSubmitting}
                    className="form-input-animation"
                    style={{ paddingLeft: '45px' }} /* Inline style to ensure padding */
                    id="password-input"
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {loginErrors.password || 'Please enter your password.'}
                </Form.Control.Feedback>
                <Form.Label htmlFor="password-input">Password</Form.Label>
              </Form.Group>

              <div className="login-options mb-4 form-item" data-animation-delay="300">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={loginForm.rememberMe}
                  onChange={(e) => updateFormField('login', 'rememberMe', e.target.checked)}
                  disabled={isSubmitting}
                  className="checkbox-animation"
                />
                <button
                  type="button"
                  className="btn btn-link forgot-password p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    info('Password reset functionality will be available soon.');
                    // Forgot password functionality would go here
                  }}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>

              <div className="form-item" data-animation-delay="400">
                <button
                  type="submit"
                  className="btn btn-primary login-btn w-100"
                  disabled={isSubmitting}
                >
                  <span className="btn-text">
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                  </span>
                  <span className="btn-shine"></span>
                </button>
              </div>

              <div className="text-center mt-4 signup-prompt form-item" data-animation-delay="500">
                <p>Don&apos;t have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
              </div>

              <div className="social-login form-item" data-animation-delay="600">
                <p className="social-login-text">Or log in with</p>
                <div className="social-login-buttons">
                  <button
                    type="button"
                    className="btn btn-outline-primary social-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      // Facebook login functionality would go here
                    }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger social-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      // Google login functionality would go here
                    }}
                  >
                    <i className="fab fa-google"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark social-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      // Apple login functionality would go here
                    }}
                  >
                    <i className="fab fa-apple"></i>
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
