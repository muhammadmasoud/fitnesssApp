// WorkoutList.jsx
import { memo, useMemo } from 'react';
import './WorkoutList.css';

const WorkoutList = () => {
  // Memoize the workouts array to prevent recreation on each render
  const workouts = useMemo(() => [
    {
      id: 1,
      title: 'Agility training',
      duration: '30 min',
      calories: 300,
      icon: 'fas fa-running'
    },
    {
      id: 2,
      title: 'Full body',
      duration: '45 min',
      calories: 310,
      icon: 'fas fa-dumbbell'
    },
    {
      id: 3,
      title: 'Tennis',
      duration: '50 min',
      calories: 257,
      icon: 'fas fa-table-tennis'
    },
    {
      id: 4,
      title: 'Stretching',
      duration: '60 min',
      calories: 186,
      icon: 'fas fa-child'
    },
    {
      id: 5,
      title: 'Power training',
      duration: '60 min',
      calories: 430,
      icon: 'fas fa-bolt'
    },
    {
      id: 6,
      title: 'Yoga',
      duration: '45 min',
      calories: 315,
      icon: 'fas fa-spa'
    },
    {
      id: 7,
      title: 'Bike',
      duration: '45 min',
      calories: 345,
      icon: 'fas fa-bicycle'
    }
  ], []); // Empty dependency array means this will only be created once

  return (
    <div className="workout-list-container">
      <h3 className="workout-list-title">Choose a workout for today</h3>
      <div className="workout-items">
        {workouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <div className="workout-icon">
              <i className={workout.icon}></i>
            </div>
            <div className="workout-info">
              <h4 className="workout-title">{workout.title}</h4>
              <p className="workout-duration">{workout.duration}</p>
            </div>
            <div className="workout-calories">{workout.calories} kcal</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(WorkoutList);
