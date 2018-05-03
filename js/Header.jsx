// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setSearchTerm } from './actionCreators'

const Header = (props: {
  showSearch?: boolean,
  handleSearchTermChange: Function,
  searchTerm: string
}) => {

  let utilSpace

  if (props.showSearch) {
    utilSpace = (
      <input
        type='text'
        placeholder='Search'
        value={ props.searchTerm }
        onChange={ props.handleSearchTermChange }
      />
    )
  } else {
    utilSpace = (
      <h2>
        <Link to='/search'> Back </Link>
      </h2>
    )
  }
  
  return (
    <header>
      <h1>
        <Link to='/'>
          svideo
        </Link>
      </h1>
      { utilSpace }
    </header>
  )
}

Header.defaultProps = {
  showSearch: false
}

// mapStateToProps and mapDispatchToProps do what they sound like.
// They return objects that the connect function injects as props into
// the component
const mapStateToProps = (state) => ({ searchTerm: state.searchTerm })

const mapDispatchToProps = (dispatch: Function) => ({
  handleSearchTermChange (event) {
    dispatch(setSearchTerm(event.target.value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
