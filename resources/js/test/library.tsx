//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'

import { store } from '../store/store'
import { Provider } from 'react-redux'

//-----------------------------------------------------------------------------
// Providers
//-----------------------------------------------------------------------------
const Providers = ({
  children
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <Provider store={store}>{children}</Provider>
}

//-----------------------------------------------------------------------------
// Render
//-----------------------------------------------------------------------------
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: Providers, ...options })

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export * from '@testing-library/react'
export { customRender as render }
