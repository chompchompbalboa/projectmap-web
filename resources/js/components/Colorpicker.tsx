//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useRef } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  defaultValue?: Props['value']
  disabled?: boolean
  updateValue(nextValue: Props['value']): void
  value: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ColorPicker = ({ 
  defaultValue = '#FFFFFF',
  disabled = false,
  updateValue,
  value
}: Props): JSX.Element => {

  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateValue(e.currentTarget.value)
  }

  return (
    <Container
      type="color"
      disabled={disabled}
      onChange={handleChange}
      value={value || defaultValue} />
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.input``

export default ColorPicker
