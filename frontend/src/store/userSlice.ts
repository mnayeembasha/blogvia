import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { type UserType } from '../types';
import type { RootState } from '.';

export interface UserState {
  followers: UserType[];
  isLoadingFollowers: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

const initialState: UserState = {
  followers: [],
  isLoadingFollowers: false,
};

// Async thunks
export const fetchFollowers = createAsyncThunk<
  UserType[],
  void,
  { rejectValue: ApiError }
>(
  'user/fetchFollowers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.authUser?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      const res = await axiosInstance.get(`/users/${userId}/followers`);
      return res.data.followers;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch followers';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.isLoadingFollowers = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.isLoadingFollowers = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state) => {
        state.isLoadingFollowers = false;
      });
  },
});

export default userSlice.reducer;