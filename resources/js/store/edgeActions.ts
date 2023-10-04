//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { createAsyncThunk } from '@reduxjs/toolkit'

import { createReactFlowEdgeReducer } from './reactFlow'
import { AppState } from './store'
import { Node } from './node'
import {
  buildNewEdge,
  createEdgeReducer,
  deleteEdgeReducer,
  Edge 
} from './edge'
import { updateNode, updateNodeDates, updateNodeDatesFromPredecessors, updateNodeSuccessorDates } from './nodeActions'

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
    const newEdge = buildNewEdge({ id, source, target })

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
      }
    }))

    // Update the predecessor node with the new successor
    dispatch(updateNode({
      nodeId: source,
      updates: {
        predecessors: [
          ...getState().node.allNodes[source].predecessors,
          target
        ]
      }
    }))

    // Add the new edge to the reactFlow slice
    dispatch(createReactFlowEdgeReducer(newEdge))
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
      }
    }))
    // Remove the source node's id from the target's predecessors
    dispatch(updateNode({
      nodeId: edge.source,
      updates: {
        predecessors: sourceNode.predecessors.filter(currentNodeId => currentNodeId !== targetNode.id)
      }
    }))
    // Update source and target dates
    dispatch(updateNodeDatesFromPredecessors({ nodeId: sourceNode.id }))
    // Delete the edge from the store
    dispatch(deleteEdgeReducer(edge.id))
  }
)
