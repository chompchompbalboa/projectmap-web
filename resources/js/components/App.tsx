import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from '@/store/store'

import Map from '@/components/Map'

ReactDOM.createRoot(document.getElementById('react-container') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <Map />
    </React.StrictMode>
  </Provider>
)