//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

import ToolbarHeaderMapName from '@/components/ToolbarHeaderMapName'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarHeader = (): JSX.Element => {
  return (
    <Container>
      <ToolbarHeaderMapName />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default ToolbarHeader
