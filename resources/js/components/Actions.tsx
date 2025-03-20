//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Panel, Node } from '@xyflow/react'
import styled from 'styled-components'

import { TbSquarePlus } from 'react-icons/tb'

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
    <Panel 
      position="top-right" 
      style={{ 
        margin: '0',
        marginRight: 'calc(20rem + 1.5rem)',
        padding: '0', 
      }}>
      <Actions>
        <Action
          draggable
          onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapNode')}
        >
          <TbSquarePlus />
        </Action>
        {false && 
        <Action
          draggable
          onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapGroup')}
        >
          G+
        </Action>
        }
      </Actions>
    </Panel>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const Action = styled.div`
  cursor: grab;
  background: white;
  user-select: none;
  border: 1px solid #eee;
  width: 2rem;
  height: 2rem;
  border-radius: 5px;
  margin-top: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #eee;
  }
`

export default Toolbar
