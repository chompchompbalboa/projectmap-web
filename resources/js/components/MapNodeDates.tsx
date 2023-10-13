//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { Node } from '@/store/node'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '@/store/store'
import { updateNode, updateNodeDates } from '@/store/nodeActions'
import {
  formatDate,
  getHumanDurationFromISO,
  getISODurationFromHuman
} from '@/utils'

import MapNodeDatesDatepicker from '@/components/MapNodeDatesDatepicker'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  nodeId: Node['id']
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const MapNodeDates = ({ nodeId }: Props): JSX.Element => {
  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const nodeStartDate = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].startDate
  )
  const nodeDuration = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].duration
  )
  const nodeEndDate = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].endDate
  )
  const nodeStartDateLocked = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].isStartDateLocked
  )
  const nodeStartDateVisible = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].isStartDateVisible
  )
  const nodeEndDateVisible = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].isEndDateVisible
  )

  // State
  const [localNodeDuration, setLocalNodeDuration] = useState(
    getHumanDurationFromISO(nodeDuration)
  )

  // Effects
  useEffect(() => {
    setLocalNodeDuration(getHumanDurationFromISO(nodeDuration))
  }, [nodeDuration])

  // Handle Duration Change
  const handleDurationChange: (nextDuration: string) => void = (
    nextDuration
  ) => {
    dispatch(
      updateNodeDates({
        nodeId,
        updates: {
          duration: getISODurationFromHuman(nextDuration)
        }
      })
    )
  }

  // Handle End Date Change
  const handleEndDateChange: (nextEndDateISOString: string) => void = (
    nextEndDateISOString
  ) => {
    dispatch(
      updateNodeDates({
        nodeId,
        updates: { endDate: formatDate(nextEndDateISOString) }
      })
    )
  }

  // Handle Start Date Change
  const handleStartDateChange: (nextStartDateISOString: string) => void = (
    nextStartDateISOString
  ) => {
    dispatch(
      updateNodeDates({
        nodeId,
        updates: { startDate: formatDate(nextStartDateISOString) }
      })
    )
  }

  // Handle Start Date Locked Change
  const handleStartDateLockedChange: (nextStartDateLocked: boolean) => void = (
    nextStartDateLocked
  ) => {
    dispatch(
      updateNode({
        nodeId,
        updates: { isStartDateLocked: nextStartDateLocked }
      })
    )
  }

  return (
    <Container className="nodrag">
      <Dates>
        {false && ( // Commenting the date lock out while actively working on the UI
          <DateLock
            onClick={(): void =>
              handleStartDateLockedChange(!nodeStartDateLocked)
            }
          >
            {nodeStartDateLocked ? 'L' : 'U'}
          </DateLock>
        )}
        {nodeStartDateVisible &&
          <MapNodeDatesDatepicker
            value={formatDate(nodeStartDate)}
            onDateChange={(nextDate): void => handleStartDateChange(nextDate)}
            />
        }
        {(nodeStartDateVisible || nodeEndDateVisible) && <DateArrow>→</DateArrow>}
        {nodeEndDateVisible && (
          <MapNodeDatesDatepicker
            value={formatDate(nodeEndDate)}
            onDateChange={(nextDate): void => handleEndDateChange(nextDate)}
          />
        )}
      </Dates>
      <DurationContainer>
        <DurationInput
          value={localNodeDuration}
          onBlur={(e): void => handleDurationChange(e.currentTarget.value)}
          onChange={(e): void => setLocalNodeDuration(e.currentTarget.value)}
        />
      </DurationContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Dates = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const DateArrow = styled.div`
  padding: 0 2px;
  font-size: 10px;
`
const DateLock = styled.div`
  cursor: pointer;
`
const DurationContainer = styled.div`
  font-size: 12px;
`
const DurationInput = styled.input`
  font-size: 12px;
  border: none;
  width: auto;
  text-align: center;
`

export default MapNodeDates
