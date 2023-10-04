//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

//-----------------------------------------------------------------------------
// Map
//-----------------------------------------------------------------------------
export interface AllMaps {
  [edgeId: Map['id']]: Map
}
export interface Map {
  id: string
}

export interface MapSliceState {
  allMaps: AllMaps
}

//-----------------------------------------------------------------------------
// Local Storage
//-----------------------------------------------------------------------------
// Clear Local Storage
const clearLocalStorage: () => void = () => {
  localStorage.removeItem('allMaps')
}

// Save State To Local Storage
const saveStateToLocalStorage: (state: MapSliceState) => void = (state) => {
  localStorage.setItem('allMaps', JSON.stringify(state.allMaps))
}


// Initial State
const initialState: MapSliceState = {
  allMaps: {}
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const mapSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    createMapReducer: (
      state,
      action: PayloadAction<Map>
    ) => {
      const newMap = action.payload
      state.allMaps = {
        ...state.allMaps,
        [newMap.id]: newMap
      }
      saveStateToLocalStorage(state)
    }
  }
})

export const {
  createMapReducer
} = mapSlice.actions
export default mapSlice.reducer
