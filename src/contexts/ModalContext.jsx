import { useState } from 'react';
import SubscriptionConfirmModal from '../components/SubscriptionConfirmModal';
import { ModalContext } from './ModalContextDefinition';

/**
 * Modal provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Modal provider component
 */
export const ModalProvider = ({ children }) => {
  // State for subscription confirmation modal
  const [subscriptionModal, setSubscriptionModal] = useState({
    isOpen: false,
    packageName: '',
    currentPackage: '',
    isOffer: false,
    onConfirm: () => {}
  });

  // Open subscription confirmation modal
  const openSubscriptionModal = (packageName, currentPackage, isOffer, onConfirm) => {
    setSubscriptionModal({
      isOpen: true,
      packageName,
      currentPackage,
      isOffer,
      onConfirm
    });
  };

  // Close subscription confirmation modal
  const closeSubscriptionModal = () => {
    setSubscriptionModal(prev => ({ ...prev, isOpen: false }));
  };

  // Handle subscription confirmation
  const handleSubscriptionConfirm = () => {
    subscriptionModal.onConfirm();
    closeSubscriptionModal();
  };

  // Context value
  const contextValue = {
    openSubscriptionModal,
    closeSubscriptionModal
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Render modals here so they're available globally */}
      <SubscriptionConfirmModal
        show={subscriptionModal.isOpen}
        onHide={closeSubscriptionModal}
        onConfirm={handleSubscriptionConfirm}
        packageName={subscriptionModal.packageName}
        currentPackage={subscriptionModal.currentPackage}
        isOffer={subscriptionModal.isOffer}
      />
    </ModalContext.Provider>
  );
};


