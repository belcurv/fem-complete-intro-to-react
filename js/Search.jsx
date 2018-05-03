// @flow

import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import ShowCard from './ShowCard'


// using es6 class properties
const Search = (props: {
  searchTerm: string, // eslint-disable-line react/no-unused-prop-types
  shows: Array<Show> // eslint-disable-line no-undef
}) => (
  <div className='search'>
    <Header showSearch />
    <div>
      {props.shows
        .filter(show =>
          `${show.title} ${show.description}`
            .toUpperCase()
            .indexOf(props.searchTerm.toUpperCase()) >= 0)
        .map(show => <ShowCard key={show.imdbID} {...show} />)}
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  searchTerm: state.searchTerm
})

// only used for testing purposes
export const Unwrapped = Search;

export default connect(mapStateToProps)(Search)
