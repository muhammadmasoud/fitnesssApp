import { useState, useEffect } from 'react';
import { Container, Table, Nav } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import DynamicBackground from '../components/DynamicBackground';
import './Schedule.css';
import scheduleBg from '../assets/optimized/schedule-bg.jpg';

const Schedule = () => {
  const [activeDay, setActiveDay] = useState('monday');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Preload the background image
    const img = new Image();
    img.src = scheduleBg;
  }, []);

  const scheduleData = {
    monday: [
      { time: '06:00 - 07:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' },
      { time: '08:00 - 09:00', className: 'HIIT', trainer: 'Mike Thompson', room: 'Main Hall' },
      { time: '10:00 - 11:00', className: 'Pilates', trainer: 'Emma Rodriguez', room: 'Studio 2' },
      { time: '12:00 - 13:00', className: 'Spinning', trainer: 'David Clark', room: 'Cycling Room' },
      { time: '17:00 - 18:00', className: 'Zumba', trainer: 'Maria Sanchez', room: 'Main Hall' },
      { time: '19:00 - 20:00', className: 'CrossFit', trainer: 'James Wilson', room: 'CrossFit Box' }
    ],
    tuesday: [
      { time: '06:00 - 07:00', className: 'CrossFit', trainer: 'James Wilson', room: 'CrossFit Box' },
      { time: '08:00 - 09:00', className: 'Pilates', trainer: 'Emma Rodriguez', room: 'Studio 2' },
      { time: '10:00 - 11:00', className: 'Spinning', trainer: 'David Clark', room: 'Cycling Room' },
      { time: '12:00 - 13:00', className: 'HIIT', trainer: 'Mike Thompson', room: 'Main Hall' },
      { time: '17:00 - 18:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' },
      { time: '19:00 - 20:00', className: 'Zumba', trainer: 'Maria Sanchez', room: 'Main Hall' }
    ],
    wednesday: [
      { time: '06:00 - 07:00', className: 'Spinning', trainer: 'David Clark', room: 'Cycling Room' },
      { time: '08:00 - 09:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' },
      { time: '10:00 - 11:00', className: 'Zumba', trainer: 'Maria Sanchez', room: 'Main Hall' },
      { time: '12:00 - 13:00', className: 'CrossFit', trainer: 'James Wilson', room: 'CrossFit Box' },
      { time: '17:00 - 18:00', className: 'HIIT', trainer: 'Mike Thompson', room: 'Main Hall' },
      { time: '19:00 - 20:00', className: 'Pilates', trainer: 'Emma Rodriguez', room: 'Studio 2' }
    ],
    thursday: [
      { time: '06:00 - 07:00', className: 'HIIT', trainer: 'Mike Thompson', room: 'Main Hall' },
      { time: '08:00 - 09:00', className: 'Zumba', trainer: 'Maria Sanchez', room: 'Main Hall' },
      { time: '10:00 - 11:00', className: 'CrossFit', trainer: 'James Wilson', room: 'CrossFit Box' },
      { time: '12:00 - 13:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' },
      { time: '17:00 - 18:00', className: 'Pilates', trainer: 'Emma Rodriguez', room: 'Studio 2' },
      { time: '19:00 - 20:00', className: 'Spinning', trainer: 'David Clark', room: 'Cycling Room' }
    ],
    friday: [
      { time: '06:00 - 07:00', className: 'Pilates', trainer: 'Emma Rodriguez', room: 'Studio 2' },
      { time: '08:00 - 09:00', className: 'CrossFit', trainer: 'James Wilson', room: 'CrossFit Box' },
      { time: '10:00 - 11:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' },
      { time: '12:00 - 13:00', className: 'Zumba', trainer: 'Maria Sanchez', room: 'Main Hall' },
      { time: '17:00 - 18:00', className: 'Spinning', trainer: 'David Clark', room: 'Cycling Room' },
      { time: '19:00 - 20:00', className: 'HIIT', trainer: 'Mike Thompson', room: 'Main Hall' }
    ],
    saturday: [
      { time: '08:00 - 09:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' },
      { time: '10:00 - 11:00', className: 'HIIT', trainer: 'Mike Thompson', room: 'Main Hall' },
      { time: '12:00 - 13:00', className: 'Pilates', trainer: 'Emma Rodriguez', room: 'Studio 2' },
      { time: '14:00 - 15:00', className: 'Zumba', trainer: 'Maria Sanchez', room: 'Main Hall' }
    ],
    sunday: [
      { time: '09:00 - 10:00', className: 'Spinning', trainer: 'David Clark', room: 'Cycling Room' },
      { time: '11:00 - 12:00', className: 'CrossFit', trainer: 'James Wilson', room: 'CrossFit Box' },
      { time: '13:00 - 14:00', className: 'Morning Yoga', trainer: 'Sarah Johnson', room: 'Studio 1' }
    ]
  };

  return (
    <DynamicBackground imageUrl={scheduleBg} className="schedule-page">
      <ToastContainer />
      <Container className="schedule-container">
        <div className="schedule-content">
          <h1 className="schedule-title ">CLASS SCHEDULE</h1>
          <div className="schedule-items-section">
            <div className="schedule-description">
              <h2>Weekly Class Schedule</h2>
              <p>
                Find the perfect time for your workout with our weekly class schedule.
                We offer a variety of classes throughout the day to accommodate your busy lifestyle.
              </p>
            </div>

            <div className="schedule-tabs-container">
              <Nav variant="tabs" className="schedule-tabs">
                {Object.keys(scheduleData).map((day) => (
                  <Nav.Item key={day}>
                    <Nav.Link
                      className={activeDay === day ? 'active' : ''}
                      onClick={() => setActiveDay(day)}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>

            <div className="schedule-table-container ">
              <Table responsive className="schedule-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Trainer</th>
                    <th>Room</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData[activeDay].map((session, index) => (
                    <tr key={index}>
                      <td>{session.time}</td>
                      <td>{session.className}</td>
                      <td>{session.trainer}</td>
                      <td>{session.room}</td>
                      <td>
                        <button className="book-btn">Book</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Container>
    </DynamicBackground>
  );
};

export default Schedule;
