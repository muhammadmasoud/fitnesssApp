import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  currentUser: null,
  loading: true,
  error: null,
};

// Async thunks for authentication operations
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to initialize auth');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Get existing users or initialize empty array
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if email already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Create new user with ID
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      // Add to users array
      users.push(newUser);

      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(users));

      return newUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Find user with matching email and password
      const user = users.find(user =>
        user.email === email && user.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create a user object without the password for security
      const userWithoutPassword = {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      };

      // Save to sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }

      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Find and update the user
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, ...userData };
        }
        return user;
      });

      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user
      const updatedUser = { ...currentUser, ...userData };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem('currentUser');
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { logout, clearError, setError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
