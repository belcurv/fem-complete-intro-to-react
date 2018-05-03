// @flow

import moxios from 'moxios'
import { setSearchTerm, addApiData, getApiDetails } from '../actionCreators'

const strangerThings = {
  rating: '0.8',
  title: "Stranger Things",
  year: "2016–",
  description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying forces in order to get him back.",
  poster: "st.jpg",
  imdbID: "tt4574334",
  trailer: "9Egf5U8xLo8"
}

// Expects a well-formed object { type: SET_SEARCH_TERM, payload: searchTerm }.
// Remember, snapshots are just JSON structures.
// So we can expect our object to match the JSON snapshot Jest gives us.
test('setSearchTerm', () => {
  expect(setSearchTerm('New York')).toMatchSnapshot();
})


test('addApiData', () => {
  expect(addApiData(strangerThings)).toMatchSnapshot()
})


// async test -- needs 'done' like Mocha
// also an integration test: depends on addApiData, so test that 1st!
test('getApiDetails', (done: Function) => {
  const dispatchMock = jest.fn() // spy! Tests function called w/correct params
  moxios.withMock(() => {
    const thunk = getApiDetails(strangerThings.imdbID)
    thunk(dispatchMock)
    moxios.wait(() => {
      // was it called w/correct URL
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: strangerThings
        })
        .then(() => {
          expect(request.url)
            .toEqual(`http://localhost:3000/${strangerThings.imdbID}`)
          expect(dispatchMock)
            .toBeCalledWith(addApiData(strangerThings))
          done()
        })
    })
  })
})