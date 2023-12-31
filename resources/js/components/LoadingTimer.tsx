//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import useInterval from '@/utils/useInterval'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface Props {
  fromId: string
}

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const LoadingTimer = ({
  fromId
}: Props) => {
  
  const [ time, setTime ] = useState(0)
  
  useEffect(() => {
    setTime(0)
  }, [ fromId ])
  
  useInterval(() => {
    setTime(time => time + 10)
  }, 10)
  
  return (
    <Container>
      <Time>{(time / 1000).toFixed(2)} seconds</Time>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  opacity: 0.8;
`

const Time = styled.div``

export default LoadingTimer