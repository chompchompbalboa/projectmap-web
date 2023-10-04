//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { createMap } from '@/store/mapActions'
import { User } from '@/store/user'
import { AppDispatch } from '@/store/store'

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type Props = {
  userId: User['id']
}

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const CreateMap = ({ userId }: Props): JSX.Element => {

  // Redux
  const dispatch = useDispatch<AppDispatch>()

  const handleClick = () => {
    console.log('handleClick')
    dispatch(createMap({ userId }))
  }

  return (
    <Container onClick={handleClick}>
      Create map
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;
  border: 1px solid gray;
  border-radius: 7px;
  padding: 10px;
  background: white;
  &:hover {
    background: rgb(250,250,250);
  }
`

export default CreateMap
