//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DateTime, Duration } from 'luxon'
import { Node as ReactFlowNode } from 'reactflow'

import { Map } from '@/store/map'
import { buildNewId, formatDate } from '@/utils'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface Node {
  id: string
  mapId: Map['id']
  type: NodeType
  // App Properties
  label: string
  startDate: string
  duration: string
  endDate: string
  isStartDateLocked: boolean
  isEndDateLocked: boolean
  isStartDateVisible: boolean
  isDurationVisible: boolean
  isEndDateVisible: boolean
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

//-----------------------------------------------------------------------------
// Slice State
//-----------------------------------------------------------------------------
export interface NodeSliceState {
  allNodes: {[nodeId: Node['id']]: Node}
}

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
const initialState: NodeSliceState = {
  allNodes: {}
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------
// Build New Node
export const buildNewNode = ({
  id,
  mapId,
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
    mapId: mapId || '',
    type: type || 'mapNode',
    label: 'Label',
    startDate: startDate || formatDate(defaultStartDate.toISO()),
    duration: duration || defaultDuration.toISO() as string,
    endDate: endDate || formatDate(defaultEndDate.toISO()),
    isStartDateLocked: false,
    isEndDateLocked: false,
    isStartDateVisible: true,
    isDurationVisible: true,
    isEndDateVisible: true,
    predecessors: predecessors || [],
    successors: successors || [],
    parentNode: parentNode || '',
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
    },
    updateAllNodesReducer: (
      state,
      action: PayloadAction<{
        updates: NodeSliceState['allNodes']
      }>
    ) => {
      state.allNodes = {
        ...state.allNodes,
        ...action.payload.updates
      }
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
    }
  }
})

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export const {
  createNodeReducer,
  updateAllNodesReducer,
  updateNodeReducer
} = nodeSlice.actions
export default nodeSlice.reducer
