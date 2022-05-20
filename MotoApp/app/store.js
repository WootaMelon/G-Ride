import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import groupRideReducer from '../features/groupRides/groupRideSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    groupRide: groupRideReducer,
  },
});
