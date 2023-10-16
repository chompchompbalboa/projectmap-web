//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '@/store/store'
import { Node } from '@/store/node'
import { updateNode, updateNodeDates } from '@/store/nodeActions'

import {
  getHumanDurationFromISO,
  getISODurationFromHuman
} from '@/utils'

import ContentEditable from '@/components/ContentEditable'
import ToolbarNodeData from '@/components/ToolbarNodeData'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNode = (): JSX.Element => {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const duration = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeDurationsSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].duration == selectedNodes0.duration
      })
      return isAllSelectedNodeDurationsSame
        ? selectedNodes0.duration
        : ''
    } else {
      return ''
    }
  })
  const isDurationVisible = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeDurationsSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].isDurationVisible == selectedNodes0.isDurationVisible
      })
      return isAllSelectedNodeDurationsSame
        ? selectedNodes0.isDurationVisible
        : false
    } else {
      return false
    }
  })
  const selectedNodes = useSelector((state: AppState) => state.reactFlow.active.selectedNodes)

  // Update Nodes Start Date
  const updateNodesDuration = (nextNodeDuration: Node['duration']) => {
    selectedNodes.forEach(selectedNodeId => {
      dispatch(updateNodeDates({
        nodeId: selectedNodeId,
        updates: {
          duration: getISODurationFromHuman(nextNodeDuration)
        }
      }))
    })
  }

  // Update Nodes Is Start Date Visible
  const updateNodesIsDurationVisible = () => {
    if (selectedNodes.length > 0) {
      const nextDurationVisible = !isDurationVisible
      selectedNodes.forEach((currentSelectedNodeId) => {
        dispatch(
          updateNode({
            nodeId: currentSelectedNodeId,
            updates: {
              isDurationVisible: nextDurationVisible
            }
          })
        )
      })
    }
  }

  return (
    <ToolbarNodeData
      isNodeDataVisible={selectedNodes.length === 0 ? true : isDurationVisible}
      onVisibilityClick={updateNodesIsDurationVisible}
      name={'Duration'}>
      <ContentEditable
        disabled={selectedNodes.length === 0}
        value={duration && getHumanDurationFromISO(duration)}
        updateValue={updateNodesDuration}/>
    </ToolbarNodeData>
  )
}

export default ToolbarNode
