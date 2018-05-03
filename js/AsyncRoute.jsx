// @flow

/**
 * Purpose: we can use this async route component in our Router to only
 * load components when they're needed.
*/

import React, { Component } from 'react'
import Spinner from './Spinner'

// HOC! Higher Order Component!
// Although it will sometimes render markup (a spinner), it's main purpose
// is to capture a behavior. When it's rendered, it will go out and fetch the
// componet you've asked for, and only after it's fetched that will it render
// itself.
class AsyncRoute extends Component {

  state = {
    loaded: false
  }

  // as soon as this component is mounted to the DOM, we want to start acting
  // on the loadingPromise we're going to get from props
  componentDidMount () {
    this.props.loadingPromise
      .then(module => {
        this.component = module.default
        this.setState({ loaded: true })
      })
  }
  
  props: {
    // don't care what type - just passing through props to loaded component
    props: mixed,
    // promise resolves object, with default property, a class or type
    // React.Component. We don't care what type of React componenent, 
    // thus the *,*,*
    loadingPromise: Promise<{ default: Class<React.Component<*,*,*> >}>
  }

  component = null;

  render () {
    // if a component is loaded, render it with any props
    if (this.state.loaded) {
      return <this.component {...this.props.props} />
    }
    // otherwise, render the spinner
    return <Spinner />
  }

}

export default AsyncRoute
