import { useEffect, useState } from 'react';

/**
 * DynamicBackground component that applies a background image to its children
 * This component ensures that when you change the imported image, the background changes too
 *
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - The imported image URL
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.overlayStyle - Custom styles for the overlay
 * @param {Object} props.style - Additional styles for the container
 * @returns {JSX.Element}
 */
const DynamicBackground = ({
  imageUrl,
  children,
  className = '',
  overlayStyle = {},
  style = {}
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setLoaded(true);
    };

    // Set loaded state after a short delay for animations even if image is cached
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [imageUrl]);

  const containerStyle = {
    minHeight: '100vh',
    opacity: 1, // Always visible
    position: 'relative',
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'scroll', // Changed from fixed to scroll for better performance
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    overflowX: 'hidden',
    ...style
  };

  const defaultOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1
  };

  return (
    <div className={`dynamic-background ${className} ${loaded ? 'loaded' : ''}`} style={containerStyle}>
      <div className="page-overlay" style={{...defaultOverlayStyle, ...overlayStyle}}></div>
      {children}
    </div>
  );
};

export default DynamicBackground;
