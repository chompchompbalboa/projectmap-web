import { configureStore } from '@reduxjs/toolkit'
import activeSlice from '@/store/active'
import edgeSlice from '@/store/edge'
import mapSlice from '@/store/map'
import nodeSlice from '@/store/node'
import reactFlowSlice from '@/store/reactFlow'

export const store = configureStore({
  reducer: {
    active: activeSlice,
    edge: edgeSlice,
    map: mapSlice,
    node: nodeSlice,
    reactFlow: reactFlowSlice
  }
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch