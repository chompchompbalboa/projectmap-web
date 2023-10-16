//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import ToolbarNodeDatesDuration from '@/components/ToolbarNodeDatesDuration'
import ToolbarNodeDatesEndDate from '@/components/ToolbarNodeDatesEndDate'
import ToolbarNodeDatesStartDate from '@/components/ToolbarNodeDatesStartDate'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ToolbarNodeDates = (): JSX.Element => {
  return (
    <>
      <ToolbarNodeDatesStartDate />
      <ToolbarNodeDatesEndDate />
      <ToolbarNodeDatesDuration />
    </>
  )
}

export default ToolbarNodeDates
