
import './LogoAnimation.css';
import logoPng from '../assets/optimized/logo.png';

/**
 * LogoAnimation component that displays the logo
 * @param {Object} props - Component props
 * @param {number} props.width - Width of the container
 * @param {number} props.height - Height of the container
 * @param {Object} props.style - Additional styles to apply to the container
 * @returns {JSX.Element} - The rendered component
 */
const LogoAnimation = ({
  width = 150,
  height = 150,
  style = {}
}) => {
  return (
    <div
      className="logo-animation-container"
      style={{
        width,
        height,
        ...style
      }}
    >
      <img
        src={logoPng}
        alt="FITNESS Logo"
        className="logo-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default LogoAnimation;
