//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { createAsyncThunk } from '@reduxjs/toolkit'

import api from '@/api'

import { AppState } from '@/store/store'
import { updateActiveMapId } from '@/store/active'
import { loadMapReducer, Map } from '@/store/map'
import { loadEdges } from '@/store/edgeActions'
import { loadNodes } from '@/store/nodeActions'
import { User } from '@/store/user'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
// Create Map
export const createMap = createAsyncThunk<
  void,
  { userId: User['id'] },
  { state: AppState }
>(
  'map/createMap',
  async ({ userId }) => {
    // Send the api request to create the new map
    api.map.createMap({ userId })
      // If the map was successfully created
      .then(response => {
        // Redirect the user to the new map
        window.open('/map/' + response.data.id, '_blank');
      })
      // If there was an error creating the map
      .catch(() => {
        // TODO: Return an error message
        console.log('There was an error creating the map')
      })
  }
)

// Load Map
export const loadMap = createAsyncThunk<
  void,
  { mapId: Map['id'] },
  { state: AppState }
>(
  'map/loadMap',
  async ({ mapId }, thunkAPI) => {
    const { dispatch } = thunkAPI
    // Send the api request to get the map
    api.map.getMap({ mapId })
      // If the map was successfully fetched
      .then(response => {
        const { map, mapNodes, mapEdges } = response.data
        // Load the map
        dispatch(loadMapReducer(map))
        // Load the nodes
        dispatch(loadNodes({ nodes: mapNodes }))
        // Load the edges
        dispatch(loadEdges({ edges: mapEdges }))
        // Update the active map id
        dispatch(updateActiveMapId(map.id))
      })
      // If there was an error getting the map
      .catch(() => {
        // TODO: Return an error message
        console.log('There was an error getting the map')
      })
  }
)
