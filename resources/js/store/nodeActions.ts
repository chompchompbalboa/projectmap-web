//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { DateTime, Duration } from 'luxon'
import { createAsyncThunk, current } from '@reduxjs/toolkit'
import { XYPosition } from 'reactflow'

import {
  buildNewNode,
  createNodeReducer,
  Node,
  updateNodeReducer
} from './node'
import { createReactFlowNodeReducer } from './reactFlow'
import { AppState } from './store'
import { formatDate } from '../utils'

//-----------------------------------------------------------------------------
// Actions
//-----------------------------------------------------------------------------
// Create Node
export const createNode = createAsyncThunk(
  'node/createNode',
  async (
    nodeData: Partial<Node>,
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI

    // Build the new node
    const newNode = buildNewNode({
      ...nodeData
    })

    // Add the new node to the node slice
    dispatch(createNodeReducer(newNode))

    // Add the new node to the reactFlow slice
    dispatch(createReactFlowNodeReducer(newNode))
  }
)

// Update Node
export const updateNode = createAsyncThunk(
  'node/updateNode',
  async (
    {
      nodeId,
      updates
    }: {
      nodeId: Node['id']
      updates: Partial<Node>
    },
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI
    dispatch(
      updateNodeReducer({
        nodeId,
        updates
      })
    )
  }
)

// Update Node Dates
export const updateNodeDates = createAsyncThunk<
  void,
  {
    nodeId: Node['id']
    updates: {
      startDate?: Node['startDate']
      duration?: Node['duration']
      endDate?: Node['endDate']
    }
  },
  { state: AppState }
>('node/updateNodeDates', async ({ nodeId, updates }, thunkAPI) => {
  const { getState, dispatch } = thunkAPI
  const node = getState().node.allNodes[nodeId]

  // Initialize the variable holding the node's updates
  const nextDates = {
    startDate: updates.startDate || node.startDate,
    duration: updates.duration || node.duration,
    endDate: updates.endDate || node.endDate
  }

  // Update the node's start date, duration, and end date
  if (updates.startDate) {
    const duration = Duration.fromISO(nextDates.duration as string)
    nextDates.endDate = formatDate(
      DateTime.fromISO(nextDates.startDate as string)
        .plus(duration)
        .toISO()
    )
  }
  if (updates.duration) {
    const duration = Duration.fromISO(nextDates.duration as string)
    nextDates.endDate = DateTime.fromISO(nextDates.startDate as string)
      .plus(duration)
      .toISO() as string
  }
  if (updates.endDate) {
    const duration = Duration.fromISO(nextDates.duration as string)
    nextDates.startDate = formatDate(
      DateTime.fromISO(nextDates.endDate as string)
        .minus(duration)
        .toISO()
    )
  }

  // Add the new node to the node slice
  dispatch(
    updateNodeReducer({
      nodeId,
      updates: nextDates
    })
  )

  // Update the node's successors dates
  dispatch(
    updateNodeSuccessorDates({
      nodeId
    })
  )
})

// Update Node Successor Dates
export const updateNodeSuccessorDates = createAsyncThunk<
  void,
  {
    nodeId: Node['id']
  },
  { state: AppState }
>('node/updateNodeSuccessorDates', async ({ nodeId }, thunkAPI) => {
  // Redux
  const { getState, dispatch } = thunkAPI
  // Get the node who's successors need to be updated
  const node = getState().node.allNodes[nodeId]
  // Make sure no duplicate nodes are in the successors array before iterating
  // through the array. This is a final safeguard to prevent needlessly
  // iterating through the node tree
  const uniqueNodeSucessors: Node['successors'] = [...new Set(node.successors)]
  // For each node successor
  uniqueNodeSucessors.forEach((successorNodeId) => {
    // Get the successor node
    const successorNode = getState().node.allNodes[successorNodeId]
    // If the successor node's start date isn't locked
    if (!successorNode.startDateLocked) {
      // Get the latest end date of all the successor node's predcessors
      const latestPredecessorsEndDate = formatDate(
        successorNode.predecessors.reduce(
          (currentMinStartDate, currentPredecessorNodeId) => {
            const currentPredecessorNode =
              getState().node.allNodes[currentPredecessorNodeId]
            return currentMinStartDate > currentPredecessorNode.endDate
              ? currentMinStartDate
              : currentPredecessorNode.endDate
          },
          node.endDate // Use node end date as initial value
        )
      )
      // Update the successor node's dates
      dispatch(
        updateNodeDates({
          nodeId: successorNodeId,
          updates: { startDate: latestPredecessorsEndDate }
        })
      )
    }
  })
})

// Update Node Dates From Predecessors
export const updateNodeDatesFromPredecessors = createAsyncThunk<
  void,
  {
    nodeId: Node['id']
  },
  { state: AppState }
>('node/updateNodeDates', async ({ nodeId }, thunkAPI) => {
  // Redux
  const { getState, dispatch } = thunkAPI
  // Get the node who's dates need to be updated
  const node = getState().node.allNodes[nodeId]
  // Make sure no duplicate nodes are in the predecessors array before iterating
  // through the array. This is a final safeguard to prevent needlessly
  // iterating through the node tree
  const uniqueNodePredecessors: Node['predecessors'] = [...new Set(node.predecessors)]
  // Get the latest end date of all the predecessor node's predcessors
  const latestPredecessorsEndDate = uniqueNodePredecessors.length > 0
    ? formatDate(
        uniqueNodePredecessors.reduce(
          (currentMinStartDate, currentPredecessorNodeId) => {
            const currentPredecessorNode =
              getState().node.allNodes[currentPredecessorNodeId]
            return currentMinStartDate > currentPredecessorNode.endDate
              ? currentMinStartDate
              : currentPredecessorNode.endDate
          },
          getState().node.allNodes[uniqueNodePredecessors[0]].endDate
        )
      )
    : node.startDate
  // Update the predecessor node's dates
  dispatch(
    updateNodeDates({
      nodeId: nodeId,
      updates: { startDate: latestPredecessorsEndDate }
    })
  )
})
