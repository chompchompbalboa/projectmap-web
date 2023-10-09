//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

import { Map } from '@/store/map'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  map: Map
}

//-----------------------------------------------------------------------------
// Componentadsf
//-----------------------------------------------------------------------------
const DashboardMaps = ({ map }: Props): JSX.Element => {
  return (
      <Container
        href={'/map/' + map.id}
        target='_blank'>
        {map.name}
      </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.a`
  display: flex;
  border: 1px solid gray;
  border-radius: 7px;
  padding: 10px;
  background: white;
  &:hover {
    background: rgb(250,250,250);
  }
`

export default DashboardMaps
