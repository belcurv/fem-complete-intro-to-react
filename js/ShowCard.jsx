// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

// using Wrapper to "wrap" Link, pass Link to styled function
const Wrapper = styled(Link)`
  border: 2px solid #333;
  border-radius: 4px;
  color: black;
  margin-bottom: 25px;
  overflow: hidden;
  padding-right: 10px;
  text-decoration: none;
  width: 32%;
`

const Image = styled.img`
  width: 46%;
  float: left;
  margin-right: 10px;
`

class ShowCard extends Component {

  // once this component has rendered for the 1st time, never update it
  shouldComponentUpdate () {
    return false
  }
  
  props: Show  // eslint-disable-line no-undef

  render() {
    return (
      <Wrapper className='show-card' to={`/details/${ this.props.imdbID }`}>
        <Image
          alt={`${ this.props.title } Show Poster`}
          src={`/public/img/posters/${ this.props.poster }`} />
        <div>
          <h3>{ this.props.title }</h3>
          <h4>({ this.props.year })</h4>
          <p>{ this.props.description }</p>
        </div>
      </Wrapper>
    )
  }
}

export default ShowCard
