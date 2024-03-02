import { createSlice } from '@reduxjs/toolkit'

export const savebarSlice = createSlice({
  name: 'savebar',
  initialState: {
    saveList: {}


  },
  reducers: {

    
    setSaveList: (state, action) => {
      state.saveList = action.payload
}
  }
})

// Action creators are generated for each case reducer function
export const { setSaveList} = savebarSlice.actions;

export default savebarSlice.reducer;