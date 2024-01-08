import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    redirectOnLogin: '/'


  },
  reducers: {

    setUserID: (state, action) => {
      state.id = action.payload
    },
    setRedirect: (state, action) => {
      state.redirectOnLogin = action.payload
}
  }
})

// Action creators are generated for each case reducer function
export const { setUserID, setRedirect} = userSlice.actions;

export default userSlice.reducer;