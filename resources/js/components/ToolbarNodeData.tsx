//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  onVisibilityClick(): void
  value: string
  valueName: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeData = ({
  onVisibilityClick,
  value,
  valueName
}: Props): JSX.Element => {
  return (
    <Container>
      <Visibility onClick={onVisibilityClick}>V</Visibility>
      <ValueContainer>
        <ValueName>{valueName}</ValueName>
        <Value>{value}</Value>
      </ValueContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Visibility = styled.div`
  cursor: pointer;
`
const ValueContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const ValueName = styled.div``
const Value = styled.div``

export default ToolbarNodeData
