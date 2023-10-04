//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useSelector } from 'react-redux'
import { MapField } from '../store/mapField'
import styled from 'styled-components'
import { AppState } from '@renderer/store/store'
import MapNodeLabel from './MapNodeLabel'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  mapFieldId: MapField['id']
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapNodeField = ({ mapFieldId }: Props): JSX.Element => {

  // Redux
  const mapField = useSelector((state: AppState) => state.mapField.allMapFields[mapFieldId])
  console.log(mapField)

  // Components
  const mapFieldComponents = {
    LABEL: MapNodeLabel
  }

  return mapFieldComponents[mapField.datatype]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default MapNodeField
