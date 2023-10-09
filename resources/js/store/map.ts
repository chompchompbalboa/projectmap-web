//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface Map {
  id: string
  name: string
}

//-----------------------------------------------------------------------------
// Slice State
//-----------------------------------------------------------------------------
export interface MapSliceState {
  allMaps: {[mapId: Map['id']]: Map}
}

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
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
    // Load Map
    loadMapReducer: (
      state,
      action: PayloadAction<Map>
    ) => {
      const newMap = action.payload
      state.allMaps = {
        ...state.allMaps,
        [newMap.id]: newMap
      }
    }
  }
})

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export const {
  loadMapReducer
} = mapSlice.actions
export default mapSlice.reducer
