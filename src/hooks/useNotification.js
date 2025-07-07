import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContextDefinition';

/**
 * Custom hook to use the notification context
 * @returns {Object} Notification context value
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
