//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ConnectionLineType, Edge as ReactFlowEdge } from '@xyflow/react'

import { Map } from '@/store/map'
import { Node } from '@/store/node'
import { buildNewId } from '@/utils'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface AllEdges {
  [edgeId: Edge['id']]: Edge
}
export interface Edge {
  id: string
  mapId: Map['id']
  type: 
    ConnectionLineType.Bezier | 
    ConnectionLineType.Straight | 
    ConnectionLineType.Step | 
    ConnectionLineType.SmoothStep |
    ConnectionLineType.SimpleBezier
  source: Node['id']
  target: Node['id']
}

export interface EdgeSliceState {
  allEdges: AllEdges
}

//-----------------------------------------------------------------------------
// Local Storage
//-----------------------------------------------------------------------------
// Save State To Local Storage
const saveStateToLocalStorage: (state: EdgeSliceState) => void = (state) => {
  localStorage.setItem('allEdges', JSON.stringify(state.allEdges))
}

// Build New Edge
export const buildNewEdge = ({
  id,
  mapId,
  type,
  source,
  target
}: Partial<Edge>): Edge => {
  return {
    id: id || buildNewId(),
    mapId: mapId || '',
    type: type || ConnectionLineType.Bezier,
    source: source || '',
    target: target || ''
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
    },
    updateAllEdgesReducer: (
      state,
      action: PayloadAction<{
        updates: EdgeSliceState['allEdges']
      }>
    ) => {
      state.allEdges = {
        ...state.allEdges,
        ...action.payload.updates
      }
    },
  }
})

export const {
  createEdgeReducer,
  deleteEdgeReducer,
  updateAllEdgesReducer
} = edgeSlice.actions
export default edgeSlice.reducer
