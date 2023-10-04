//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Node } from 'reactflow'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateNode } from '../store/nodeActions'
import { AppDispatch, AppState } from '../store/store'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  nodeId: Node['id']
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapNodeLabel = ({ nodeId }: Props): JSX.Element => {
  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const nodeLabel = useSelector((state: AppState) => state.node.allNodes[nodeId].label)

  // Handle Blur
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
    dispatch(
      updateNode({
        nodeId: nodeId,
        updates: { label: e.currentTarget.innerText }
      })
    )
  }
  return (
    <Container
      className="nodrag" // Required for contentEditable to work inside reactflow
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {nodeLabel}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: text;
  text-align: center;
`

export default MapNodeLabel
