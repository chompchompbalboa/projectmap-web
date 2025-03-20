//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { createAsyncThunk } from '@reduxjs/toolkit'
import { 
  applyEdgeChanges, 
  applyNodeChanges,
  Connection, 
  EdgeChange, 
  Node as ReactFlowNode,
  NodeChange, 
  OnConnectStartParams,
  XYPosition 
} from '@xyflow/react'

import { createEdge, deleteEdge } from '@/store/edgeActions'
import { createNode, deleteNode, updateNode, updateNodeSuccessorDates } from '@/store/nodeActions'
import { 
  updateReactFlowActiveReducer,
  updateReactFlowEdgesReducer,
  updateReactFlowNodesReducer
} from '@/store/reactFlow'
import { AppState } from '@/store/store'
import { buildNewId } from '@/utils'

//-----------------------------------------------------------------------------
// On Connect Start
//-----------------------------------------------------------------------------
export const onConnectStart = createAsyncThunk<
  void,
  { connection: OnConnectStartParams },
  { state: AppState }
>('reactFlow/onConnectStart', async ({ connection }, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(updateReactFlowActiveReducer({
      connectingNodeId: connection.nodeId,
      connectingHandleType: connection.handleType,
      isConnecting: true
    }))
})


//-----------------------------------------------------------------------------
// On Connect
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

//-----------------------------------------------------------------------------
// On Connect End
//-----------------------------------------------------------------------------
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
    await dispatch(
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

//-----------------------------------------------------------------------------
// On Edges Change
//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// On Nodes Change
//-----------------------------------------------------------------------------
export const onNodesChange = createAsyncThunk<
  void,
  { changes: NodeChange[] },
  { state: AppState }
>('reactFlow/onNodesChange', async ({ changes }, thunkAPI) => {
  const { dispatch, getState } = thunkAPI
  const nodes = getState().reactFlow.nodes
  dispatch(updateReactFlowNodesReducer(applyNodeChanges(changes, nodes)))
})

//-----------------------------------------------------------------------------
// On Nodes Delete
//-----------------------------------------------------------------------------
export const onNodesDelete = createAsyncThunk<
  void,
  { nodes: ReactFlowNode[] },
  { state: AppState }
>('reactFlow/onNodesChange', async ({ nodes }, thunkAPI) => {
  const { dispatch } = thunkAPI
  nodes.forEach(node => {
    dispatch(deleteNode({ id: node.id }))
  })
})

//-----------------------------------------------------------------------------
// On Node Drag Stop
//-----------------------------------------------------------------------------
// 1. Update node position
// 2. TODO: Update node parent if the node is dropped inside a group
export const onNodeDragStop = createAsyncThunk<
  void,
  { node: ReactFlowNode },
  { state: AppState }
>('reactFlow/onConnectStart', async ({ node }, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(updateNode({
      nodeId: node.id,
      updates: {
        positionX: node.position.x,
        positionY: node.position.y
      }
    }))
})
