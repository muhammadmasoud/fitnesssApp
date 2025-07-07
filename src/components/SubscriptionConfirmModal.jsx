import { Modal, Button } from 'react-bootstrap';

const SubscriptionConfirmModal = ({
  show,
  onHide,
  onConfirm,
  packageName,
  currentPackage,
  isOffer = false
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      className="subscription-confirm-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Subscription Change</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="warning-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <p>
          You are already subscribed to <strong>{currentPackage}</strong>.
        </p>
        <p>
          Subscribing to <strong>{packageName}</strong> will cancel your current {isOffer ? 'special offer' : 'subscription plan'}.
        </p>
        <p className="confirm-question">
          Are you sure you want to proceed?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No, Go Back
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes, I&apos;m Sure
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionConfirmModal;
