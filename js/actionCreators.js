// @flow

import axios from 'axios'
import { SET_SEARCH_TERM, RESET_SEARCH_TERM, ADD_API_DATA } from './actions'

export function setSearchTerm(searchTerm: string) {
  return { type: SET_SEARCH_TERM, payload: searchTerm }
}

export function resetSearchTerm() {
  return { type: RESET_SEARCH_TERM }
}

export function addApiData(apiData: Show) {
  return { type: ADD_API_DATA, payload: apiData }
}

// most action creators return objects -- see above, for ex.
// this one is going to return a Thunk (a function)
export function getApiDetails(imdbID: string) {
  return (dispatch: Function) => {  // this anon function is the Thunk
    axios
      .get(`http://localhost:3000/${imdbID}`)
      .then(response => {
        dispatch(addApiData(response.data))
      })
      .catch(err => console.error('axios error', err))
  }
}