//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Handle, Node, NodeProps, NodeResizer, Position } from '@xyflow/react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type NodeData = Node<{
  label: string
}>

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapGroup = ({ selected }: NodeProps<NodeData>): JSX.Element => {
  return (
    <>
      <NodeResizer color="#756eff" isVisible={selected} />
      <Container $isSelected={selected}>
        <Handle position={Position.Left} type="source" />
        <Handle position={Position.Right} type="target" />
      </Container>
    </>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
// Note: Both the border and padding change when the node is selected to prevent
// the node from visually "shifting" due to the change in border size
const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 100%;
  border: 1px solid #aaa;
  border-radius: 5px;
  background: rgba(225, 225, 225, 0.2);
`
interface ContainerProps {
  readonly $isSelected: boolean
}

export default MapGroup
