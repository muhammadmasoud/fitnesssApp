import './LoadingPlaceholder.css';

/**
 * A simple loading placeholder component
 * @param {Object} props - Component props
 * @param {string} props.type - The type of placeholder ('card', 'text', etc.)
 * @param {number} props.count - Number of placeholder items to show
 * @param {Object} props.style - Additional styles to apply
 * @returns {JSX.Element} - The rendered component
 */
const LoadingPlaceholder = ({ type = 'card', count = 1, style = {} }) => {
  const renderPlaceholders = () => {
    const placeholders = [];
    for (let i = 0; i < count; i++) {
      placeholders.push(
        <div key={i} className={`loading-placeholder loading-placeholder-${type}`} style={style}>
          <div className="loading-shimmer"></div>
        </div>
      );
    }
    return placeholders;
  };

  return <>{renderPlaceholders()}</>;
};

export default LoadingPlaceholder;
