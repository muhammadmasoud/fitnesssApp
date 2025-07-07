import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import DynamicBackground from '../components/DynamicBackground';
import './Classes.css';
import classesBg from '../assets/optimized/classes-bg.jpg';

const Classes = () => {
  // State for window width to handle responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Preload the background image
    const img = new Image();
    img.src = classesBg;

    // Add window resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const classesData = [
    {
      id: 1,
      name: 'Yoga',
      description: 'Find balance and inner peace with our yoga classes designed for all levels.',
      duration: '60 min',
      intensity: 'Low to Medium',
      instructor: 'Sarah Johnson'
    },
    {
      id: 2,
      name: 'HIIT',
      description: 'High-Intensity Interval Training to maximize calorie burn and improve cardiovascular health.',
      duration: '45 min',
      intensity: 'High',
      instructor: 'Mike Thompson'
    },
    {
      id: 3,
      name: 'Pilates',
      description: 'Strengthen your core and improve flexibility with our Pilates classes.',
      duration: '55 min',
      intensity: 'Medium',
      instructor: 'Emma Rodriguez'
    },
    {
      id: 4,
      name: 'Spinning',
      description: 'High-energy indoor cycling classes set to motivating music.',
      duration: '50 min',
      intensity: 'Medium to High',
      instructor: 'David Clark'
    },
    {
      id: 5,
      name: 'Zumba',
      description: "Dance-based fitness class that's fun, energetic, and makes you feel amazing.",
      duration: '60 min',
      intensity: 'Medium',
      instructor: 'Maria Sanchez'
    },
    {
      id: 6,
      name: 'CrossFit',
      description: 'Varied functional movements performed at high intensity to build strength and conditioning.',
      duration: '60 min',
      intensity: 'High',
      instructor: 'James Wilson'
    }
  ];

  // Determine padding based on screen size
  const getPadding = () => {
    if (windowWidth <= 768) {
      return {
        paddingTop: '250px !important',
        paddingBottom: '250px !important'
      };
    } else if (windowWidth <= 992) {
      return {
        paddingTop: '280px !important',
        paddingBottom: '280px !important'
      };
    } else {
      return {
        paddingTop: '300px !important',
        paddingBottom: '300px !important'
      };
    }
  };

  return (
    <DynamicBackground
      imageUrl={classesBg}
      className="classes-page"
      style={{
        ...getPadding(),
        justifyContent: 'flex-start !important',
        alignItems: 'center !important'
      }}
    >
      <ToastContainer />
      <div className="classes-spacing-wrapper">
        <Container className="classes-container">
          <div className="classes-content">
            <h1 className="classes-title ">OUR CLASSES</h1>
            <div className="classes-items-section">
              <div className="classes-description">
                <h2>Find Your Perfect Class</h2>
                <p>
                  Whether you&apos;re looking to build strength, improve flexibility, or boost your cardio fitness,
                  we have a class that&apos;s perfect for you. Our expert instructors will guide you through each
                  session, ensuring proper form and maximum results.
                </p>
              </div>

            <Row className="classes-grid">
              {classesData.map((fitnessClass) => (
                <Col key={fitnessClass.id} lg={4} md={6} sm={12} className="class-col ">
                  <Card className="class-card">
                    <Card.Body>
                      <Card.Title className="class-name">{fitnessClass.name}</Card.Title>
                      <Card.Text className="class-description">{fitnessClass.description}</Card.Text>
                      <div className="class-details">
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{fitnessClass.duration}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Intensity:</span>
                          <span className="detail-value">{fitnessClass.intensity}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Instructor:</span>
                          <span className="detail-value">{fitnessClass.instructor}</span>
                        </div>
                      </div>
                      <button className="book-class-btn">Book Class</button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Container>
      </div>
    </DynamicBackground>
  );
};

export default Classes;
