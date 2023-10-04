//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { LaravelUser } from '@/breeze/types'
import styled from 'styled-components'

import { store } from '@/store/store'
import { Provider } from 'react-redux'

import CreateMap from './CreateMap'

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
