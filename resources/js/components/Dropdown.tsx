//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { RefObject, useEffect } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface Props {
  className?: string
  containerRef: RefObject<HTMLElement>
  children?: any
  closeDropdown(): void
  isDropdownVisible: boolean
  top?: string
  left?: string
  bottom?: string
  right?: string
  minHeight?: string
  minWidth?: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Dropdown = ({ 
  children,
  className,
  containerRef,
  closeDropdown,
  isDropdownVisible,
  top = '100%',
  left = '0',
  bottom = 'auto',
  right = 'auto',
  minHeight = "auto",
  minWidth = "auto"
}: Props) => {

  // Add event listeners when the dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('click', closeDropdownOnClickOutside)
    }
    else {
      removeEventListener('click', closeDropdownOnClickOutside)
    }
    return () => {
      removeEventListener('click', closeDropdownOnClickOutside)
    }
  }, [ 
    closeDropdown,
    containerRef && containerRef.current, 
    isDropdownVisible
  ])

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: MouseEvent) => {
    if(containerRef && containerRef.current && !containerRef.current.contains(e.target as Node)) {
      closeDropdown()
    }
  }

  return (
    <StyledDropdown
      className={className}
      $isDropdownVisible={isDropdownVisible}
      $top={top}
      $left={left}
      $bottom={bottom}
      $right={right}
      $minHeight={minHeight}
      $minWidth={minWidth}>
      {children}
    </StyledDropdown>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledDropdown = styled.div<StyledDropdownProps>`
  z-index: 10;
  position: absolute;
  display: ${ ({ $isDropdownVisible }: StyledDropdownProps ) => $isDropdownVisible ? 'block' : 'none' };
  top: ${ ({ $bottom, $top }: StyledDropdownProps ) => $bottom !== 'auto' ? 'auto' : $top };
  left: ${ ({ $left, $right }: StyledDropdownProps ) => $right !== 'auto' ? 'auto' : $left };
  bottom: ${ ({ $bottom }: StyledDropdownProps ) => $bottom };
  right: ${ ({ $right }: StyledDropdownProps ) => $right };
  min-width: ${ ({ $minWidth }: StyledDropdownProps ) => $minWidth };
  min-height: ${ ({ $minHeight }: StyledDropdownProps ) => $minHeight };
  max-height: 50vh;
  background-color: rgb(250, 250, 250);
  border-radius: 5px;
  border: 1px solid rgb(180, 180, 180);
  overflow-y: scroll;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
`
interface StyledDropdownProps {
  $top: string
  $left: string
  $bottom: string
  $right: string
  $isDropdownVisible: boolean
  $minWidth: string
  $minHeight: string
}

export default Dropdown