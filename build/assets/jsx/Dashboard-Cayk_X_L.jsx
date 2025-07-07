import { useState, useEffect, useMemo, memo } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { Line, Bar } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import WorkoutList from '../components/WorkoutList';
import HeartRateChart from '../components/HeartRateChart';
import DashboardCards from '../components/DashboardCards';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Chart options and data - Memoized to prevent recreation on each render
  const lineChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for better performance
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
      },
    },
  }), []);

  const todayActivityData = useMemo(() => ({
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        data: [8000, 8200, 8100, 8600, 8500, 8700, 8800, 8900, 9000, 8950, 8990, 9000],
        fill: true,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderColor: '#ff6b6b',
        borderWidth: 2,
      },
    ],
  }), []);

  const waterBalanceData = useMemo(() => ({
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        data: [1200, 1300, 1250, 1400, 1500, 1550, 1600, 1550, 1500, 1550, 1600, 1600],
        fill: true,
        backgroundColor: 'rgba(0, 116, 217, 0.2)',
        borderColor: '#0074D9',
        borderWidth: 2,
      },
    ],
  }), []);

  const sleepData = useMemo(() => ({
    labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
      {
        label: 'NREM sleep',
        data: [4, 5, 4, 6, 5, 4, 5],
        backgroundColor: '#7b68ee',
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
      {
        label: 'REM sleep',
        data: [2, 1, 2, 1, 2, 2, 1],
        backgroundColor: '#e14eca',
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
    ],
  }), []);

  const sleepOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for better performance
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#a3a3a3',
        },
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a3a3a3',
          stepSize: 2,
          max: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }), []);

  const weightData = {
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        data: [70, 69.5, 69, 68.5, 68, 67.5, 67, 66.5, 66, 65.5, 65, 60],
        fill: false,
        backgroundColor: '#e14eca',
        borderColor: '#e14eca',
        borderWidth: 2,
      },
    ],
  };

  const stepsActivityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: '2021',
        data: [13000, 18000, 13000, 8000, 18000, 13000, 4000, 8000, 13000, 8000, 4000, 8000],
        borderColor: '#7b68ee',
        backgroundColor: 'rgba(123, 104, 238, 0.4)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '2022',
        data: [8000, 13000, 8000, 18000, 8000, 13000, 18000, 23000, 18000, 13000, 18000, 13000],
        borderColor: '#00f2c3',
        backgroundColor: 'rgba(0, 242, 195, 0.4)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const stepsActivityOptions = useMemo(() => ({
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
          callback: (value) => value / 1000 + 'k',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#a3a3a3',
          boxWidth: 10,
          usePointStyle: true,
        },
      },
    },
  }), []);

  return (
    <div className={`dashboard-page ${loaded ? 'loaded' : ''}`}>
      <div className="dashboard-background"></div>
      <Container fluid className="dashboard-container">
        <h1>Hello, {currentUser?.fullName || 'Aleksandra'}</h1>

        <div className="dashboard-grid">
          {/* Today Activity */}
          <div className="dashboard-card card-today-activity">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Today activity</h3>
            </div>
            <div className="dashboard-card-content">
              <p className="dashboard-card-value">8590/10000step</p>
              <div className="chart-container">
                <Line options={lineChartOptions} data={todayActivityData} />
              </div>
            </div>
          </div>

          {/* Water Balance */}
          <div className="dashboard-card card-water-balance">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Water balance</h3>
            </div>
            <div className="dashboard-card-content">
              <p className="dashboard-card-value">1600/1800ml</p>
              <div className="chart-container">
                <Line options={lineChartOptions} data={waterBalanceData} />
              </div>
            </div>
          </div>

          {/* Phase of Sleep */}
          <div className="dashboard-card card-sleep">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Phase of sleep</h3>
              <span>Week</span>
            </div>
            <div className="dashboard-card-content">
              <p className="dashboard-card-value">6 h</p>
              <div className="chart-container">
                <Bar options={sleepOptions} data={sleepData} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#7b68ee', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>NREM sleep</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#e14eca', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>REM sleep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="dashboard-card card-weight">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">60 kg</h3>
              <span>-0.9 kg in 6 days</span>
            </div>
            <div className="dashboard-card-content">
              <div className="chart-container">
                <Line options={lineChartOptions} data={weightData} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>58.2 kg</span>
                <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>recommended</span>
              </div>
            </div>
          </div>

          {/* Steps Activity */}
          <div className="dashboard-card card-steps-activity">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Steps activity</h3>
              <span>Year</span>
            </div>
            <div className="dashboard-card-content">
              <div className="chart-container">
                <Line options={stepsActivityOptions} data={stepsActivityData} />
              </div>
            </div>
          </div>

          {/* Gym */}
          <div className="dashboard-card card-gym">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Gym</h3>
            </div>
            <div className="dashboard-card-content">
              <div className="progress-circle-container">
                <div style={{ width: 120, height: 120, position: 'relative' }}>
                  <CircularProgressbar
                    value={320}
                    maxValue={500}
                    text={`${320}`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: '#e14eca',
                      textColor: '#ffffff',
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                    })}
                  />
                </div>
                <div className="progress-circle-label">times</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#e14eca', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Squats</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#7b68ee', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Push-ups</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#00f2c3', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Abs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stretching */}
          <div className="dashboard-card card-stretching">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Stretching</h3>
            </div>
            <div className="dashboard-card-content">
              <div className="progress-circle-container">
                <div style={{ width: 120, height: 120, position: 'relative' }}>
                  <CircularProgressbar
                    value={680}
                    maxValue={1000}
                    text={`${680}`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: '#00f2c3',
                      textColor: '#ffffff',
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                    })}
                  />
                </div>
                <div className="progress-circle-label">min</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#e14eca', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Yoga</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#7b68ee', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Pilates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#00f2c3', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Meditation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Your Meal */}
          <div className="dashboard-card card-meal">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Your meal</h3>
              <span>Today</span>
            </div>
            <div className="dashboard-card-content">
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

          {/* Calories */}
          <div className="dashboard-card card-calories">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Calories</h3>
              <span>Today</span>
            </div>
            <div className="dashboard-card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Proteins</span>
                  <div style={{ flex: 1, margin: '0 10px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '90%', height: '100%', backgroundColor: '#7b68ee', borderRadius: '3px' }}></div>
                  </div>
                  <span>90 g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Fats</span>
                  <div style={{ flex: 1, margin: '0 10px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', backgroundColor: '#e14eca', borderRadius: '3px' }}></div>
                  </div>
                  <span>60 g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Carbohydrates</span>
                  <div style={{ flex: 1, margin: '0 10px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '120%', height: '100%', backgroundColor: '#00f2c3', borderRadius: '3px' }}></div>
                  </div>
                  <span>120 g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span>Calories</span>
                  <span>2100 kcal</span>
                </div>
                <div style={{ marginTop: '10px', textAlign: 'center', color: '#a3a3a3' }}>
                  Your balance is normal
                </div>
              </div>
            </div>
          </div>

          {/* Meditation for Today */}
          <div className="dashboard-card card-meditation">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Meditation for today</h3>
            </div>
            <div className="dashboard-card-content">
              <div className="meditation-list">
                <div className="meditation-item">
                  <div className="meditation-icon">
                    <i className="fas fa-spa"></i>
                  </div>
                  <div className="meditation-details">
                    <h4 className="meditation-title">Serene Reflection</h4>
                    <p className="meditation-duration">7 min</p>
                  </div>
                  <button className="play-button">
                    <i className="fas fa-play"></i>
                  </button>
                </div>
                <div className="meditation-item">
                  <div className="meditation-icon">
                    <i className="fas fa-moon"></i>
                  </div>
                  <div className="meditation-details">
                    <h4 className="meditation-title">Spiritual Renewal</h4>
                    <p className="meditation-duration">6 min</p>
                  </div>
                  <button className="play-button">
                    <i className="fas fa-play"></i>
                  </button>
                </div>
                <div className="meditation-item">
                  <div className="meditation-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <div className="meditation-details">
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

        {/* Dashboard Cards Row */}
        <DashboardCards />

        {/* Workout List */}
        <WorkoutList />

        {/* Heart Rate Chart */}
        <HeartRateChart />
      </Container>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(Dashboard);
