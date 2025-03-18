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
  name: 'map',
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
    },
    // Update Map
    updateMapReducer: (
      state,
      action: PayloadAction<{
        mapId: Map['id']
        updates: Partial<Map>
      }>
    ) => {
      state.allMaps[action.payload.mapId] = {
        ...state.allMaps[action.payload.mapId],
        ...action.payload.updates
      }
    }
  }
})

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export const {
  loadMapReducer,
  updateMapReducer
} = mapSlice.actions
export default mapSlice.reducer
