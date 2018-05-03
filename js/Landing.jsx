// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RouterHistory } from 'react-router-dom'
import { setSearchTerm, resetSearchTerm } from './actionCreators'

class Landing extends Component {
  
  props: {
    searchTerm: string,
    handleSearchTermChange: Function,
    handleBrowseAll: Function,
    history: RouterHistory
  }

  goToSearch = (event: SyntheticEvent) => {
    event.preventDefault()
    this.props.history.push('/search')
  }

  render() {
    return (
      <div className='landing'>
        <h1>svideo</h1>
        <form onSubmit={ this.goToSearch }>
          <input
            value={ this.props.searchTerm }
            onChange={ this.props.handleSearchTermChange }
            type='text'
            placeholder='search'
          />
        </form>
        <Link to='/search' onClick={ this.props.handleBrowseAll }>
          or Browse All
        </Link>
      </div>
    )
  }
}


// What this does: takes the whole state of redux and pulls out just the thing
// that this component care about.
const mapStateToProps = (state) => ({ searchTerm: state.searchTerm })

// creates methods that Landing can invoke to dispatch actions to redux
const mapDispatchToProps = (dispatch: Function) => ({

  handleSearchTermChange(event) {
    dispatch(setSearchTerm(event.target.value))
  },

  handleBrowseAll() {
    dispatch(resetSearchTerm())
  }

})

// Then we connect state/props to the componet using the 'connect' function:
export default connect(mapStateToProps, mapDispatchToProps)(Landing)

// 'connect' returns a function that then gets called on the Landing class.