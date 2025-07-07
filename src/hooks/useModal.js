import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContextDefinition';

/**
 * Custom hook to use the modal context
 * @returns {Object} Modal context value
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
