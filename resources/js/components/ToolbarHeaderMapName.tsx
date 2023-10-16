//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppDispatch, AppState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { Map } from '@/store/map'
import { updateMap } from '@/store/mapActions'

import ContentEditable from '@/components/ContentEditable'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarHeaderMapName = (): JSX.Element => {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const map = useSelector((state: AppState) => state.active.activeMapId && state.map.allMaps[state.active.activeMapId])

  // Update Map Name
  const updateMapName = (nextMapName: Map['name']) => {
    if(map && nextMapName !== map.name) {
      dispatch(updateMap({
        mapId: map.id,
        updates: {
          name: nextMapName
        }
      }))
    }
  }

  return (
    <Container>
      <ContentEditable
        value={(map && map.name) || ''}
        updateValue={updateMapName}
        style={{
          fontSize: '20px',
          fontWeight: 'bold'
        }}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0 0 0.75rem 0;
`

export default ToolbarHeaderMapName
