
import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Modal, Tab, Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserProfile, logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import DynamicBackground from '../components/DynamicBackground';
import './Profile.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast-custom.css';
import profileBackground from '../assets/optimized/profile.jpg';

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: 'weight-loss',
    activityLevel: 'beginner',
    profileImage: null,
    subscriptionStatus: false,
    subscriptionPackage: '',
    subscriptionDate: '',
    subscriptions: [] // Array to store multiple subscriptions
  });

  // State for subscription modal
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Function to check if a subscription is expired
  const isSubscriptionExpired = useCallback((subscription) => {
    if (!subscription.expiryDate) {
      // For legacy subscriptions without expiry date, add one (30 days from start date)
      const startDate = new Date(subscription.date);
      const expiryDate = new Date(startDate);

      // If it's the "First Month Free" offer, set expiry to 60 days
      if (subscription.name === 'First Month Free') {
        expiryDate.setDate(startDate.getDate() + 60); // 60 days (2 months)
      } else {
        expiryDate.setDate(startDate.getDate() + 30); // 30 days (1 month)
      }

      subscription.expiryDate = expiryDate.toISOString();
    }

    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    return now > expiry;
  }, []);



  // Function to calculate remaining time for a subscription
  const getRemainingTime = (subscription) => {
    if (!subscription.expiryDate) {
      // For legacy subscriptions without expiry date, add one (30 days from start date)
      const startDate = new Date(subscription.date);
      const expiryDate = new Date(startDate);

      // If it's the "First Month Free" offer, set expiry to 60 days
      if (subscription.name === 'First Month Free') {
        expiryDate.setDate(startDate.getDate() + 60); // 60 days (2 months)
      } else {
        expiryDate.setDate(startDate.getDate() + 30); // 30 days (1 month)
      }

      subscription.expiryDate = expiryDate.toISOString();
    }

    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    const diffTime = expiry - now;

    // If expired, return 0
    if (diffTime <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // Function to calculate remaining days for a subscription (for backward compatibility)
  const getRemainingDays = (subscription) => {
    const { days } = getRemainingTime(subscription);
    return days;
  };

  // Function to check and update expired subscriptions
  const checkAndUpdateSubscriptions = useCallback(async () => {
    if (!currentUser) return;

    // Get all users to find the complete user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.id === currentUser.id);

    if (userIndex === -1) return;

    const userData = users[userIndex];
    let subscriptions = userData.subscriptions || [];

    // Check for expired subscriptions
    const activeSubscriptions = subscriptions.filter(sub => !isSubscriptionExpired(sub));

    // If subscriptions changed (some expired), update the user data
    if (activeSubscriptions.length !== subscriptions.length) {
      // Update user data
      userData.subscriptions = activeSubscriptions;
      userData.subscriptionStatus = activeSubscriptions.length > 0;

      if (activeSubscriptions.length > 0) {
        userData.subscriptionPackage = activeSubscriptions[0].name;
        userData.subscriptionDate = activeSubscriptions[0].date;
      } else {
        userData.subscriptionPackage = '';
        userData.subscriptionDate = '';
      }

      // Save updated user data
      users[userIndex] = userData;
      localStorage.setItem('users', JSON.stringify(users));

      // Update profile data
      setProfileData(prev => ({
        ...prev,
        subscriptions: activeSubscriptions,
        subscriptionStatus: activeSubscriptions.length > 0,
        subscriptionPackage: activeSubscriptions.length > 0 ? activeSubscriptions[0].name : '',
        subscriptionDate: activeSubscriptions.length > 0 ? activeSubscriptions[0].date : ''
      }));

      // Update profile using Redux
      await dispatch(updateUserProfile({
        subscriptions: activeSubscriptions,
        subscriptionStatus: activeSubscriptions.length > 0,
        subscriptionPackage: activeSubscriptions.length > 0 ? activeSubscriptions[0].name : '',
        subscriptionDate: activeSubscriptions.length > 0 ? activeSubscriptions[0].date : ''
      }));
    }

    return activeSubscriptions;
  }, [currentUser, dispatch, isSubscriptionExpired, setProfileData]);

  // Get user data on component mount
  useEffect(() => {
    if (currentUser) {
      // Get all users to find the complete user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const fullUserData = users.find(user => user.id === currentUser.id) || {};

      // Initialize subscriptions array
      let subscriptions = [];

      // If user has a legacy subscription (single subscription), add it to the array
      if (fullUserData.subscriptionStatus && fullUserData.subscriptionPackage) {
        const legacySubscription = {
          id: 'legacy-subscription',
          name: fullUserData.subscriptionPackage,
          date: fullUserData.subscriptionDate || new Date().toISOString(),
          type: isSpecialOffer(fullUserData.subscriptionPackage) ? 'offer' : 'package'
        };

        // Add expiry date for legacy subscription (30 days from start date, or 60 for "First Month Free")
        const startDate = new Date(legacySubscription.date);
        const expiryDate = new Date(startDate);

        if (legacySubscription.name === 'First Month Free') {
          expiryDate.setDate(startDate.getDate() + 60); // 60 days for "First Month Free"
        } else {
          expiryDate.setDate(startDate.getDate() + 30); // 30 days for regular subscriptions
        }

        legacySubscription.expiryDate = expiryDate.toISOString();
        subscriptions.push(legacySubscription);
      }

      // If user has subscriptions array, use that instead
      if (fullUserData.subscriptions && Array.isArray(fullUserData.subscriptions)) {
        subscriptions = fullUserData.subscriptions;

        // Add expiry dates to subscriptions that don't have them
        subscriptions = subscriptions.map(sub => {
          if (!sub.expiryDate) {
            const startDate = new Date(sub.date);
            const expiryDate = new Date(startDate);

            if (sub.name === 'First Month Free') {
              expiryDate.setDate(startDate.getDate() + 60); // 60 days for "First Month Free"
            } else {
              expiryDate.setDate(startDate.getDate() + 30); // 30 days for regular subscriptions
            }

            return { ...sub, expiryDate: expiryDate.toISOString() };
          }
          return sub;
        });
      }

      // Filter out expired subscriptions
      const activeSubscriptions = subscriptions.filter(sub => !isSubscriptionExpired(sub));

      // Update user data if subscriptions changed
      if (activeSubscriptions.length !== subscriptions.length) {
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex].subscriptions = activeSubscriptions;
          users[userIndex].subscriptionStatus = activeSubscriptions.length > 0;

          if (activeSubscriptions.length > 0) {
            users[userIndex].subscriptionPackage = activeSubscriptions[0].name;
            users[userIndex].subscriptionDate = activeSubscriptions[0].date;
          } else {
            users[userIndex].subscriptionPackage = '';
            users[userIndex].subscriptionDate = '';
          }

          localStorage.setItem('users', JSON.stringify(users));
        }
      }

      setProfileData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        bio: fullUserData.bio || 'Fitness enthusiast looking to improve my health and strength.',
        age: fullUserData.age || '',
        weight: fullUserData.weight || '',
        height: fullUserData.height || '',
        fitnessGoal: fullUserData.fitnessGoal || 'weight-loss',
        activityLevel: fullUserData.activityLevel || 'beginner',
        profileImage: fullUserData.profileImage || null,
        subscriptionStatus: activeSubscriptions.length > 0,
        subscriptionPackage: activeSubscriptions.length > 0 ? activeSubscriptions[0].name : '',
        subscriptionDate: activeSubscriptions.length > 0 ? activeSubscriptions[0].date : '',
        subscriptions: activeSubscriptions
      });
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [currentUser, isSubscriptionExpired]);

  // Set up interval to check for expired subscriptions
  useEffect(() => {
    // Check immediately on mount
    checkAndUpdateSubscriptions();

    // Set up interval to check every minute
    const intervalId = setInterval(() => {
      checkAndUpdateSubscriptions();
    }, 60000); // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [currentUser, checkAndUpdateSubscriptions]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update user profile using Redux
      const resultAction = await dispatch(updateUserProfile({
        fullName: profileData.fullName,
        bio: profileData.bio,
        age: profileData.age,
        weight: profileData.weight,
        height: profileData.height,
        fitnessGoal: profileData.fitnessGoal,
        activityLevel: profileData.activityLevel,
        profileImage: profileData.profileImage,
        subscriptionStatus: profileData.subscriptionStatus,
        subscriptionPackage: profileData.subscriptionPackage,
        subscriptionDate: profileData.subscriptionDate
      }));

      // Check if the update was successful
      if (updateUserProfile.fulfilled.match(resultAction)) {
        setSuccess('Profile updated successfully!');
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(resultAction.error.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile. Please try again.');
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    setLoading(true);
    setError('');

    try {
      // Filter out the selected subscription
      const updatedSubscriptions = profileData.subscriptions.filter(
        sub => sub.id !== selectedSubscription.id
      );

      // Update user profile with the updated subscriptions array using Redux
      await dispatch(updateUserProfile({
        subscriptions: updatedSubscriptions,
        // Update legacy fields for backward compatibility
        subscriptionStatus: updatedSubscriptions.length > 0,
        subscriptionPackage: updatedSubscriptions.length > 0 ? updatedSubscriptions[0].name : '',
        subscriptionDate: updatedSubscriptions.length > 0 ? updatedSubscriptions[0].date : ''
      }));

      // Update local state
      setProfileData(prev => ({
        ...prev,
        subscriptions: updatedSubscriptions,
        subscriptionStatus: updatedSubscriptions.length > 0,
        subscriptionPackage: updatedSubscriptions.length > 0 ? updatedSubscriptions[0].name : '',
        subscriptionDate: updatedSubscriptions.length > 0 ? updatedSubscriptions[0].date : ''
      }));

      toast.success('Subscription cancelled successfully!');
      setShowSubscriptionModal(false);
      setSelectedSubscription(null);
    } catch (error) {
      setError(error.message || 'Failed to cancel subscription. Please try again.');
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription change
  const handleChangeSubscription = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };



  // Check if subscription is a special offer
  const isSpecialOffer = (packageName) => {
    // List of special offers from the Offers page
    const specialOffers = [
      'Summer Body Challenge',
      'Couple&apos;s Package',
      'First Month Free'
    ];

    return specialOffers.some(offer => packageName.includes(offer));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Find current user
      const userIndex = users.findIndex(user => user.id === currentUser.id);

      if (userIndex === -1) {
        throw new Error('User not found.');
      }

      // Verify current password
      if (users[userIndex].password !== passwordData.currentPassword) {
        throw new Error('Current password is incorrect.');
      }

      // Update password
      users[userIndex].password = passwordData.newPassword;

      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setShowPasswordModal(false);
      toast.success('Password updated successfully!');
    } catch (error) {
      setError(error.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Filter out current user
      const updatedUsers = users.filter(user => user.id !== currentUser.id);

      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Logout user using Redux
      dispatch(logout());

      toast.info('Your account has been deleted.');
    } catch (error) {
      console.error('Failed to delete account:', error);
      setError('Failed to delete account. Please try again.');
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) {
    return (
      <DynamicBackground
        imageUrl={profileBackground}
        className="profile-page"
        style={{ paddingTop: '120px', paddingBottom: '100px' }}>
        <Container className="text-center py-5">
          <div className="profile-content">
            <h2>Please log in to view your profile</h2>
          </div>
        </Container>
      </DynamicBackground>
    );
  }

  return (
    <DynamicBackground
      imageUrl={profileBackground}
      className="profile-page"
      style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <ToastContainer />
      <Container className="profile-container">
        <div className="profile-content">
          <h1 className="profile-title animate__animated animate__fadeInDown">YOUR PROFILE</h1>

          <div className="profile-header">
            <div className="profile-image-container" onClick={handleProfileImageClick}>
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="profile-image-overlay">
                <i className="fas fa-camera"></i>
                <span>Change Photo</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
            </div>
            <h2 className="profile-name">{profileData.fullName}</h2>
            <p className="profile-email">{profileData.email}</p>
            <div className="subscription-status" style={{
              display: 'inline-block',
              padding: '5px 15px',
              borderRadius: '20px',
              marginBottom: '15px',
              backgroundColor: profileData.subscriptionStatus ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
              border: `1px solid ${profileData.subscriptionStatus ? '#28a745' : '#dc3545'}`,
              color: profileData.subscriptionStatus ? '#28a745' : '#dc3545',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              <i className={`fas fa-${profileData.subscriptionStatus ? 'check-circle' : 'times-circle'}`} style={{marginRight: '5px'}}></i>
              {profileData.subscriptionStatus ? 'Active' : 'Inactive'}
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value" style={{color: '#ffffff'}}>{profileData.weight || '0'}</span>
                <div className="stat-label" style={{color: '#ffffff', fontSize: '22px', marginTop: '2px'}}>kg</div>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{color: '#ffffff'}}>{profileData.height || '0'}</span>
                <div className="stat-label" style={{color: '#ffffff', fontSize: '22px', marginTop: '2px'}}>cm</div>
              </div>
            </div>
          </div>

          <div className="profile-body">
            <Tab.Container id="profile-tabs" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="profile-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="subscription">Subscription</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="workouts">Workouts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="achievements">Achievements</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings">Settings</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                  {success && <Alert variant="success" className="mt-3">{success}</Alert>}

                  <Form onSubmit={handleProfileSubmit} className="profile-form">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileData.email}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={3}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="number"
                            name="age"
                            value={profileData.age}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Weight (kg)</Form.Label>
                          <Form.Control
                            type="number"
                            name="weight"
                            value={profileData.weight}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Height (cm)</Form.Label>
                          <Form.Control
                            type="number"
                            name="height"
                            value={profileData.height}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fitness Goal</Form.Label>
                          <Form.Select
                            name="fitnessGoal"
                            value={profileData.fitnessGoal}
                            onChange={handleProfileChange}
                          >
                            <option value="weight-loss">Weight Loss</option>
                            <option value="muscle-gain">Muscle Gain</option>
                            <option value="endurance">Endurance</option>
                            <option value="flexibility">Flexibility</option>
                            <option value="general-fitness">General Fitness</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Activity Level</Form.Label>
                          <Form.Select
                            name="activityLevel"
                            value={profileData.activityLevel}
                            onChange={handleProfileChange}
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="athlete">Athlete</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        className="profile-save-btn"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>

                <Tab.Pane eventKey="subscription">
                  <div className="subscription-section">
                    <h3>Your Subscriptions</h3>

                    {profileData.subscriptions.length > 0 ? (
                      <div className="subscription-details">
                        <div className="subscription-actions-top">
                          <div className="subscription-info-note mb-3">
                            <i className="fas fa-info-circle me-2"></i>
                            <span>You can have one subscription plan and one special offer active at a time.</span>
                          </div>
                          <div className="subscription-buttons">
                            <Button
                              variant="outline-primary"
                              className="me-2"
                              onClick={handleChangeSubscription}
                            >
                              <i className="fas fa-plus-circle me-1"></i> Change Plan
                            </Button>
                            <Button
                              variant="outline-info"
                              onClick={() => window.location.href = '/offers'}
                            >
                              <i className="fas fa-gift me-1"></i> View Special Offers
                            </Button>
                          </div>
                        </div>

                        {/* Regular Subscriptions */}
                        {profileData.subscriptions.filter(sub => sub.type === 'package').length > 0 && (
                          <div className="subscription-category">
                            <h4 className="subscription-category-title">Your Subscription Plans</h4>

                            {profileData.subscriptions
                              .filter(sub => sub.type === 'package')
                              .map((subscription, index) => (
                                <div className="subscription-info-card" key={subscription.id || index}>
                                  <div className="subscription-header">
                                    <i className="fas fa-crown subscription-icon"></i>
                                    <div>
                                      <h4>{subscription.name}</h4>
                                      <p>Active since: {new Date(subscription.date).toLocaleDateString()}</p>
                                      <div className="subscription-countdown">
                                        <i className="fas fa-clock me-1"></i>
                                        <span>{getRemainingDays(subscription)} days remaining</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="subscription-features">
                                    <h5>Package Features:</h5>
                                    <ul className="features-list">
                                      {subscription.name.includes('Basic') && (
                                        <>
                                          <li><i className="fas fa-check"></i> Access to Gym Facilities</li>
                                          <li><i className="fas fa-check"></i> Group Fitness Classes</li>
                                          <li><i className="fas fa-check"></i> Initial Fitness Assessment</li>
                                        </>
                                      )}

                                      {(subscription.name.includes('Standard') || subscription.name.includes('Premium')) && (
                                        <>
                                          <li><i className="fas fa-check"></i> Access to Gym Facilities</li>
                                          <li><i className="fas fa-check"></i> Group Fitness Classes</li>
                                          <li><i className="fas fa-check"></i> Initial Fitness Assessment</li>
                                          <li><i className="fas fa-check"></i> Locker Room and Showers</li>
                                          <li><i className="fas fa-check"></i> Free Wi-Fi</li>
                                        </>
                                      )}

                                      {subscription.name.includes('Premium') && (
                                        <>
                                          <li><i className="fas fa-check"></i> Member Support</li>
                                          <li><i className="fas fa-check"></i> Nutritional Counseling</li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                  <div className="subscription-actions">
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => {
                                        setSelectedSubscription(subscription);
                                        setShowSubscriptionModal(true);
                                      }}
                                    >
                                      Cancel Subscription
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Special Offers */}
                        {profileData.subscriptions.filter(sub => sub.type === 'offer').length > 0 && (
                          <div className="subscription-category">
                            <h4 className="subscription-category-title">Your Special Offers</h4>

                            {profileData.subscriptions
                              .filter(sub => sub.type === 'offer')
                              .map((subscription, index) => (
                                <div className="subscription-info-card" key={subscription.id || index}>
                                  <div className="subscription-header">
                                    <i className="fas fa-gift subscription-icon special-offer-icon"></i>
                                    <div>
                                      <h4>
                                        {subscription.name}
                                        <span className="special-offer-badge">Special Offer</span>
                                      </h4>
                                      <p>Active since: {new Date(subscription.date).toLocaleDateString()}</p>
                                      <div className="subscription-countdown">
                                        <i className="fas fa-clock me-1"></i>
                                        <span>{getRemainingDays(subscription)} days remaining</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="subscription-features">
                                    <h5>Offer Features:</h5>
                                    <ul className="features-list">
                                      {/* Summer Body Challenge */}
                                      {subscription.name.includes('Summer Body Challenge') && (
                                        <>
                                          <li><i className="fas fa-check"></i> Personalized Workout Plans</li>
                                          <li><i className="fas fa-check"></i> Nutrition Guidance</li>
                                          <li><i className="fas fa-check"></i> 8-Week Transformation Program</li>
                                          <li><i className="fas fa-check"></i> Progress Tracking</li>
                                          <li><i className="fas fa-check"></i> Weekly Check-ins</li>
                                        </>
                                      )}

                                      {/* Couple's Package */}
                                      {subscription.name.includes('Couple') && (
                                        <>
                                          <li><i className="fas fa-check"></i> Shared Personal Training Sessions</li>
                                          <li><i className="fas fa-check"></i> Partner Workout Plans</li>
                                          <li><i className="fas fa-check"></i> Dual Membership Benefits</li>
                                          <li><i className="fas fa-check"></i> Partner Motivation System</li>
                                          <li><i className="fas fa-check"></i> Couples Fitness Assessments</li>
                                        </>
                                      )}

                                      {/* First Month Free */}
                                      {subscription.name.includes('First Month Free') && (
                                        <>
                                          <li><i className="fas fa-check"></i> Premium Facilities Access</li>
                                          <li><i className="fas fa-check"></i> 12-Month Membership</li>
                                          <li><i className="fas fa-check"></i> First Month Free</li>
                                          <li><i className="fas fa-check"></i> All Premium Features</li>
                                          <li><i className="fas fa-check"></i> Loyalty Rewards Program</li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                  <div className="subscription-actions">
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => {
                                        setSelectedSubscription(subscription);
                                        setShowSubscriptionModal(true);
                                      }}
                                    >
                                      Cancel Offer
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fas fa-crown empty-icon"></i>
                        <p>You don&apos;t have any active subscriptions or offers.</p>
                        <p className="subscription-policy-note">
                          <i className="fas fa-info-circle me-2"></i>
                          You can have one subscription plan and one special offer active at a time.
                        </p>
                        <div className="empty-state-actions">
                          <Button
                            variant="primary"
                            className="mt-3 me-2"
                            onClick={() => window.location.href = '/pricing'}
                          >
                            View Subscription Plans
                          </Button>
                          <Button
                            variant="info"
                            className="mt-3"
                            onClick={() => window.location.href = '/offers'}
                          >
                            Check Special Offers
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="workouts">
                  <div className="workouts-section">
                    <h3>Your Workout History</h3>
                    <div className="empty-state">
                      <i className="fas fa-dumbbell empty-icon"></i>
                      <p>You haven&apos;t completed any workouts yet.</p>
                      <Button variant="primary" className="mt-3">Start a Workout</Button>
                    </div>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="achievements">
                  <div className="achievements-section">
                    <h3>Your Achievements</h3>
                    <div className="empty-state">
                      <i className="fas fa-medal empty-icon"></i>
                      <p>Complete workouts to earn achievements!</p>
                    </div>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="settings">
                  <div className="settings-section">
                    <h3>Account Settings</h3>

                    <div className="settings-card">
                      <div className="settings-card-header">
                        <i className="fas fa-lock settings-icon"></i>
                        <div>
                          <h4>Password</h4>
                          <p>Change your password</p>
                        </div>
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        Change Password
                      </Button>
                    </div>

                    <div className="settings-card">
                      <div className="settings-card-header">
                        <i className="fas fa-bell settings-icon"></i>
                        <div>
                          <h4>Notifications</h4>
                          <p>Manage your notification preferences</p>
                        </div>
                      </div>
                      <Button variant="outline-primary">Manage</Button>
                    </div>

                    <div className="settings-card">
                      <div className="settings-card-header">
                        <i className="fas fa-user-slash settings-icon"></i>
                        <div>
                          <h4>Delete Account</h4>
                          <p>Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </Container>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p>All your data, including workout history and achievements, will be permanently deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Subscription Cancellation Confirmation Modal */}
      <Modal show={showSubscriptionModal} onHide={() => {
        setShowSubscriptionModal(false);
        setSelectedSubscription(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSubscription?.type === 'offer' ? 'Cancel Special Offer' : 'Cancel Subscription'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubscription ? (
            <>
              <p>Are you sure you want to cancel your <strong>{selectedSubscription.name}</strong>?</p>
              <p>You will lose access to all features associated with this {selectedSubscription.type === 'offer' ? 'special offer' : 'subscription'}.</p>
            </>
          ) : (
            <p>Please select a subscription to cancel.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowSubscriptionModal(false);
              setSelectedSubscription(null);
            }}
          >
            Keep {selectedSubscription?.type === 'offer' ? 'Offer' : 'Subscription'}
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelSubscription}
            disabled={loading || !selectedSubscription}
          >
            {loading ? 'Cancelling...' : `Cancel ${selectedSubscription?.type === 'offer' ? 'Offer' : 'Subscription'}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </DynamicBackground>
  );
};

export default Profile;