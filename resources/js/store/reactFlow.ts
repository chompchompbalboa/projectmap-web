//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  Edge as ReactFlowEdge,
  HandleType as ReactFlowHandleType,
  Node as ReactFlowNode,
} from 'reactflow'

import { Node, convertNodeToReactFlowNode } from '@/store/node'
import { Edge, convertEdgeToReactFlowEdge } from '@/store/edge'

//-----------------------------------------------------------------------------
// State
//-----------------------------------------------------------------------------
export interface ReactFlowSliceState {
  active: {
    connectingHandleType: ReactFlowHandleType | null
    connectingNodeId: Node['id'] | null
    isConnecting: boolean
    selectedNodes: Node['id'][]
  }
  edges: ReactFlowEdge[]
  nodes: ReactFlowNode[]
}

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
const initialState: ReactFlowSliceState = {
  active: {
    isConnecting: false,
    connectingNodeId: null,
    connectingHandleType: null,
    selectedNodes: []
  },
  nodes: [],
  edges: []
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const reactFlowSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Create React Flow Edge
    createReactFlowEdgeReducer: (
      state,
      action: PayloadAction<Edge>
    ) => {
      const newReactFlowEdge = convertEdgeToReactFlowEdge(action.payload)
      state.edges = [
        ...state.edges,
        newReactFlowEdge
      ]
    },
    // Create React Flow Node
    createReactFlowNodeReducer: (
      state,
      action: PayloadAction<Node>
    ) => {
      const newReactFlowNode = convertNodeToReactFlowNode(action.payload)
      state.nodes = [
        ...state.nodes,
        newReactFlowNode
      ]
    },
    // Update React Flow Active
    updateReactFlowActiveReducer: (
      state,
      action: PayloadAction<Partial<ReactFlowSliceState['active']>>
    ) => {
      state.active = {
        ...state.active,
        ...action.payload
      }
    },
    // Update React Flow Edges
    updateReactFlowEdgesReducer: (
      state,
      action: PayloadAction<ReactFlowSliceState['edges']>
    ) => {
      state.edges = action.payload
    },
    // Update React Flow Nodes
    updateReactFlowNodesReducer: (
      state,
      action: PayloadAction<ReactFlowSliceState['nodes']>
    ) => {
      state.nodes = action.payload
    }
  }
})

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export const {
  createReactFlowEdgeReducer,
  createReactFlowNodeReducer,
  updateReactFlowActiveReducer,
  updateReactFlowEdgesReducer,
  updateReactFlowNodesReducer
} = reactFlowSlice.actions
export default reactFlowSlice.reducer
