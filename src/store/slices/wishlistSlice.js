import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to initialize wishlist from localStorage
export const initializeWishlist = createAsyncThunk(
  'wishlist/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to initialize wishlist');
    }
  }
);

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (!existingItem) {
        // Only add if item doesn't already exist
        state.items.push({ ...product });
      }
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(initializeWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

// Helper selectors
export const selectIsInWishlist = (state, productId) => {
  return state.wishlist.items.some(item => item.id === productId);
};

export const selectWishlistCount = (state) => {
  return state.wishlist.items.length;
};
