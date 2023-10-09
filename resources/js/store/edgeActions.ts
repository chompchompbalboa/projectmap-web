//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { createAsyncThunk } from '@reduxjs/toolkit'

import api from '@/api'
import {
   createReactFlowEdgeReducer, 
   ReactFlowSliceState,
   updateReactFlowEdgesReducer
} from '@/store/reactFlow'
import { AppState } from '@/store/store'
import { Node } from '@/store/node'
import {
  buildNewEdge,
  convertEdgeToReactFlowEdge,
  createEdgeReducer,
  deleteEdgeReducer,
  Edge, 
  EdgeSliceState,
  updateAllEdgesReducer
} from '@/store/edge'
import { updateNode, updateNodeDatesFromPredecessors } from '@/store/nodeActions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const createEdge = createAsyncThunk<
  void,
  { id?: Edge['id'], source: Node['id'], target: Node['id'] },
  { state: AppState }
>(
  'reactFlow/createEdge',
  async ({ id, source, target }, thunkAPI) => {
    const { getState, dispatch } = thunkAPI

    // Build the new edge
    const newEdge = buildNewEdge({ 
      id,
      mapId: getState().active.activeMapId,
      source, 
      target 
    })
    // Add the new edge to the edge slice
    dispatch(createEdgeReducer(newEdge))

    // Update the predecessor node with the new successor
    dispatch(updateNode({
      nodeId: target,
      updates: { 
        successors: [
          ...getState().node.allNodes[target].successors,
          source
        ]
      },
      skipApiUpdate: true
    }))

    // Update the predecessor node with the new successor
    dispatch(updateNode({
      nodeId: source,
      updates: {
        predecessors: [
          ...getState().node.allNodes[source].predecessors,
          target
        ]
      },
      skipApiUpdate: true
    }))

    // Add the new edge to the reactFlow slice
    dispatch(createReactFlowEdgeReducer(newEdge))

    // Send the newly created edge to the api
    api.edge.createEdge(newEdge)
  }
)

export const deleteEdge = createAsyncThunk<
  void,
  { id: Edge['id'] },
  { state: AppState }
>(
  'reactFlow/createEdge',
  async ({ id }, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const edge = getState().edge.allEdges[id]
    const sourceNode = getState().node.allNodes[edge.source]
    const targetNode = getState().node.allNodes[edge.target]
    
    // Remove the source node's id from the target's successors
    dispatch(updateNode({
      nodeId: edge.target,
      updates: {
        successors: targetNode.successors.filter(currentNodeId => currentNodeId !== sourceNode.id)
      },
      skipApiUpdate: true
    }))
    // Remove the source node's id from the target's predecessors
    dispatch(updateNode({
      nodeId: edge.source,
      updates: {
        predecessors: sourceNode.predecessors.filter(currentNodeId => currentNodeId !== targetNode.id)
      },
      skipApiUpdate: true
    }))
    // Update source and target dates
    dispatch(updateNodeDatesFromPredecessors({ nodeId: sourceNode.id }))
    // Delete the edge from the store
    dispatch(deleteEdgeReducer(edge.id))
    // Delete the edge from the api
    api.edge.deleteEdge(edge.id)
  }
)

// Load Edges
export const loadEdges = createAsyncThunk(
  'edge/loadEdges',
  async (
    {
      edges
    }: {
      edges: Edge[]
    },
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI
    // Create Edges to load
    const edgesToLoad: EdgeSliceState['allEdges'] = {}
    const reactFlowEdgesToLoad: ReactFlowSliceState['edges'] = []
    edges.forEach(edge => {
      edgesToLoad[edge.id] = edge
      reactFlowEdgesToLoad.push(convertEdgeToReactFlowEdge(edge))
    })
    // Update allEdges
    dispatch(updateAllEdgesReducer({ updates: edgesToLoad }))
    // Update reactFlow edges
    dispatch(updateReactFlowEdgesReducer(reactFlowEdgesToLoad))
  }
)
