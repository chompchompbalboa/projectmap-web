//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { Node } from '../store/node'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../store/store'
import { updateNode, updateNodeDates } from '../store/nodeActions'
import {
  formatDate,
  getHumanDurationFromISO,
  getISODurationFromHuman
} from '../utils'

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
          <Date
            type="date"
            style={{ marginRight: '2px', textAlign: 'right' }}
            value={formatDate(nodeStartDate)}
            onChange={(e): void => handleStartDateChange(e.target.value)}
            />
        }
        {(nodeStartDateVisible || nodeEndDateVisible) && <DateArrow>→</DateArrow>}
        {nodeEndDateVisible && (
          <Date
            type="date"
            style={{ marginLeft: '2px', textAlign: 'left' }}
            value={formatDate(nodeEndDate)}
            onChange={(e): void => handleEndDateChange(e.target.value)}
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
const Date = styled.input`
  margin: 0;
  padding: 0;
  border: none;
  font-size: 12px;
  font-family: inherit;
  &:focus {
    outline: none;
  }
  &::-webkit-calendar-picker-indicator {
    display: none;
  }
`
const DateArrow = styled.div`
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
