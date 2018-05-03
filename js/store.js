// @flow

/**
 * What's compose? Middleware. We can augment Redux with middleware.
 * We use 'compose' to intercept all actions and feeds it into the
 * Redux dev tools.
 * 'thunk' is another Redux middleware. Compose adds it too.
*/

import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
    ? window.devToolsExtension()
    : f => f
  )
)

export default store
