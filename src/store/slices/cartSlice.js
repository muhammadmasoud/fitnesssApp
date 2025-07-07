import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to initialize cart from localStorage
export const initializeCart = createAsyncThunk(
  'cart/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to initialize cart');
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity if item exists
        state.items = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        state.items.push({ ...product, quantity: 1 });
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        state.items = state.items.filter(item => item.id !== productId);
      } else {
        // Update quantity
        state.items = state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        );
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Helper selectors
export const selectTotalPrice = (state) => {
  return state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const selectCartCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};
