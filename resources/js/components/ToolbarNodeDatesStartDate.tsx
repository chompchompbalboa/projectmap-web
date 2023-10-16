//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '@/store/store'
import { Node } from '@/store/node'
import { updateNode, updateNodeDates } from '@/store/nodeActions'

import { formatDate } from '@/utils'

import Datepicker from '@/components/Datepicker'
import ToolbarNodeData from '@/components/ToolbarNodeData'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNode = (): JSX.Element => {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const startDate = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeStartDatesSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].startDate == selectedNodes0.startDate
      })
      return isAllSelectedNodeStartDatesSame
        ? selectedNodes0.startDate
        : undefined
    } else {
      return undefined
    }
  })
  const isStartDateVisible = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeStartDatesSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].isStartDateVisible == selectedNodes0.isStartDateVisible
      })
      return isAllSelectedNodeStartDatesSame
        ? selectedNodes0.isStartDateVisible
        : false
    } else {
      return false
    }
  })
  const selectedNodes = useSelector((state: AppState) => state.reactFlow.active.selectedNodes)

  // Update Nodes Start Date
  const updateNodesStartDate = (nextNodeStartDate: Node['startDate']) => {
    selectedNodes.forEach(selectedNodeId => {
      dispatch(updateNodeDates({
        nodeId: selectedNodeId,
        updates: {
          startDate: nextNodeStartDate
        }
      }))
    })
  }

  // Update Nodes Is Start Date Visible
  const updateNodesIsStartDateVisible = () => {
    if (selectedNodes.length > 0) {
      const nextStartDateVisible = !isStartDateVisible
      selectedNodes.forEach((currentSelectedNodeId) => {
        dispatch(
          updateNode({
            nodeId: currentSelectedNodeId,
            updates: {
              isStartDateVisible: nextStartDateVisible
            }
          })
        )
      })
    }
  }


  return (
    <ToolbarNodeData
      isNodeDataVisible={selectedNodes.length === 0 ? true : isStartDateVisible}
      onVisibilityClick={updateNodesIsStartDateVisible}
      name={'Start Date'}>
      {startDate &&
        <Datepicker
          dropdownLeft='auto'
          dropdownRight='0'
          onDateChange={updateNodesStartDate}
          formattedDateValue={formatDate(startDate)}/> 
      }
    </ToolbarNodeData>
  )
}

export default ToolbarNode
