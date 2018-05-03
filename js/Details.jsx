// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getApiDetails } from './actionCreators'
import Header from './Header'
import Spinner from './Spinner'

class Details extends Component {

  componentDidMount () {
    // do I already have data for this? if not, go request it
    if (!this.props.rating) {
      this.props.getApiData()
    }
  }

  props: {
    show: Show,  // eslint-disable-line no-undef
    rating: string,
    getApiData: Function
  }
  
  render () {
    const { title, description, year, poster, trailer } = this.props.show
    let ratingComponent
    
    if (this.props.rating) {
      ratingComponent = <h3>{ this.props.rating }</h3>
    } else {
      ratingComponent = <Spinner />
    }

    return (
      <div className='details'>
        <Header />
        <section>
          <h1>{ title }</h1>
          <h2>({ year })</h2>
          {ratingComponent}
          <img
            src={`/public/img/posters/${ poster }`}
            alt={ `Poster for ${ title }`}
          />
          <p>{ description }</p>
        </section>
        <div>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;controls=0&amp;showinfo=0`}
            frameBorder='0'
            allowFullScreen
            title={`Trailer for ${ title }`}
          />
        </div>
      </div>
    )
  }
  
}

// 2nd param, `ownProps` are the props passed down from the parent.
// we need this because that's how we're going to determine which apiData
// to pull our of our redux store. In this case, we get `show` from parent
// component.
const mapStateToProps = (state, ownProps) => {
  const apiData = state.apiData[ownProps.show.imdbID]
    ? state.apiData[ownProps.show.imdbID]
    : { apiData: '' }
  return {
    rating: apiData.rating
  }
}

const mapDispatchToProps = (dispatch: Function, ownProps) => ({
  getApiData() {
    dispatch(getApiDetails(ownProps.show.imdbID))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Details)
