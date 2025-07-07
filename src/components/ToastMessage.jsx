import { useCallback } from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import './ToastMessage.css';

/**
 * ToastMessage component for displaying toast notifications
 * @param {Object} props - Component props
 * @param {string} props.title - Toast title
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, info, warning)
 * @returns {JSX.Element} - Toast message component
 */
function ToastMessage({ title, message, type = 'info' }) {
  // Get icon based on type
  const getIcon = useCallback(() => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle toast-icon success"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle toast-icon error"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle toast-icon warning"></i>;
      case 'info':
      default:
        return <i className="fas fa-info-circle toast-icon info"></i>;
    }
  }, [type]);

  return (
    <div className={`toast-message ${type}`}>
      <div className="toast-icon-container">
        {getIcon()}
      </div>
      <div className="toast-content">
        {title && <h4 className="toast-title">{title}</h4>}
        <p className="toast-text">{message}</p>
      </div>
    </div>
  );
}

ToastMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning'])
};

export default memo(ToastMessage);
