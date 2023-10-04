//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { createAsyncThunk } from '@reduxjs/toolkit'
import { applyEdgeChanges, Connection, EdgeChange, XYPosition } from 'reactflow'

import { createEdge, deleteEdge } from './edgeActions'
import { createNode, updateNodeSuccessorDates } from './nodeActions'
import { 
  updateReactFlowActiveReducer,
  updateReactFlowEdgesReducer
} from './reactFlow'
import { AppState } from './store'
import { buildNewId } from '../utils'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const onConnect = createAsyncThunk<
  void,
  { connection: Connection },
  { state: AppState }
>('reactFlow/onConnect', async ({ connection }, thunkAPI) => {
  if (connection.source && connection.target) {
    const { dispatch } = thunkAPI
    dispatch(createEdge({ 
      source: connection.source,
      target: connection.target
    }))
    // Update the node's predecessors and successors dates
    dispatch(
      updateNodeSuccessorDates({
        nodeId: connection.target
    }))
    dispatch(updateReactFlowActiveReducer({
      isConnecting: false
    }))
  }
})

export const onConnectEnd = createAsyncThunk<
  void,
  { nodePosition: XYPosition },
  { state: AppState }
>('reactFlow/onConnectEnd', async ({ nodePosition }, thunkAPI) => {
  // Redux
  const { dispatch, getState } = thunkAPI
  const { node, reactFlow } = getState()

  // Add a new node any time a connection is dropped without connecting nodes
  if (reactFlow.active.isConnecting && reactFlow.active.connectingNodeId) {
    // Get the newNodeId and connecting nodes parentNodeId
    const newNodeId = buildNewId()
    const connectingNode = node.allNodes[reactFlow.active.connectingNodeId]
    const parentNodeId = connectingNode.parentNode

    // If there is a parentNode, adjust the position to reference the parent
    if (parentNodeId) {
      const parentNode = node.allNodes[parentNodeId]
      nodePosition.x -= parentNode.positionX || 0
      nodePosition.y -= parentNode.positionX || 0
    }
    // Create the new node
    dispatch(
      createNode({
        id: newNodeId,
        positionX: nodePosition.x,
        positionY: nodePosition.y,
        startDate: connectingNode.endDate,
        duration: 'P0D',
        endDate: connectingNode.endDate
      })
    )
    // Create the new edge
    dispatch(
      createEdge({
        source:
          reactFlow.active.connectingHandleType === 'source'
            ? reactFlow.active.connectingNodeId
            : newNodeId,
        target:
          reactFlow.active.connectingHandleType === 'source'
            ? newNodeId
            : reactFlow.active.connectingNodeId
      })
    )
    // Update the reactFlow active state
    dispatch(
      updateReactFlowActiveReducer({
        connectingNodeId: null,
        isConnecting: false
      })
    )
  }
})

// On Edges Change:
// 1. Delete edges when the change type is 'remove'
export const onEdgesChange = createAsyncThunk<
  void,
  { changes: EdgeChange[] },
  { state: AppState }
>('reactFlow/onEdgesChange', async ({ changes }, thunkAPI) => {
  const { dispatch, getState } = thunkAPI
  const edges = getState().reactFlow.edges
  const nextEdges = applyEdgeChanges(changes, edges)
  dispatch(updateReactFlowEdgesReducer(nextEdges))
  // Delete edges
  if(changes.some(change => change.type === 'remove')) {
    changes.forEach(change => {
      if (change.type === 'remove') {
        dispatch(deleteEdge({ id: change.id }))
      }
    })
  }
})
