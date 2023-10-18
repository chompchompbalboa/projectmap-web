//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

import ToolbarNodeDates from '@/components/ToolbarNodeDates'
import ToolbarNodeLabel from '@/components/ToolbarNodeLabel'
import ToolbarNodeStyle from '@/components/ToolbarNodeStyle'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNode = (): JSX.Element => {
  return (
    <Container>
      <ToolbarNodeLabel />
      <ToolbarNodeDates />
      <ToolbarNodeStyle />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default ToolbarNode
