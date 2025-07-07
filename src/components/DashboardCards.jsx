// DashboardCards.jsx
import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import './DashboardCards.css';

const DashboardCards = () => {
  // Heart Rate Chart Data - Memoized to prevent recreation on each render
  const heartRateData = useMemo(() => ({
    labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
      {
        data: [80, 100, 85, 120, 90, 75, 95],
        fill: true,
        backgroundColor: 'rgba(225, 78, 202, 0.2)',
        borderColor: '#e14eca',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }), []);

  // Memoize chart options to prevent recreation on each render
  const heartRateOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for better performance
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a3a3a3',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a3a3a3',
          stepSize: 20,
          min: 60,
          max: 120,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5,
      },
    },
  }), []);

  return (
    <div className="dashboard-cards-row">
      {/* Heart Rate Card */}
      <div className="dashboard-card-item">
        <div className="card-header">
          <h3 className="card-title">Heart rate</h3>
          <span className="card-period">Week</span>
        </div>
        <div className="card-content">
          <div className="heart-rate-chart">
            <Line options={heartRateOptions} data={heartRateData} />
          </div>
          <div className="heart-rate-info">
            <div className="heart-rate-days">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </div>
            <div className="heart-rate-stats">
              <div className="heart-rate-stat">
                <span className="stat-label">Min</span>
                <span className="stat-value">84</span>
              </div>
              <div className="heart-rate-stat">
                <span className="stat-label">Max</span>
                <span className="stat-value">118</span>
              </div>
              <div className="heart-rate-stat">
                <span className="stat-label">Mid</span>
                <span className="stat-value">101</span>
              </div>
            </div>
            <div className="heart-rate-date">
              <span>Th, 11 Dec 2022</span>
              <span>84 BPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Meal Card */}
      <div className="dashboard-card-item">
        <div className="card-header">
          <h3 className="card-title">Your meal</h3>
          <span className="card-period">Today</span>
        </div>
        <div className="card-content">
          <div className="meal-list">
            <div className="meal-item">
              <span className="meal-name">Eggs</span>
              <span className="meal-amount">100 gr</span>
              <span className="meal-calories">315 kcal</span>
            </div>
            <div className="meal-item">
              <span className="meal-name">Chicken Curry</span>
              <span className="meal-amount">210 gr</span>
              <span className="meal-calories">515 kcal</span>
            </div>
            <div className="meal-item">
              <span className="meal-name">Carbonara paste</span>
              <span className="meal-amount">310 gr</span>
              <span className="meal-calories">720 kcal</span>
            </div>
            <div className="meal-item">
              <span className="meal-name">Banana</span>
              <span className="meal-amount">120 gr</span>
              <span className="meal-calories">104 kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calories Card */}
      <div className="dashboard-card-item">
        <div className="card-header">
          <h3 className="card-title">Calories</h3>
          <span className="card-period">Today</span>
        </div>
        <div className="card-content">
          <div className="calories-list">
            <div className="calories-item">
              <span className="nutrient-name">Proteins</span>
              <div className="progress-bar">
                <div className="progress-fill proteins"></div>
              </div>
              <span className="nutrient-value">90 g</span>
            </div>
            <div className="calories-item">
              <span className="nutrient-name">Fats</span>
              <div className="progress-bar">
                <div className="progress-fill fats"></div>
              </div>
              <span className="nutrient-value">60 g</span>
            </div>
            <div className="calories-item">
              <span className="nutrient-name">Carbohydrates</span>
              <div className="progress-bar">
                <div className="progress-fill carbs"></div>
              </div>
              <span className="nutrient-value">120 g</span>
            </div>
            <div className="calories-total">
              <span>Calories</span>
              <span>2100 kcal</span>
            </div>
            <div className="calories-status">
              Your balance is normal
            </div>
          </div>
        </div>
      </div>

      {/* Meditation Card */}
      <div className="dashboard-card-item">
        <div className="card-header">
          <h3 className="card-title">Meditation for today</h3>
        </div>
        <div className="card-content">
          <div className="meditation-list">
            <div className="meditation-item">
              <div className="meditation-thumbnail">
                <div className="meditation-icon">
                  <i className="fas fa-spa"></i>
                </div>
              </div>
              <div className="meditation-info">
                <h4 className="meditation-title">Serene Reflection</h4>
                <p className="meditation-duration">7 min</p>
              </div>
              <button className="play-button">
                <i className="fas fa-play"></i>
              </button>
            </div>
            <div className="meditation-item">
              <div className="meditation-thumbnail">
                <div className="meditation-icon">
                  <i className="fas fa-moon"></i>
                </div>
              </div>
              <div className="meditation-info">
                <h4 className="meditation-title">Spiritual Renewal</h4>
                <p className="meditation-duration">6 min</p>
              </div>
              <button className="play-button">
                <i className="fas fa-play"></i>
              </button>
            </div>
            <div className="meditation-item">
              <div className="meditation-thumbnail">
                <div className="meditation-icon">
                  <i className="fas fa-heart"></i>
                </div>
              </div>
              <div className="meditation-info">
                <h4 className="meditation-title">Self-love</h4>
                <p className="meditation-duration">11 min</p>
              </div>
              <button className="play-button">
                <i className="fas fa-play"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(DashboardCards);
