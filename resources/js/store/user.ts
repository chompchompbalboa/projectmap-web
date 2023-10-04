//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Map } from './map'
import { LaravelUser } from '@/breeze/types'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface User extends LaravelUser {
  maps: Map['id'][]
}

export interface UserSliceState extends User {}

//-----------------------------------------------------------------------------
// Initial state
//-----------------------------------------------------------------------------
const initialState: UserSliceState = {
  id: 0,
  name: '',
  email: '',
  email_verified_at: '',
  maps: []
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    updateUser: (
      state,
      action: PayloadAction<Partial<User>>
    ) => {
      state = {
        ...state,
        ...action.payload
      }
    }
  }
})

export const {
  updateUser
} = userSlice.actions
export default userSlice.reducer
