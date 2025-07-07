import { useEffect, useState, useRef } from 'react';
import './Trainers.css';
import LoadingPlaceholder from '../components/LoadingPlaceholder';

// Import images normally to avoid issues with lazy loading images
import swimminginstructor from '../assets/optimized/swimming-instructor.jpg';
import yogainstructor from '../assets/optimized/yoga-instructor.jpg';
import crossfit from '../assets/optimized/crossfit-coach.jpg';
import nutrition from '../assets/optimized/nutrition-coach.jpg';
import Pilates from '../assets/optimized/Pilates-Instructor.jpg';

const Trainers = () => {
  const [loaded, setLoaded] = useState(false);
  const trainersRef = useRef(null);

  // Trainer data with random images from Unsplash
  const trainers = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Karate Master",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Matt Booze",
      role: "Swimming Instructor",
      image: swimminginstructor
    },
    {
      id: 3,
      name: "Janet McDonald",
      role: "Yoga Instructor",
      image: yogainstructor
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "Pilates Instructor",
      image: Pilates
    },
    {
      id: 5,
      name: "Marcus Lee",
      role: "Boxing Coach",
      image: "https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      name: "Michael Torres",
      role: "CrossFit Coach",
      image: crossfit
    },
    {
      id: 7,
      name: "Henry Boston",
      role: "Fitness Coach",
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 8,
      name: "Emma Rodriguez",
      role: "Nutrition Coach",
      image: nutrition
    }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Use setTimeout to delay showing content for smoother loading
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`trainers-page ${loaded ? 'loaded' : ''}`}>
      {/* Expert Trainers Section */}
      <section className="trainers-section" ref={trainersRef}>
        <h2 className="trainers-title">EXPERT TRAINERS</h2>
        <p className="trainers-description">
          Meet our team of certified fitness professionals dedicated to helping you achieve your fitness goals.
          Our trainers specialize in various disciplines to provide personalized guidance for your unique journey.
        </p>

        <div className="trainers-container">
          {loaded ? (
            trainers.map((trainer) => (
              <div key={trainer.id} className="trainer-card">
                <div className="trainer-image-container">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="trainer-image"
                    loading="lazy"
                    width="240"
                    height="300"
                  />
                  <div className="trainer-social">
                    <a href="https://www.instagram.com/" className="social-icon"><i className="fab fa-instagram"></i></a>
                    <a href="https://x.com/" className="social-icon"><i className="fa-brands fa-x-twitter"></i></a>
                  </div>
                </div>
                <div className="trainer-info">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <p className="trainer-role">{trainer.role}</p>
                </div>
              </div>
            ))
          ) : (
            <LoadingPlaceholder type="card" count={5} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Trainers;
