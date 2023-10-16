//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useRef, useState } from 'react'
import { DateTime } from 'luxon'
import styled from 'styled-components'

import { dateFormat } from '@/utils'

import Dropdown from '@/components/Dropdown'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface Props {
  dropdownLeft?: 'auto' | '0'
  dropdownRight?: 'auto' | '0'
  valueFontSize?: string
  onDateChange(nextDate: string): void
  formattedDateValue?: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Datepicker = ({
  dropdownLeft = '0',
  dropdownRight = 'auto',
  valueFontSize = '1em',
  onDateChange,
  formattedDateValue = DateTime.now().toFormat(dateFormat),
}: Props) => {

  // Dates
  const value = DateTime.fromFormat(formattedDateValue, dateFormat)
  const today = DateTime.now()

  // State
  const [ currentMonth, setCurrentMonth ] = useState(value ? value : today)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Refs
  const datepickerContainerRef = useRef<HTMLDivElement>(null)

  // Build the array to display the dates
  let currentMonthDatesArray = []
  let daysInCurrentMonth = currentMonth.daysInMonth || 31
  let firstDayOfCurrentMonthWeekday = currentMonth.set({ day: 1 }).weekday
  // Luxon uses Monday as the 1st day of the week, while we use Sunday as the 1st
  // day of the week. This doesn't affect adding the previous month to the array,
  // but it does affect it when appending the next month, so we have to adjust 
  // when getting the day of the week the last day of the month falls on.
  let lastDayOfCurrentMonthWeekday = currentMonth.set({ day: daysInCurrentMonth }).weekday === 7
    ? 1
    : currentMonth.set({ day: daysInCurrentMonth }).weekday + 1
  let dayInNextMonth = 1

  while(firstDayOfCurrentMonthWeekday > 0 && firstDayOfCurrentMonthWeekday !== 7) {
    currentMonthDatesArray.push(
      currentMonth.set({ day: 1 }).minus({ days: firstDayOfCurrentMonthWeekday })
    )
    firstDayOfCurrentMonthWeekday--
  }
  for(let currentDate = 1; currentDate <= daysInCurrentMonth; currentDate++) {
    currentMonthDatesArray.push(currentMonth.set({ day: currentDate }))
  }
  while(lastDayOfCurrentMonthWeekday + 1 <= 7) {
    currentMonthDatesArray.push(
      currentMonth.set({ day: daysInCurrentMonth }).plus({ days: dayInNextMonth })
    )
    lastDayOfCurrentMonthWeekday++
    dayInNextMonth++
  }

  return (
    <Container
      ref={datepickerContainerRef}
      onClick={() => setIsDropdownVisible(true)}>
      <Value
        $fontSize={valueFontSize}>
        {value.toFormat(dateFormat)}
      </Value>
      <Dropdown
        closeDropdown={() => setIsDropdownVisible(false)}
        containerRef={datepickerContainerRef}
        isDropdownVisible={isDropdownVisible}
        left={dropdownLeft}
        right={dropdownRight}>
        <DatepickerHeader>
          <ChangeCurrentMonth
            onClick={() => setCurrentMonth(currentMonth.minus({ months: 1 }))}>
            ←
          </ChangeCurrentMonth>
          <CurrentMonth>
            {currentMonth.toFormat('MMMM yyyy')}
          </CurrentMonth>
          <ChangeCurrentMonth
            onClick={() => setCurrentMonth(currentMonth.plus({ months: 1 }))}>
            →
          </ChangeCurrentMonth>
        </DatepickerHeader>
        <DatepickerDates>
          {currentMonthDatesArray.map((currentDate, index) =>
            <DatepickerDate
              key={index}
              $isAdjacentMonth={currentDate.month !== currentMonth.month}
              $isSelected={currentDate.toFormat(dateFormat) === value.toFormat(dateFormat)}
              $isTodaysDate={currentDate.toFormat(dateFormat) === today.toFormat(dateFormat)}
              onClick={() => onDateChange(currentDate.toFormat(dateFormat))}>
              {currentDate.day}
            </DatepickerDate>
          )}
        </DatepickerDates>
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const Value = styled.div<ValueProps>`
  cursor: pointer;
 font-size: ${ ({ $fontSize }: ValueProps) => $fontSize}
`
type ValueProps = {
  $fontSize: string
}

const DatepickerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ChangeCurrentMonth = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: rgb(238, 238, 238);
  }
`

const CurrentMonth = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
`

const DatepickerDates = styled.div`
  width: 17.5rem;
  display: flex;
  flex-flow: row wrap;
`

const DatepickerDate = styled.div<DatepickerDateProps>`
  cursor: pointer;
  width: calc(17.5rem / 7);
  height: calc(17.5rem / 7);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${ ({ $isSelected, $isTodaysDate }: DatepickerDateProps) => $isSelected ? 'rgb(80, 110, 200)' : ($isTodaysDate ? 'rgb(238, 238, 238)' : 'transparent')};
  color: ${ ({ $isAdjacentMonth, $isSelected }: DatepickerDateProps) => $isSelected ? 'white' : ($isAdjacentMonth ? 'rgb(165, 165, 165)' : 'inherit')};
  font-weight: ${ ({ $isSelected, $isTodaysDate }: DatepickerDateProps) => $isTodaysDate || $isSelected ? 'bold' : 'inherit'};
  &:hover {
    background-color: ${ ({ $isSelected }: DatepickerDateProps) => $isSelected ? 'rgb(80, 110, 200)' : 'rgb(238, 238, 238)'};
  }
`
interface DatepickerDateProps {
  $isAdjacentMonth: boolean
  $isSelected: boolean
  $isTodaysDate: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Datepicker