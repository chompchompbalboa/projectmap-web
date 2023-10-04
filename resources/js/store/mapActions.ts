//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { createAsyncThunk } from '@reduxjs/toolkit'

import { AppState } from './store'
import { createMapReducer } from './map'
import { User } from './user'
import api from '@/api'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const createMap = createAsyncThunk<
  void,
  { userId: User['id'] },
  { state: AppState }
>(
  'reactFlow/createMap',
  async ({ userId }, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    // Send the api request to create the new map
    api.map.createMap({ userId })
      // If the map was successfully created
      .then(response => {
        // Redirect the user to the new map
        console.log(response.data)
        window.open('/map/' + response.data.id, '_blank');
      })
      // If there was an error creating the map
      .catch(() => {
        // TODO: Return an error message
        console.log('There was an error creating the map')
      })
  }
)
