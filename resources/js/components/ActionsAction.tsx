//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { ReactElement } from 'react'
import styled from 'styled-components'
import { Node } from '@xyflow/react'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  children?: ReactElement | string
  onDragStart?(
    event: React.DragEvent,
    nodeType: Node['type']
  ): void
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Toolbar = ({
  children,
  onDragStart = () => {}
}: Props): JSX.Element =>  {
  return (
    <div
      className='flex justify-center items-center cursor-grab select-none mt-0.5 size-2 bg-white border rounded-sm border-gray-400'
      draggable
      onDragStart={(e: React.DragEvent): void => onDragStart(e, 'mapNode')}>
      {children}
    </div>
  )
}

export default Toolbar
