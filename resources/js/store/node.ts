//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime, Duration } from 'luxon'
import { Node as ReactFlowNode } from 'reactflow'

import { formatDate } from '../utils'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface AllNodes {
  [nodeId: Node['id']]: Node
}
export interface Node {
  id: string
  type: NodeType
  // App Properties
  label: string
  startDate: string
  duration: string
  endDate: string
  startDateLocked: boolean
  endDateLocked: boolean
  startDateVisible: boolean
  durationVisible: boolean
  endDateVisible: boolean
  predecessors: Node['id'][]
  successors: Node['id'][]
  // React Flow Properties
  expandParent: boolean
  parentNode: Node['id'] | undefined
  positionX: number
  positionY: number
  zIndex: number
}
export type NodeType = 'mapGroup' | 'mapNode'

export interface NodeSliceState {
  allNodes: AllNodes
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------
// Build New Id
const buildNewId: () => Node['id'] = () => {
  return Math.random() + ''
}

// Build New Node
export const buildNewNode = ({
  id,
  parentNode,
  positionX,
  positionY,
  predecessors,
  successors,
  startDate,
  duration,
  endDate,
  type,
  zIndex
}: Partial<Node>): Node => {
  // Dates
  const defaultStartDate = DateTime.now()
  const defaultDuration = Duration.fromObject({ weeks: 1 })
  const defaultEndDate = defaultStartDate.plus(defaultDuration)

  return {
    id: id || buildNewId(),
    type: type || 'mapNode',
    label: 'Label',
    startDate: startDate || formatDate(defaultStartDate.toISO()),
    duration: duration || defaultDuration.toISO() as string,
    endDate: endDate || formatDate(defaultEndDate.toISO()),
    startDateLocked: false,
    endDateLocked: false,
    startDateVisible: true,
    durationVisible: true,
    endDateVisible: true,
    predecessors: predecessors || [],
    successors: successors || [],
    parentNode: parentNode,
    expandParent: true,
    positionX: positionX || 0,
    positionY: positionY || 0,
    zIndex: zIndex || 0
  }
}

// Convert Node To React Flow Node
export const convertNodeToReactFlowNode = (node: Node): ReactFlowNode => {
  return {
    ...node,
    position: {
      x: node.positionX,
      y: node.positionY
    },
    data: {}
  }
}

// Initial State
const initialState: NodeSliceState = {
  allNodes: localStorage.getItem('allNodes')
    ? (JSON.parse(localStorage.getItem('allNodes') as string) as NodeSliceState['allNodes'])
    : {}
}

// Save State To Local Storage
const saveStateToLocalStorage: (state: NodeSliceState) => void = (state) => {
  localStorage.setItem('allNodes', JSON.stringify(state.allNodes))
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    createNodeReducer: (
      state,
      action: PayloadAction<Node>
    ) => {
      const newNode = action.payload
      state.allNodes = {
        ...state.allNodes,
        [newNode.id]: newNode
      }
      saveStateToLocalStorage(state)
    },
    updateNodeReducer: (
      state,
      action: PayloadAction<{
        nodeId: Node['id']
        updates: Partial<Node>
      }>
    ) => {
      state.allNodes[action.payload.nodeId] = {
        ...state.allNodes[action.payload.nodeId],
        ...action.payload.updates
      }
      saveStateToLocalStorage(state)
    }
  }
})

export const {
  createNodeReducer,
  updateNodeReducer
} = nodeSlice.actions
export default nodeSlice.reducer
