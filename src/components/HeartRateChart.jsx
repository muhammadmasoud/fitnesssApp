// HeartRateChart.jsx
import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import './HeartRateChart.css';

const HeartRateChart = () => {
  // Memoize chart data to prevent recreation on each render
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
    <div className="heart-rate-container">
      <div className="heart-rate-header">
        <h3 className="heart-rate-title">Heart rate</h3>
        <span className="heart-rate-period">Week</span>
      </div>
      <div className="heart-rate-content">
        <div className="heart-rate-chart">
          <Line options={heartRateOptions} data={heartRateData} />
        </div>
        <div className="heart-rate-stats">
          <div className="heart-rate-day">
            <div className="day-label">Mo</div>
            <div className="day-label">Tu</div>
            <div className="day-label">We</div>
            <div className="day-label">Th</div>
            <div className="day-label">Fr</div>
            <div className="day-label">Sa</div>
            <div className="day-label">Su</div>
          </div>
          <div className="heart-rate-values">
            <div className="heart-rate-min">Min <span>84</span></div>
            <div className="heart-rate-max">Max <span>118</span></div>
            <div className="heart-rate-mid">Mid <span>101</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(HeartRateChart);
