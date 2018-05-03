// @flow

import { combineReducers } from 'redux'
import { SET_SEARCH_TERM, RESET_SEARCH_TERM, ADD_API_DATA } from './actions'

// reducers

const searchTerm = (state='', action: Action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return action.payload
    case RESET_SEARCH_TERM:
      return ''
    default:
      return state
  }
}

const apiData = (state = {}, action: Action) => {
  switch (action.type) {
    case ADD_API_DATA:
      return Object
        .assign({}, state, { [action.payload.imdbID]: action.payload })
    default:
      return state
  }
}

const rootReducer = combineReducers({ searchTerm, apiData })

export default rootReducer
