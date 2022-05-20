/*=========================
Type: Feature - Auth

Description:
groupRide Slice for creating a redux slice and reducers

=========================*/

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import groupRideService from './groupRideService';
const initialState = {
  groupRides: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createGroupRide = createAsyncThunk(
  'groupRides/create',
  async (groupRideData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groupRideService.createGroupRide(groupRideData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getGroupRides = createAsyncThunk(
  'groupRides/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groupRideService.getGroupRides(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteGroupRide = createAsyncThunk(
  'groupRides/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groupRideService.deleteGroupRide(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateGroupRide = createAsyncThunk(
  'groupRides/update',
  async (groupRideData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groupRideService.updateGroupRide(groupRideData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const groupRideSlice = createSlice({
  name: 'groupRide',
  initialState,
  reducers: {
    reset: state => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(createGroupRide.pending, state => {
        state.isLoading = true;
      })
      .addCase(createGroupRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groupRides.push(action.payload);
      })
      .addCase(createGroupRide.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGroupRides.pending, state => {
        state.isLoading = true;
      })
      .addCase(getGroupRides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groupRides = action.payload;
      })
      .addCase(getGroupRides.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteGroupRide.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteGroupRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groupRides = state.groupRides.filter(
          groupRide => groupRide._id !== action.payload._id,
        );
      })
      .addCase(deleteGroupRide.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateGroupRide.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateGroupRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateGroupRide.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {reset} = groupRideSlice.actions;

export default groupRideSlice.reducer;
