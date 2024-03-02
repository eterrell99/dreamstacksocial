import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice"; // Import the reducer, not the slice
import saveBarSlice from './saveBarSlice';

export default configureStore({
  reducer: {
    user: userReducer, // Pass the reducer, not the slice
    save: saveBarSlice
  }
});
