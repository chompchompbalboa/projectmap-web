//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Handle, NodeProps as ReactFlowNodeProps, Position } from 'reactflow'
import styled from 'styled-components'

import MapNodeDates from './MapNodeDates'
import MapNodeLabel from './MapNodeLabel'
import { useSelector } from 'react-redux'
import { AppState } from '@/store/store'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapNode = ({
  id,
  selected
}: ReactFlowNodeProps): JSX.Element => {

  // Redux
  const nodeStyle = useSelector((state: AppState) => state.node.allNodes[id].style)

  return (
    <Container 
      $isSelected={selected}
      style={nodeStyle}>
      <Handle position={Position.Left} type="source" />
      <MapNodeLabel nodeId={id} />
      <MapNodeDates nodeId={id} />
      <Handle position={Position.Right} type="target" />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
// Note: Both the border and padding change when the node is selected to prevent
// the node from visually "shifting" due to the change in border size. If you
// update one of these, make sure to update the other
const Container = styled.div<ContainerProps>`
  border: ${({ $isSelected }: ContainerProps): string =>
    $isSelected ? '2px solid #756eff' : '1px solid #ccc'};
  padding: ${({ $isSelected }: ContainerProps): string =>
    $isSelected ? '4px 9px' : '5px 10px'};
  background: white;
`
interface ContainerProps {
  readonly $isSelected: boolean
}

export default MapNode
