//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Panel } from 'reactflow'

import ToolbarNode from '@/components/ToolbarNode'
import ToolbarHeader from '@/components/ToolbarHeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Toolbar = (): JSX.Element => {
  return (
    <Panel 
      position="top-right" 
      style={{ 
        margin: '0', 
        padding: '10px', 
        width: '20rem',
        height: '100vh',
        backgroundColor: 'white',
        borderLeft: '1px solid rgb(240, 240, 240)'
      }}>
      <ToolbarHeader />
      <ToolbarNode />
    </Panel>
  )
}

export default Toolbar
