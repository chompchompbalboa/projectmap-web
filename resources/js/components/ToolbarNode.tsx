//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useOnSelectionChange } from 'reactflow'
import styled from 'styled-components'

import { updateReactFlowActiveReducer } from '../store/reactFlow'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../store/store'
import { updateNode } from '../store/nodeActions'
import ToolbarNodeData from './ToolbarNodeData'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNode = (): JSX.Element => {
  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const selectedNodes = useSelector((state: AppState) => {
    return state.reactFlow.active.selectedNodes.map(
      (selectedNodeId) => state.node.allNodes[selectedNodeId]
    )
  })

  // Only display node data values in the toolbar if:
  // 1. There is is only 1 node selected
  const displayNodeDataValue = selectedNodes.length === 1

  // Update selected nodes on selection change
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      dispatch(
        updateReactFlowActiveReducer({
          selectedNodes: nodes.map((node) => node.id)
        })
      )
    }
  })

  return (
    <Container>
      <NodeDataContainer>{selectedNodes[0]?.label}</NodeDataContainer>
      <ToolbarNodeData
        onVisibilityClick={(): void => {
          if (selectedNodes.length > 0) {
            const nextStartDateVisible = !selectedNodes[0].isStartDateVisible
            selectedNodes.forEach((currentSelectedNode) => {
              dispatch(
                updateNode({
                  nodeId: currentSelectedNode.id,
                  updates: {
                    isStartDateVisible: nextStartDateVisible
                  }
                })
              )
            })
          }
        }}
        value={displayNodeDataValue ? selectedNodes[0]?.startDate || '' : ''}
        valueName={'Start Date'}
      />
      <ToolbarNodeData
        onVisibilityClick={(): void => {
          if (selectedNodes.length > 0) {
            const nextEndDateVisible = !selectedNodes[0].isEndDateVisible
            selectedNodes.forEach((currentSelectedNode) => {
              dispatch(
                updateNode({
                  nodeId: currentSelectedNode.id,
                  updates: {
                    isEndDateVisible: nextEndDateVisible
                  }
                })
              )
            })
          }
        }}
        value={displayNodeDataValue ? selectedNodes[0]?.endDate || '' : ''}
        valueName={'End Date'}
      />
      <NodeDataContainer>{selectedNodes[0]?.duration}</NodeDataContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``
const NodeDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default ToolbarNode
