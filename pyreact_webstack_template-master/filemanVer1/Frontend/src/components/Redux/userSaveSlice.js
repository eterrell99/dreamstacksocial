import { createSlice } from '@reduxjs/toolkit'

export const userSaveSlice = createSlice({
  name: 'userSave',
  initialState: {
    userSaveList: {}


  },
  reducers: {

    
    setUserSaveList: (state, action) => {
      state.userSaveList = action.payload
}
  }
})

// Action creators are generated for each case reducer function
export const { setUserSaveList } = userSaveSlice.actions;

export default userSaveSlice.reducer;