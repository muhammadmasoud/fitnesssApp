
import './FireAnimation.css';

/**
 * FireAnimation component that displays a fire emoji
 * @param {Object} props - Component props
 * @param {number} props.width - Width of the container
 * @param {number} props.height - Height of the container
 * @returns {JSX.Element} - The rendered component
 */
const FireAnimation = ({ width = 40, height = 40 }) => {
  return (
    <div
      className="fire-animation-container"
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.min(width, height) * 0.7
      }}
    >
      <span role="img" aria-label="fire">🔥</span>
    </div>
  );
};

export default FireAnimation;
