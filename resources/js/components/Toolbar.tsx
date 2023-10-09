//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Panel, Node } from 'reactflow'
import styled from 'styled-components'

import ToolbarNode from './ToolbarNode'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Toolbar = (): JSX.Element => {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: Node['type'] = 'mapNode'
  ): void => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Panel position="top-right" style={{ backgroundColor: 'white', margin: '0', padding: '10px', width: '20vw' }}>
      <Actions>
        <Action
          draggable
          onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapNode')}
        >
          Node
        </Action>
        <Action
          draggable
          onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapGroup')}
        >
          Group
        </Action>
      </Actions>
      <ToolbarNode />
    </Panel>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`
const Action = styled.div`
  cursor: grab;
  user-select: none;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #eee;
  }
`

export default Toolbar
