
import { Container } from 'react-bootstrap';
import './Services.css';

const Services = () => {
  return (
    <div className="services-page">
      <Container className="pt-5 mt-5 services-container">
        <h1 className="services-title">Our Services</h1>
        <p className="services-description">Discover our comprehensive range of fitness services and programs.</p>
      </Container>
    </div>
  );
};

export default Services;