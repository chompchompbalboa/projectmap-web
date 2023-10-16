//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useRef } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  disabled?: boolean
  focusOnSelect?: boolean
  style?: React.CSSProperties
  updateValue(nextValue: Props['value']): void
  value: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContentEditable = ({ 
  disabled = false,
  focusOnSelect = false,
  style, 
  updateValue,
  value
}: Props): JSX.Element => {

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle Blur
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
    updateValue(e.currentTarget.innerText)
  }

  // Handle Focus
  const handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
    // Select the entire text string if focusOnSelect is set to true
    if(focusOnSelect) {    
      const range = document.createRange()
      range.selectNodeContents(e.currentTarget)
      const sel = window.getSelection()
      sel?.removeAllRanges();
      sel?.addRange(range)
    }
  }

  return (
    <Container
      ref={containerRef}
      className="nodrag" // Required for contentEditable to work inside reactflow
      contentEditable={!disabled}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={style}
    >
      {value}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: text;
  width: 100%;
  &:focus {
    outline: none;
  }
`

export default ContentEditable
