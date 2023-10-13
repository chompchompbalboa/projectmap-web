//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import styled from 'styled-components'

import Datepicker from '@/components/Datepicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
type Props = {
  onDateChange(nextDate: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapNodeDatesDatepicker = ({
  onDateChange,
  value
}: Props): JSX.Element => {

  return (
    <Container>
      <Datepicker
        valueFontSize={'12px'}
        onDateChange={onDateChange}
        formattedDateValue={value}/> 
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``


export default MapNodeDatesDatepicker
