//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '@/store/store'
import { Node } from '@/store/node'
import { updateNode } from '@/store/nodeActions'

import ContentEditable from '@/components/ContentEditable'
import ToolbarNodeData from '@/components/ToolbarNodeData'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeLabel = (): JSX.Element => {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const label = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeLabelsSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].label == selectedNodes0.label
      })
      return isAllSelectedNodeLabelsSame
        ? selectedNodes0.label
        : ''
    } else {
      return ''
    }
  })
  const isLabelVisible = useSelector((state: AppState) => {
    const selectedNodes = state.reactFlow.active.selectedNodes
    if(selectedNodes.length > 0) {
      const selectedNodes0 = state.node.allNodes[selectedNodes[0]]
      const isAllSelectedNodeLabelsSame = selectedNodes.every(selectedNodeId => {
        return state.node.allNodes[selectedNodeId].isLabelVisible == selectedNodes0.isLabelVisible
      })
      return isAllSelectedNodeLabelsSame
        ? selectedNodes0.isLabelVisible
        : false
    } else {
      return false
    }
  })
  const selectedNodes = useSelector((state: AppState) => state.reactFlow.active.selectedNodes)

  // Update Node Labels
  const updateNodeLabels = (nextNodeLabel: Node['label']) => {
    selectedNodes.forEach(selectedNodeId => {
      dispatch(updateNode({
        nodeId: selectedNodeId,
        updates: {
          label: nextNodeLabel
        }
      }))
    })
  }

  // Update Nodes Is Label Visible
  const updateNodesIsLabelVisible = () => {
    if (selectedNodes.length > 0) {
      const nextLabelVisible = !isLabelVisible
      selectedNodes.forEach((currentSelectedNodeId) => {
        dispatch(
          updateNode({
            nodeId: currentSelectedNodeId,
            updates: {
              isLabelVisible: nextLabelVisible
            }
          })
        )
      })
    }
  }

  return (
    <ToolbarNodeData
      isNodeDataVisible={selectedNodes.length === 0 ? true : isLabelVisible}
      onVisibilityClick={updateNodesIsLabelVisible}
      name={'Label'}>
      <ContentEditable
        disabled={selectedNodes.length === 0}
        value={label}
        updateValue={updateNodeLabels}/>
    </ToolbarNodeData>
  )
}

export default ToolbarNodeLabel
