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

import ContentEditable from '@/components/ContentEditable'
import Datepicker from '@/components/Datepicker'

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
  const nodeIsStartDateVisible = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].isStartDateVisible
  )
  const nodeIsEndDateVisible = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].isEndDateVisible
  )
  const nodeIsDurationVisible = useSelector(
    (state: AppState) => state.node.allNodes[nodeId].isDurationVisible
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
        {nodeIsStartDateVisible &&
          <Datepicker
            formattedDateValue={formatDate(nodeStartDate)}
            onDateChange={(nextDate): void => handleStartDateChange(nextDate)}
            valueFontSize='12px'
            />
        }
        {(nodeIsStartDateVisible || nodeIsEndDateVisible) && <DateArrow>→</DateArrow>}
        {nodeIsEndDateVisible && (
          <Datepicker
            dropdownLeft='auto'
            dropdownRight='0'
            formattedDateValue={formatDate(nodeEndDate)}
            onDateChange={(nextDate): void => handleEndDateChange(nextDate)}
            valueFontSize='12px'
          />
        )}
      </Dates>
      {nodeIsDurationVisible &&
        <ContentEditable
          focusOnSelect
          value={localNodeDuration}
          updateValue={handleDurationChange}
          style={{
            fontSize: '12px',
            textAlign: 'center'
          }}/>
      }
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

export default MapNodeDates
