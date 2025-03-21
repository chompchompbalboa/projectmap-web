//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Panel, Node } from '@xyflow/react'

import { TbSquarePlus } from 'react-icons/tb'

import ActionsAction from '@/components/ActionsAction'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Actions = (): JSX.Element => {

  // Allow for drag and drop creation of groups and nodes
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
        marginRight: 'calc(20rem + 0.5rem)',
        padding: '0', 
      }}>
      <div className='flex flex-column items-end'>
        <ActionsAction
          onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapNode')}
        >
          <TbSquarePlus />
        </ActionsAction>
        {false && 
        <ActionsAction
          onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapGroup')}
        >
          G+
        </ActionsAction>
        }
      </div>
    </Panel>
  )
}

export default Actions