//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

import colors from '@/utils/colors'

import { PiLightbulbLight, PiLightbulbDuotone } from 'react-icons/pi'

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
    <Container>
      <Visibility
        $isNodeDataVisibilityModifiable={isNodeDataVisibilityModifiable}
        onClick={onVisibilityClick}>
        {isNodeDataVisibilityModifiable
          ? isNodeDataVisible 
            ? <PiLightbulbDuotone size={15} color={colors.SECONDARY}/> 
            : <PiLightbulbLight size={15} color={colors.DARK}/>
          : ''
        }
      </Visibility>
      <DataContainer>
        <DataName>{name}</DataName>
        <Data>{children}</Data>
      </DataContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  padding: 0.05rem 0;
  min-height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Visibility = styled.div<VisibilityProps>`
  cursor: ${({ $isNodeDataVisibilityModifiable }: VisibilityProps): string =>
    $isNodeDataVisibilityModifiable ? 'pointer' : 'auto'};
  margin-right: 0.35rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.1rem;
`
interface VisibilityProps {
  readonly $isNodeDataVisibilityModifiable: boolean
}

const DataContainer = styled.div`
  width: 100%;
  min-height: 1rem;
  display: flex;
  flex-direction: row;
`
const DataName = styled.div`
  white-space: nowrap;
  user-select: none;
`
const Data = styled.div`
  width: 100%;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: end;
`

export default ToolbarNodeData
