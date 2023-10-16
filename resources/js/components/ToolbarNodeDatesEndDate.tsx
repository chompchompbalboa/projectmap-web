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
  const endDate = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeEndDatesSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].endDate == selectedNodes0.endDate
      })
      return isAllSelectedNodeEndDatesSame
        ? selectedNodes0.endDate
        : undefined
    } else {
      return undefined
    }
  })
  const isEndDateVisible = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeEndDatesSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].isEndDateVisible == selectedNodes0.isEndDateVisible
      })
      return isAllSelectedNodeEndDatesSame
        ? selectedNodes0.isEndDateVisible
        : false
    } else {
      return false
    }
  })
  const selectedNodes = useSelector((state: AppState) => state.reactFlow.active.selectedNodes)

  // Update Nodes Start Date
  const updateNodesEndDate = (nextNodeEndDate: Node['endDate']) => {
    selectedNodes.forEach(selectedNodeId => {
      dispatch(updateNodeDates({
        nodeId: selectedNodeId,
        updates: {
          endDate: nextNodeEndDate
        }
      }))
    })
  }

  // Update Nodes Is Start Date Visible
  const updateNodesIsEndDateVisible = () => {
    if (selectedNodes.length > 0) {
      const nextEndDateVisible = !isEndDateVisible
      selectedNodes.forEach((currentSelectedNodeId) => {
        dispatch(
          updateNode({
            nodeId: currentSelectedNodeId,
            updates: {
              isEndDateVisible: nextEndDateVisible
            }
          })
        )
      })
    }
  }


  return (
    <ToolbarNodeData
      isNodeDataVisible={selectedNodes.length === 0 ? true : isEndDateVisible}
      onVisibilityClick={updateNodesIsEndDateVisible}
      name={'End Date'}>
      {endDate &&
        <Datepicker
          dropdownLeft='auto'
          dropdownRight='0'
          onDateChange={updateNodesEndDate}
          formattedDateValue={formatDate(endDate)}/> 
      }
    </ToolbarNodeData>
  )
}

export default ToolbarNode
