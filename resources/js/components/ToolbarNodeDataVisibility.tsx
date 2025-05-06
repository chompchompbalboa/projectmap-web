//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import colors from '@/utils/colors'

import { PiLightbulbLight, PiLightbulbDuotone } from 'react-icons/pi'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  isNodeDataVisible?: boolean
  isNodeDataVisibilityModifiable?: boolean
  onVisibilityClick?(): void
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeDataVisibility = ({
  isNodeDataVisible = true,
  isNodeDataVisibilityModifiable = true,
  onVisibilityClick = () => {}
}: Props): JSX.Element => {

  // Set cursor type
  const cursor = isNodeDataVisibilityModifiable ? 'cursor-pointer' : 'cursor-auto'

  return (
    <div
      className={cursor + ' flex justify-center items-center mr-0.5 w-1'}
      onClick={onVisibilityClick}>
      {isNodeDataVisibilityModifiable
        ? isNodeDataVisible 
          ? <PiLightbulbDuotone size={15} color={colors.SECONDARY}/> 
          : <PiLightbulbLight size={15} color={colors.DARK}/>
        : ''
      }
    </div>
  )
}

export default ToolbarNodeDataVisibility
