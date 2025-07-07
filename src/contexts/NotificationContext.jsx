import { useCallback } from 'react';
import { toast } from 'react-toastify';
import ToastMessage from '../components/ToastMessage';
import { NOTIFICATION_TYPES, DEFAULT_TOAST_OPTIONS } from '../constants/notificationConstants';
import { NotificationContext } from './NotificationContextDefinition';

/**
 * Notification provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Notification provider component
 */
export const NotificationProvider = ({ children }) => {
  /**
   * Show a notification
   * @param {string} type - Notification type
   * @param {string} message - Notification message
   * @param {Object} options - Toast options
   */
  const notify = useCallback((type, message, options = {}) => {
    const toastOptions = { ...DEFAULT_TOAST_OPTIONS, ...options };

    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(message, toastOptions);
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(message, toastOptions);
        break;
      case NOTIFICATION_TYPES.INFO:
        toast.info(message, toastOptions);
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast.warning(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  }, []);

  /**
   * Show a success notification
   * @param {string} message - Notification message
   * @param {Object} options - Toast options
   */
  const success = useCallback((message, options = {}) => {
    notify(NOTIFICATION_TYPES.SUCCESS, message, options);
  }, [notify]);

  /**
   * Show an error notification
   * @param {string} message - Notification message
   * @param {Object} options - Toast options
   */
  const error = useCallback((message, options = {}) => {
    notify(NOTIFICATION_TYPES.ERROR, message, options);
  }, [notify]);

  /**
   * Show an info notification
   * @param {string} message - Notification message
   * @param {Object} options - Toast options
   */
  const info = useCallback((message, options = {}) => {
    notify(NOTIFICATION_TYPES.INFO, message, options);
  }, [notify]);

  /**
   * Show a warning notification
   * @param {string} message - Notification message
   * @param {Object} options - Toast options
   */
  const warning = useCallback((message, options = {}) => {
    notify(NOTIFICATION_TYPES.WARNING, message, options);
  }, [notify]);

  /**
   * Show a custom notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   * @param {Object} options - Toast options
   */
  const custom = useCallback((title, message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
    const toastOptions = { ...DEFAULT_TOAST_OPTIONS, ...options };

    toast(
      <ToastMessage title={title} message={message} type={type} />,
      toastOptions
    );
  }, []);

  /**
   * Show a cart notification
   * @param {string} productName - Product name
   * @param {string} action - Action (added, removed, updated)
   * @param {Object} options - Toast options
   */
  const cartNotification = useCallback((productName, action, options = {}) => {
    const toastOptions = { ...DEFAULT_TOAST_OPTIONS, ...options };

    let title = '';
    let message = '';
    let type = NOTIFICATION_TYPES.INFO;

    switch (action) {
      case 'added':
        title = 'Added to Cart';
        message = `${productName} has been added to your cart.`;
        type = NOTIFICATION_TYPES.SUCCESS;
        break;
      case 'removed':
        title = 'Removed from Cart';
        message = `${productName} has been removed from your cart.`;
        type = NOTIFICATION_TYPES.INFO;
        break;
      case 'updated':
        title = 'Cart Updated';
        message = `${productName} quantity has been updated.`;
        type = NOTIFICATION_TYPES.INFO;
        break;
      default:
        title = 'Cart Updated';
        message = `Your cart has been updated.`;
    }

    toast(
      <ToastMessage title={title} message={message} type={type} />,
      toastOptions
    );
  }, []);

  /**
   * Dismiss all notifications
   */
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Context value
  const contextValue = {
    notify,
    success,
    error,
    info,
    warning,
    custom,
    cartNotification,
    dismissAll
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};


