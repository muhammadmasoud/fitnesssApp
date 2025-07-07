
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Simple toast configuration
const defaultOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

// Custom toast component
const CustomToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      ...defaultOptions,
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      ...options
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      ...defaultOptions,
      ...options
    });
  }
};

export default CustomToast;
