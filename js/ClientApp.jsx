// @flow

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// function render top level app
const renderApp = () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('app'))
}

// render on 1st load
renderApp()

/**
 * If hot module replacement is enabled for this build, and if we see that
 * `module.hot` exists, we can be sure that we're in development.
 * Every time App changes, call the renderApp() function.
*/
if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp()
  })
}
