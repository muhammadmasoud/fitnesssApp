import { useEffect } from 'react';
import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import DynamicBackground from '../components/DynamicBackground';
import './Nutrition.css';
import nutritionBg from '../assets/optimized/nutrition-bg.jpg';

const Nutrition = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Preload the background image
    const img = new Image();
    img.src = nutritionBg;
  }, []);

  const nutritionTips = [
    {
      id: 1,
      title: 'Balanced Macronutrients',
      content: "Aim for a balanced intake of proteins, carbohydrates, and fats. Each macronutrient plays a vital role in your body's function and overall health."
    },
    {
      id: 2,
      title: 'Hydration',
      content: 'Drink at least 8 glasses of water daily. Proper hydration supports metabolism, nutrient transport, and recovery.'
    },
    {
      id: 3,
      title: 'Meal Timing',
      content: 'Eat smaller, more frequent meals throughout the day to maintain energy levels and support metabolism.'
    },
    {
      id: 4,
      title: 'Pre-Workout Nutrition',
      content: 'Consume a balanced meal with carbs and protein 1-2 hours before your workout to fuel your exercise.'
    },
    {
      id: 5,
      title: 'Post-Workout Recovery',
      content: 'Have a protein-rich snack within 30 minutes after your workout to support muscle recovery and growth.'
    }
  ];

  const mealPlans = [
    {
      id: 1,
      title: 'Weight Loss Plan',
      description: 'A calorie-controlled plan focused on nutrient-dense foods to support healthy weight loss.',
      meals: [
        { time: 'Breakfast', description: 'Greek yogurt with berries and a sprinkle of granola' },
        { time: 'Snack', description: 'Apple slices with a tablespoon of almond butter' },
        { time: 'Lunch', description: 'Grilled chicken salad with mixed greens and light vinaigrette' },
        { time: 'Snack', description: 'Carrot sticks with hummus' },
        { time: 'Dinner', description: 'Baked salmon with steamed vegetables and quinoa' }
      ]
    },
    {
      id: 2,
      title: 'Muscle Building Plan',
      description: 'Higher protein and calorie plan designed to support muscle growth and recovery.',
      meals: [
        { time: 'Breakfast', description: 'Oatmeal with whey protein, banana, and peanut butter' },
        { time: 'Snack', description: 'Protein shake with a handful of nuts' },
        { time: 'Lunch', description: 'Turkey and avocado sandwich on whole grain bread with a side of cottage cheese' },
        { time: 'Snack', description: 'Greek yogurt with honey and mixed berries' },
        { time: 'Dinner', description: 'Grilled steak with sweet potato and steamed broccoli' },
        { time: 'Before Bed', description: 'Casein protein shake or cottage cheese' }
      ]
    },
    {
      id: 3,
      title: 'Maintenance Plan',
      description: 'Balanced nutrition plan to maintain current weight and support overall health.',
      meals: [
        { time: 'Breakfast', description: 'Vegetable omelet with whole grain toast' },
        { time: 'Snack', description: 'Fruit smoothie with protein powder' },
        { time: 'Lunch', description: 'Quinoa bowl with mixed vegetables, chickpeas, and tahini dressing' },
        { time: 'Snack', description: 'Trail mix with dried fruits and nuts' },
        { time: 'Dinner', description: 'Grilled fish with brown rice and roasted vegetables' }
      ]
    }
  ];

  return (
    <DynamicBackground
      imageUrl={nutritionBg}
      className="nutrition-page"
      style={{
        paddingTop: '160px',
        paddingBottom: '100px',
        justifyContent: 'flex-start'
      }}>
      <ToastContainer />
      <Container className="nutrition-container">
        <div className="nutrition-content">
          <h1 className="nutrition-title ">NUTRITION GUIDANCE</h1>
          <div className="nutrition-items-section">
            <div className="nutrition-description">
              <h2>Nutrition is Key to Fitness Success</h2>
              <p>
                Proper nutrition is essential for achieving your fitness goals, whether you&apos;re looking to lose weight,
                build muscle, or improve your overall health. Our nutrition guidance provides you with the knowledge
                and tools to make informed dietary choices that complement your fitness routine.
              </p>
            </div>

            <div className="nutrition-tips-container ">
              <h3 className="section-title">Nutrition Tips</h3>
              <Accordion defaultActiveKey="0" className="nutrition-accordion">
                {nutritionTips.map((tip, index) => (
                  <Accordion.Item eventKey={index.toString()} key={tip.id}>
                    <Accordion.Header>{tip.title}</Accordion.Header>
                    <Accordion.Body>{tip.content}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>

            <div className="meal-plans-container">
              <h3 className="section-title">Sample Meal Plans</h3>
              <Row className="meal-plans-row">
                {mealPlans.map((plan) => (
                  <Col lg={4} md={6} sm={12} key={plan.id} className="meal-plan-col ">
                    <Card className="meal-plan-card">
                      <Card.Body>
                        <Card.Title className="meal-plan-title">{plan.title}</Card.Title>
                        <Card.Text className="meal-plan-description">{plan.description}</Card.Text>
                        <div className="meal-list">
                          {plan.meals.map((meal, index) => (
                            <div key={index} className="meal-item">
                              <div className="meal-time">{meal.time}</div>
                              <div className="meal-description">{meal.description}</div>
                            </div>
                          ))}
                        </div>
                        <button className="get-plan-btn">Get Full Plan</button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="consultation-container ">
              <div className="consultation-card">
                <h3>Need Personalized Nutrition Advice?</h3>
                <p>
                  Book a consultation with one of our nutrition experts to get a customized meal plan
                  tailored to your specific goals, preferences, and dietary requirements.
                </p>
                <button className="consultation-btn">Book Consultation</button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </DynamicBackground>
  );
};

export default Nutrition;
