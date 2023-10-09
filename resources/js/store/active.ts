//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Map } from './map'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface ActiveSliceState {
  activeMapId: Map['id'] | undefined
}

//-----------------------------------------------------------------------------
// Local Storage
//-----------------------------------------------------------------------------
// Save State To Local Storage
const saveStateToLocalStorage: (state: ActiveSliceState) => void = (state) => {
  localStorage.setItem('activeMapId', JSON.stringify(state.activeMapId))
}

// Initial State
const initialState: ActiveSliceState = {
  activeMapId: undefined
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const activeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    updateActiveMapId: (
      state,
      action: PayloadAction<Map['id']>
    ) => {
      state.activeMapId = action.payload
      saveStateToLocalStorage(state)
    }
  }
})

export const {
  updateActiveMapId
} = activeSlice.actions
export default activeSlice.reducer
