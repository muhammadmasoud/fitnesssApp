import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';

// Create a Redux store with optimized configuration
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  // Enable Redux DevTools extension only in development
  devTools: process.env.NODE_ENV !== 'production',
  // Optimize middleware for production
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check in production for better performance
      serializableCheck: process.env.NODE_ENV !== 'production',
      // Disable immutability check in production for better performance
      immutableCheck: process.env.NODE_ENV !== 'production',
    }),
});

export default store;
