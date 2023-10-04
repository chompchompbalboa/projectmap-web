//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { buildNewId } from '../utils'
import { Node } from './node'
import { Edge as ReactFlowEdge } from 'reactflow'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface AllEdges {
  [edgeId: Edge['id']]: Edge
}
export interface Edge {
  id: string
  source: Node['id']
  target: Node['id']
}

export interface EdgeSliceState {
  allEdges: AllEdges
}

//-----------------------------------------------------------------------------
// Local Storage
//-----------------------------------------------------------------------------
// Clear Local Storage
const clearLocalStorage: () => void = () => {
  localStorage.removeItem('allEdges')
}

// Save State To Local Storage
const saveStateToLocalStorage: (state: EdgeSliceState) => void = (state) => {
  localStorage.setItem('allEdges', JSON.stringify(state.allEdges))
}

// Build New Edge
export const buildNewEdge = ({
  id,
  source,
  target
}: {
  id: Edge['id'] | undefined
  source: Node['id']
  target: Node['id']
}): Edge => {
  return {
    id: id || buildNewId(),
    source: source,
    target: target
  }
}

// Convert Edge To React Flow Edge
export const convertEdgeToReactFlowEdge = (edge: Edge): ReactFlowEdge => {
  return {
    ...edge
  }
}

// Initial State
const initialState: EdgeSliceState = {
  allEdges: localStorage.getItem('allEdges')
    ? (JSON.parse(localStorage.getItem('allEdges') as string) as EdgeSliceState['allEdges'])
    : {}
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const edgeSlice = createSlice({
  name: 'edge',
  initialState,
  reducers: {
    createEdgeReducer: (
      state,
      action: PayloadAction<Edge>
    ) => {
      const newEdge = action.payload
      state.allEdges = {
        ...state.allEdges,
        [newEdge.id]: newEdge
      }
      saveStateToLocalStorage(state)
    },
    deleteEdgeReducer: (
      state,
      action: PayloadAction<Edge['id']>
    ) => {
      const {
        [action.payload]: edgeToDeleteId,
        ...nextAllEdges
      } = state.allEdges
      state.allEdges = nextAllEdges
      saveStateToLocalStorage(state)
    }
  }
})

export const {
  createEdgeReducer,
  deleteEdgeReducer
} = edgeSlice.actions
export default edgeSlice.reducer
