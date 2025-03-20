//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'
import { IconType } from 'react-icons'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  icon: IconType
  isButtonActive?: boolean
  onButtonClick?(): void
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeDataButton = ({
  icon: Icon,
  isButtonActive = false,
  onButtonClick = () => {}
}: Props): JSX.Element => {
  return (
    <Container
      $isButtonActive={isButtonActive}
      onClick={onButtonClick}>
      <Icon />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div<ContainerProps>`
  cursor: pointer;
  border-radius: 3px;
  padding: 0.25rem;
  background-color: ${({ $isButtonActive }: ContainerProps): string =>
  $isButtonActive ? 'rgb(230, 230, 230)' : 'auto'};
  &:hover {
    background-color: rgb(230, 230, 230);
  }
`
interface ContainerProps {
  readonly $isButtonActive?: boolean
}

export default ToolbarNodeDataButton
