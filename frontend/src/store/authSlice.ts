// Modified authSlice.ts (complete code with fixed updateProfile)
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { type UserType, type SignUpDataType, type LoginDataType } from '../types';
import type { RootState } from '.';

export interface AuthState {
    authUser: UserType | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isLoggingOut: boolean;
    isCheckingAuth: boolean;
}
export interface ApiError {
    message: string;
    status?: number;
}

// Initial state
const initialState: AuthState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isLoggingOut: false,
  isCheckingAuth: true,
};


// Async thunks
export const checkAuth = createAsyncThunk<UserType, void, { rejectValue: ApiError }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/check');
      return res.data;
    } catch (error) {
      console.log('Error in checking auth:', error);
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Authentication check failed',
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const signup = createAsyncThunk<UserType, SignUpDataType, { rejectValue: ApiError }>(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      toast.success('Account created successfully');
      return res.data;
    } catch (error) {
      let errorMessage = 'Error occurred';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Signup failed';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const login = createAsyncThunk<UserType, LoginDataType, { rejectValue: ApiError }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      toast.success('Login successful');
      return res.data;
    } catch (error) {
      let errorMessage = 'Error occurred';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Login failed';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const updateProfile = createAsyncThunk<UserType, Partial<UserType>, { rejectValue: ApiError }>(
  'auth/updateProfile',
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState; // Assume RootState
      const userId = state.auth.authUser?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      const res = await axiosInstance.put(`/users/${userId}`, data);
      toast.success('Profile updated successfully');
      return res.data.user;
    } catch (error) {
      let errorMessage = 'Error occurred';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Profile update failed';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: ApiError }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      let errorMessage = 'Error occurred';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Logout failed';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.authUser = null;
    },
    setAuthUser: (state, action: PayloadAction<UserType>) => {
      state.authUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoggingOut = false;
      });
  },
});

export const { clearAuth,setAuthUser } = authSlice.actions;
export default authSlice.reducer;