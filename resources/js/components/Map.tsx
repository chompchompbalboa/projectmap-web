//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../store/store'
import { loadMap } from '@/store/mapActions'

import LoadingTimer from '@/components/LoadingTimer'
import MapReactFlow from '@/components/MapReactFlow'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
function Map(): JSX.Element {

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const activeMapId = useSelector((state: AppState) => state.active.activeMapId)

  // Get the mapId from the url
  const mapIdToLoad = window.location.pathname.split("/").pop()

  // Effects
  const isLoadMapCalled = useRef(false)
  useEffect(() => {
    // Load the map when the component renders
    if(isLoadMapCalled.current === false) {
      if (mapIdToLoad) {
        isLoadMapCalled.current = true
        dispatch(loadMap({ mapId: mapIdToLoad }))
      }
    }
  }, [])

  return (
    activeMapId === undefined
    ? <div style={{ width: '100vw', height: '100vh'}}>
        <LoadingTimer fromId={mapIdToLoad || 'Map'}/>
      </div>
    : <MapReactFlow mapId={activeMapId}/>
  )
}

export default Map
