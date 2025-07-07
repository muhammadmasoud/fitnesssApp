import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';

// Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
};

import { ModalProvider } from './contexts/ModalContext';
import { FormProvider } from './contexts/FormContext';
import { NotificationProvider } from './contexts/NotificationContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast-custom.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <NotificationProvider>
        <FormProvider>
          <ModalProvider>
            <Fragment>
              <App />
              <ToastContainer />
            </Fragment>
          </ModalProvider>
        </FormProvider>
      </NotificationProvider>
    </BrowserRouter>
  </Provider>
);

// Register service worker for production
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}