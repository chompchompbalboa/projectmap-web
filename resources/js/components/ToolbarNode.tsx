//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

import ToolbarNodeDates from '@/components/ToolbarNodeDates'
import ToolbarNodeLabel from '@/components/ToolbarNodeLabel'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNode = (): JSX.Element => {
  return (
    <Container>
      <ToolbarNodeLabel />
      <ToolbarNodeDates />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default ToolbarNode
