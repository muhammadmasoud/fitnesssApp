import { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import './About.css';
import fitness from '../assets/optimized/fitness.jpg';

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const statsRef = useRef(null);
  // Store a reference to the observer for cleanup
  const observerRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Member since 2020",
      quote: "This gym completely transformed my life. The trainers are exceptional and the community is so supportive. I&apos;ve lost 30 pounds and gained confidence I never thought possible.",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Member since 2019",
      quote: "The personalized training programs here are unmatched. I&apos;ve tried many gyms before, but the attention to detail and genuine care from the staff makes this place special.",
      image: "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Member since 2021",
      quote: "Not only have I achieved my fitness goals, but I&apos;ve made lifelong friends. The community events and challenges keep me motivated and excited about my fitness journey.",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Member since 2018",
      quote: "As someone who was intimidated by gyms, I can&apos;t express how welcoming this environment is. The trainers meet you where you are and help you grow at your own pace.",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 5,
      name: "Jennifer Lee",
      role: "Member since 2022",
      quote: "The variety of classes keeps my workouts fresh and exciting. I&apos;ve never been this consistent with exercise before, and it&apos;s all thanks to the engaging programs and motivating instructors.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 6,
      name: "Robert Garcia",
      role: "Member since 2019",
      quote: "After my injury, I was afraid to get back into fitness. The trainers here designed a rehabilitation program that helped me recover safely and build strength gradually. I&apos;m now stronger than before my injury!",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
      id: 7,
      name: "Olivia Thompson",
      role: "Member since 2021",
      quote: "The nutrition guidance alongside the workout plans has been a game-changer. I&apos;ve learned how to fuel my body properly, and the results speak for themselves. My energy levels are through the roof!",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
      id: 8,
      name: "James Mitchell",
      role: "Member since 2020",
      quote: "As a busy professional, I appreciate the flexible scheduling and the efficiency of the workouts. In just 45 minutes, I get a complete session that keeps me fit despite my hectic lifestyle.",
      image: "https://randomuser.me/api/portraits/men/36.jpg"
    },
    {
      id: 9,
      name: "Sophia Patel",
      role: "Member since 2022",
      quote: "The online coaching during the pandemic was exceptional. They didn&apos;t miss a beat in providing quality instruction, and the transition back to in-person training was seamless. Truly professional service!",
      image: "https://randomuser.me/api/portraits/women/57.jpg"
    }
  ];

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    // Store a reference to the current statsRef and observerRef values for cleanup
    const currentStatsRef = statsRef.current;
    const currentObserver = observerRef.current;

    return () => {
      clearInterval(interval);
      if (currentStatsRef && currentObserver) {
        currentObserver.unobserve(currentStatsRef);
      }
    };
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  // Animation removed for better performance

  return (
    <div className="about-page">
      <section className="about-hero-section">
        <div className="about-hero-content">
          <h1 className="about-hero-title">ABOUT US</h1>
          <p className="about-hero-subtitle">
            Our mission is to empower individuals in our community to lead healthier, stronger,<br />
            and more confident lives. We believe fitness is not just about physical strength —<br />
            it&apos;s about building self-concern, cultivating self-love, and creating a positive mindset<br />
            that lasts a lifetime.
          </p>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="expertise-section">
        <div className="expertise-container">
          <div className="expertise-main">
            <div className="expertise-image">
              <img src={fitness} alt="Fitness trainer" />
            </div>
            <div className="expertise-content">
              <div className="expertise-subtitle">INFORMATION ABOUT US</div>
              <h2 className="expertise-title"><span>FITNESS</span> WORKOUT<br />TRAINING CENTER</h2>
              <p className="expertise-description">
                At FITNESS, we bring a decade of specialized experience in fitness training and wellness coaching.
                Our team of certified professionals is dedicated to providing personalized fitness solutions that
                address your unique needs and goals.
              </p>
              <ul className="expertise-list">
                <li className="expertise-list-item">
                  <i className="fas fa-chevron-right"></i>
                  <span>MEN FITNESS AND WORKOUT</span>
                </li>
                <li className="expertise-list-item">
                  <i className="fas fa-chevron-right"></i>
                  <span>WOMEN FITNESS AND WORKOUT</span>
                </li>
                <li className="expertise-list-item">
                  <i className="fas fa-chevron-right"></i>
                  <span>PERSONAL TRAININGS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Full-width Stats Ribbon */}
        <div className="stats-ribbon">
          <div className="stats-ribbon-content">
            <div className="stats-ribbon-item">
              <div className="stats-number">10+</div>
              <div className="stats-label">YEARS OF EXPERIENCE</div>
            </div>

            <div className="stats-ribbon-item">
              <div className="stats-number">45+</div>
              <div className="stats-label">FITNESS TRAINERS</div>
            </div>

            <div className="stats-ribbon-item">
              <div className="stats-number">310+</div>
              <div className="stats-label">BEST EQUIPMENTS</div>
            </div>

            <div className="stats-ribbon-item">
              <div className="stats-number">20k+</div>
              <div className="stats-label">SATISFIED CLIENTS</div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">WHAT OUR COMMUNITY SAYS</h2>
          <div className="section-divider"></div>
        </div>

        <Container>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-image-container">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="testimonial-image"
                />
              </div>
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-quote">{testimonials[currentTestimonial].quote}</p>
                <h3 className="testimonial-name">{testimonials[currentTestimonial].name}</h3>
                <p className="testimonial-role">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>

            <div className="testimonial-controls">
              <button
                className="testimonial-control-btn prev-btn"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="testimonial-indicators">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-indicator ${index === currentTestimonial ? 'active' : ''}`}
                    onClick={() => goToTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  ></button>
                ))}
              </div>

              <button
                className="testimonial-control-btn next-btn"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;