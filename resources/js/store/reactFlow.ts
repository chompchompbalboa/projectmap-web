//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  applyEdgeChanges,
  applyNodeChanges,
  Edge as ReactFlowEdge,
  EdgeChange,
  HandleType as ReactFlowHandleType,
  Node as ReactFlowNode,
  NodeChange,
  OnConnectStartParams,
  XYPosition
} from 'reactflow'

import { Node, convertNodeToReactFlowNode } from './node'
import { Edge, convertEdgeToReactFlowEdge } from './edge'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface ReactFlowReducerState {
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
// Helpers
//-----------------------------------------------------------------------------
// Get Initial Edges
const getInitialEdges: () => ReactFlowEdge[] = () => {
  const defaultEdges: ReactFlowEdge[] = []
  const localStorageEdges = localStorage.getItem('edges')
    ? (JSON.parse(localStorage.getItem('edges') as string) as ReactFlowEdge[])
    : null
  return localStorageEdges || defaultEdges
}

// Get Initial Nodes
const getInitialNodes: () => ReactFlowNode[] = () => {
  const defaultNodes: ReactFlowNode[] = []
  const localStorageNodes = localStorage.getItem('nodes')
    ? (JSON.parse(localStorage.getItem('nodes') as string) as ReactFlowNode[])
    : null
  return localStorageNodes || defaultNodes
}

// Get New Id
const getNewId: () => ReactFlowNode['id'] | ReactFlowEdge['id'] = () => {
  return Math.random() + ''
}

// Get New Node
const getNewNode = ({
  parentNode,
  data,
  position,
  type,
  zIndex
}: {
  parentNode?: ReactFlowNode['parentNode']
  data?: ReactFlowNode['data']
  position?: ReactFlowNode['position']
  type?: ReactFlowNode['type']
  zIndex?: ReactFlowNode['zIndex']
}): ReactFlowNode => {
  return {
    id: getNewId(),
    parentNode: parentNode,
    type: type || 'mapNode',
    data: {
      label: 'New Node',
      dates: {
        startDate: '2023-09-15',
        duration: { weeks: 1 },
        endDate: '2023-09-22'
      },
      ...data // Spread last so we can overwrite the default data
    },
    expandParent: true,
    position: position || { x: 0, y: 0 },
    zIndex: zIndex || 0
  }
}

// Save State To Local Storage
const saveStateToLocalStorage: (state: ReactFlowReducerState) => void = (state) => {
  localStorage.setItem('nodes', JSON.stringify(state.nodes))
  localStorage.setItem('edges', JSON.stringify(state.edges))
}

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
const initialState: ReactFlowReducerState = {
  active: {
    isConnecting: false,
    connectingNodeId: null,
    connectingHandleType: null,
    selectedNodes: []
  },
  nodes: getInitialNodes(),
  edges: getInitialEdges()
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const reactFlowSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Create Node On Drop
    createNodeOnDrop: (
      state,
      action: PayloadAction<{
        type: ReactFlowNode['type']
        position: XYPosition
      }>
    ) => {
      // Create New Group
      if (action.payload.type === 'mapGroup') {
        const newGroup = getNewNode({
          type: 'mapGroup',
          position: action.payload.position,
          zIndex: -1
        })
        const newNode = getNewNode({
          parentNode: newGroup.id,
          data: {
            label: 'New Group Node'
          }
        })
        state.nodes = [...state.nodes, newGroup, newNode]
        // Create New Node
      } else if (action.payload.type === 'mapNode') {
        const newNode = getNewNode({
          data: {
            label: 'New Node'
          },
          position: action.payload.position
        })
        state.nodes = [...state.nodes, newNode]
      }
      saveStateToLocalStorage(state)
    },
    // On Connect End
    onConnectEnd: (state, action: PayloadAction<XYPosition>) => {
      // Add a new node on edge drop
      const newNodePosition = action.payload
      if (state.active.isConnecting && state.active.connectingNodeId) {
        // Set the parentNodeId
        let parentNodeId: ReactFlowNode['parentNode']
        state.nodes.forEach((node) => {
          if (node.id === state.active.connectingNodeId) {
            parentNodeId = node.parentNode
          }
        })
        // If there is a parentNode, adjust the position to reference the parent
        if (parentNodeId) {
          const parentNode = state.nodes.find(
            (node) => node.id === parentNodeId
          )
          const parentNodePosition = parentNode?.position
          newNodePosition.x -= parentNodePosition?.x || 0
          newNodePosition.y -= parentNodePosition?.y || 0
        }
        // Create a new node
        const newNode = getNewNode({
          parentNode: parentNodeId,
          position: newNodePosition
        })
        // Create a new edge connecting the source node to the new node
        const newEdge: ReactFlowEdge = {
          id: getNewId(),
          source:
            state.active.connectingHandleType === 'source'
              ? state.active.connectingNodeId
              : newNode.id,
          target:
            state.active.connectingHandleType === 'source'
              ? newNode.id
              : state.active.connectingNodeId
        }
        // Update the state
        state.nodes = [...state.nodes, newNode]
        state.edges = [...state.edges, newEdge]
        state.active.connectingNodeId = null
        state.active.isConnecting = false
        saveStateToLocalStorage(state)
      }
    },
    // On Connect Start
    onConnectStart: (state, action: PayloadAction<OnConnectStartParams>) => {
      state.active.connectingNodeId = action.payload.nodeId
      state.active.connectingHandleType = action.payload.handleType
      state.active.isConnecting = true
    },
    // On Nodes Change
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes)
      saveStateToLocalStorage(state)
    },
    // Reset Map
    resetMap: (state) => {
      localStorage.clear()
      state.edges = getInitialEdges()
      state.nodes = getInitialNodes()
      saveStateToLocalStorage(state)
    },
    // Update Node Parent On Drag Stop
    updateNodeParentOnDragStop: (
      state,
      action: PayloadAction<{
        nodeId: ReactFlowNode['id']
        parentNodeId: ReactFlowNode['id']
        position: XYPosition
      }>
    ) => {
      const parentNode = state.nodes.find(
        (node) => node.id === action.payload.parentNodeId
      )
      if (parentNode) {
        state.nodes = state.nodes.map((node) => {
          const { nodeId, parentNodeId, position } = action.payload
          if (node.id === nodeId && node.parentNode !== parentNodeId) {
            node.parentNode = parentNodeId
            if (node.parentNode !== parentNodeId) {
              node.position.x = node.position.x - parentNode.position.x
              node.position.y = node.position.y - parentNode.position.y
            } else {
              node.position.x = position.x - parentNode.position.x
              node.position.y = position.y - parentNode.position.y
            }
          }
          return node
        })
      }
      saveStateToLocalStorage(state)
    },
    updateNodeLabel: (
      state,
      action: PayloadAction<{ nodeId: ReactFlowNode['id']; nextLabel: string }>
    ) => {
      state.nodes = state.nodes.map((node) => {
        const { nodeId, nextLabel } = action.payload
        if (node.id === nodeId) {
          node.data = { ...node.data, label: nextLabel }
        }
        return node
      })
      saveStateToLocalStorage(state)
    },
    // ------------
    // New Reducers
    // ------------
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
      saveStateToLocalStorage(state)
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
      saveStateToLocalStorage(state)
    },
    // Update React Flow Active
    updateReactFlowActiveReducer: (
      state,
      action: PayloadAction<Partial<ReactFlowReducerState['active']>>
    ) => {
      state.active = {
        ...state.active,
        ...action.payload
      }
    },
    // Update React Flow Edges
    updateReactFlowEdgesReducer: (
      state,
      action: PayloadAction<ReactFlowReducerState['edges']>
    ) => {
      state.edges = action.payload
      saveStateToLocalStorage(state)
    }
  }
})

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export const {
  createNodeOnDrop,
  onConnectEnd,
  onConnectStart,
  onNodesChange,
  resetMap,
  updateNodeParentOnDragStop,
  updateNodeLabel,
  // New Reducers
  createReactFlowEdgeReducer,
  createReactFlowNodeReducer,
  updateReactFlowActiveReducer,
  updateReactFlowEdgesReducer
} = reactFlowSlice.actions
export default reactFlowSlice.reducer
