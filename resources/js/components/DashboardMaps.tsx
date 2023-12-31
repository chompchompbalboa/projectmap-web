//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Provider } from 'react-redux'
import styled from 'styled-components'

import { LaravelUser } from '@/breeze/types'

import { store } from '@/store/store'

import CreateMap from '@/components/CreateMap'
import DashboardMapsMap from '@/components/DashboardMapsMap'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  laravelUser: LaravelUser
}

//-----------------------------------------------------------------------------
// Componentadsf
//-----------------------------------------------------------------------------
const DashboardMaps = ({ laravelUser }: Props): JSX.Element => {
  return (
    <Provider store={store}>
      <Container>
        {laravelUser.maps.map(map => 
          <DashboardMapsMap key={map.id} map={map}/>
        )}
        <CreateMap userId={laravelUser.id} />
      </Container>
  </Provider>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
`

export default DashboardMaps
