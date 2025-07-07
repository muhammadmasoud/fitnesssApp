import { Fragment, useEffect, lazy, Suspense, useMemo, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollHandler from './components/ScrollHandler.jsx';
import FireAnimation from './components/FireAnimation.jsx';
import Home from './pages/Home.jsx';
import AuthenticatedHome from './pages/AuthenticatedHome.jsx';

// Lazy load all other page components
const About = lazy(() => import('./pages/About.jsx'));
const Trainers = lazy(() => import('./pages/Trainers.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Exercises = lazy(() => import('./pages/Exercises.jsx'));
const Classes = lazy(() => import('./pages/Classes.jsx'));
const Schedule = lazy(() => import('./pages/Schedule.jsx'));
const Nutrition = lazy(() => import('./pages/Nutrition.jsx'));

const Goals = lazy(() => import('./pages/Goals.jsx'));
const Progress = lazy(() => import('./pages/Progress.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Offers = lazy(() => import('./pages/Offers.jsx'));
const Programs = lazy(() => import('./pages/Programs.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderTracking = lazy(() => import('./pages/OrderTracking.jsx'));
const TrackOrderPublic = lazy(() => import('./pages/TrackOrderPublic.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));

// Import Redux actions and selectors
import { initializeAuth, selectCurrentUser } from './store/slices/authSlice';
import { initializeCart } from './store/slices/cartSlice';
import { initializeWishlist } from './store/slices/wishlistSlice';

import './App.css';
import './styles/navbar-override.css';

// Loading component for Suspense fallback - memoized to prevent unnecessary re-renders
const LoadingFallback = memo(function LoadingFallback() {
  // Use memoized styles for better performance
  const containerStyle = useMemo(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: '1.5rem',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    // Hardware acceleration removed
  }), []);

  const contentStyle = useMemo(() => ({
    textAlign: 'center'
  }), []);

  const spinnerStyle = useMemo(() => ({
    width: '3rem',
    height: '3rem'
  }), []);

  const textStyle = useMemo(() => ({
    marginTop: '1rem'
  }), []);

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div className="spinner-border text-light" role="status" style={spinnerStyle}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={textStyle}>Loading...</p>
      </div>
    </div>
  );
});

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // Initialize Redux state from localStorage on app load
  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeCart());
    dispatch(initializeWishlist());
  }, [dispatch]);

  // Memoize styles to prevent recreation on each render
  const appStyle = useMemo(() => ({
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative'
  }), []);

  const headerStyle = useMemo(() => ({
    margin: 0,
    padding: 0,
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,

    transform: 'translateY(0)'
  }), []);

  const mainStyle = useMemo(() => ({
    flex: 1,
    margin: 0,
    padding: '100px 0 0 0',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  }), []);

  const footerStyle = useMemo(() => ({
    width: '100%',
    position: 'relative',
    zIndex: 10
  }), []);

  return (
    <div className="app" style={appStyle}>
      <ScrollHandler />
      <header style={headerStyle}>
        {/* Only show announcement bar when user is not logged in */}
        {!currentUser && (
          <div className="announcement-bar">
            <Fragment>
              <span className="announcement-email">📧 contact@fitness.com</span>
              <span className="announcement-promotion">
                <FireAnimation width={35} height={40} />
                <span className="rainbow-text">20%</span> OFF for all new members this MONTH — Sign up today and transform your fitness journey!
                <FireAnimation width={35} height={40} />
              </span>
            </Fragment>
            <div className="announcement-social-icons">
              <Fragment>
                <a href="https://www.facebook.com/" className="announcement-social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/" className="announcement-social-icon"><i className="fab fa-instagram"></i></a>
                <a href="https://www.youtube.com/" className="announcement-social-icon"><i className="fab fa-youtube"></i></a>
                <a href="https://www.x.com/" className="announcement-social-icon"><i className="fa-brands fa-x-twitter"></i></a>
              </Fragment>
            </div>
          </div>
        )}
        <Navigation />
      </header>
      <main className="main-content" style={mainStyle}>
            <Routes>
              {/* Home and AuthenticatedHome are not lazy loaded for better performance */}
              <Route path="/" element={<Home />} />
              <Route path="/authenticated-home" element={
                <ProtectedRoute>
                  <AuthenticatedHome />
                </ProtectedRoute>
              } />

              {/* All other routes are lazy loaded with individual Suspense wrappers */}
              <Route path="/about" element={
                <Suspense fallback={<LoadingFallback />}>
                  <About />
                </Suspense>
              } />
              <Route path="/trainers" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Trainers />
                </Suspense>
              } />
              <Route path="/offers" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Offers />
                </Suspense>
              } />
              <Route path="/programs" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Programs />
                </Suspense>
              } />
              <Route path="/products" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Products />
                </Suspense>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Cart />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Checkout />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/order-tracking" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <OrderTracking />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/track-order" element={
                <Suspense fallback={<LoadingFallback />}>
                  <TrackOrderPublic />
                </Suspense>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Wishlist />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Pricing />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Contact />
                </Suspense>
              } />
              <Route path="/signup" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Signup />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Login />
                </Suspense>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/exercises" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Exercises />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/classes" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Classes />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Schedule />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/nutrition" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Nutrition />
                  </Suspense>
                </ProtectedRoute>
              } />

              <Route path="/goals" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Goals />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Progress />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Profile />
                  </Suspense>
                </ProtectedRoute>
              } />

            </Routes>
      </main>
      <footer style={footerStyle}>
        <Footer />
      </footer>


    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(App);
