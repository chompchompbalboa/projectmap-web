//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import ToolbarNodeDataVisibility from './ToolbarNodeDataVisibility'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  children: React.ReactNode
  isNodeDataVisible?: boolean
  isNodeDataVisibilityModifiable?: boolean
  name: string
  onVisibilityClick?(): void
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeData = ({
  children,
  isNodeDataVisible = true,
  isNodeDataVisibilityModifiable = true,
  name,
  onVisibilityClick = () => {}
}: Props): JSX.Element => {
  return (
    <div className='relative flex flex-row justify-between min-h-1'>
      <ToolbarNodeDataVisibility
        isNodeDataVisible={isNodeDataVisible}
        isNodeDataVisibilityModifiable={isNodeDataVisibilityModifiable}
        onVisibilityClick={onVisibilityClick}/>
      <div className='w-full flex flex-row'>
        <div className='whitespace-nowrap select-none'>
          {name}
        </div>
        <div className='w-full flex flex-row justify-end text-right'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ToolbarNodeData
