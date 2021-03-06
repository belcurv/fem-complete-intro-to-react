# A Complete Intro to React

[gh-page]: http://btholt.github.io/complete-intro-to-react/

## State

Only keep things into state that have to do with re-renders. If some state property changes from true to false, for example, we need a re-render.

Don't store whole React components into state, haha.

## Testing

Using Jest. Why? Reasons include snapshot testing. First time you run Jest snapshot testing, Jest will accept that the 1st run is the correct version. Then, for future tests Jest checks new component renders against its snapshot, to see if anything has changed (changes = failed test).

**You are supposed to check snapshots into Git.** This is so other peoples' tests checks against the same snapshots as you.

Under the hood, Jest is just Jasmine (?!) - same syntax.

Put a `__tests__` -- two leading & trailing underscores -- in the same folders as your components.

For each `Component.jsx` there should be a `Component.spec.jsx` test. This optimizes for "deletability".

`react-test-renderer` allows us to render out a component and test it without actually having a DOM underneath it.

Need a top-level property in `.babelrc` so that Node (what Jest runs in) understands ES6 imports and JSX:

```JSON
"env": {
  "test": {
    "plugins": [
      "transform-es2015-modules-commonjs"
    ]
  }
}
```

That says, "when NODE_ENV = 'test', use this plugin".

A simple test:

```JS
import React from 'react'
import renderer from 'react-test-renderer'
import Search from '../Search'

test('Search renders correctly', () => {
  const component = renderer.create(<Search />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
```

Running it from terminal:

```
$ NODE_ENV=test ./node_modules/.bin/jest
```

Jest `.toMatchSnapshot()` method automatically creates a `__snapshots__` folder with `.snap` files in it. Those are like rendered DOM trees.

To update Jest's saved snapshot, run

```
$ NODE_ENV=test ./node_modules/.bin/jest -u
```

* Note: Jest sets `NODE_ENV` to 'test' itself. No need to preface commands with NODE_ENV.

A problem with the above approach: We have a test for `Search.jsx`, which internally uses nested `ShowCard.jsx` components. If we make changes to `ShowCard.jsx`, our test for `Search.jsx` will fail. This is undesirable. Problems with `ShowCard.jsx` should be caught in `ShowCard.jsx` tests, not in `Search.jsx` tests.

We can use the **enzyme** library to solve the above. Enzyme is a wrapper on top of `react-test-renderer` that does certain things for us. It solves the above problem by stubbing out all child components. So it doesn't care what happens in `ShowCard.jsx`. **Must** remove the `react-test-renderer` import - enzyme calls this under the hood. 

Now our test looks like this:

```js
import React from 'react'
import { shallow } from 'enzyme'
import Search from '../Search'

test('Search renders correctly', () => {
  const component = shallow(<Search />)
  expect(component).toMatchSnapshot()
})
```

**OMG** To skip a `test`, `it` or `describe` from being run as part of your test suite, you just prefix the keyword with "x":

```js
xtest('Search renders correctly', () => {
  const component = shallow(<Search />)
  expect(component).toMatchSnapshot()
})
```

Brian's opinion on testing: companies he has worked for generally chose NOT to test presentational React components, because they're constantly changing. But they all DID test the hell out of business logic. Tests take a while to conceive of and write, and we want them to remain useful for a long time. Well, if your markup is in a constant state of flux, previous tests quickly become useless.

**Istanbul**

Test coverage. Already built into Jest.


```
yarn test -- --coverage
```

We've aliased this to a script:

```
yarn test:coverage
```

**Hot Module Replacement**

Webpack is smart enough to see the dependency graph of what depends on what. Since it knows this, it can cut off and replace only the parts of your app that change. All without reloading the browser.

Hot module replacement is a feature that was already built into Webpack. React is just the first to really take advantage of it.

**Flow**

Typing. Flow vs TypeScript. Brian knows Flow, so he's teaching Flow.

What is Flow.

JS is a dynamic lang. Really fast to write; don't have to add type annotations to everything we write. However if you do write types you can be more assured you won't have runtime errors. Forces you to think through & change code such that you depend on types. You'll have better code with less errors.

What are types? String, Number, Boolean, Object, Array, DOM Nodes, Events.

Getting started:

```
yarn flow -- init
```

Generates a `.flowconfig` file. Flow is opt-in. You have to opt-in every file.

Install `flow-typed` globally:

```
sudo npm install -g flow-typed
```

Why? So we can install typings already made by the community.

```
flow-typed install
```

That looks through your package.json and downloads types files, storing them in a root-level `flow-typed` folder.

In `.flowconfig` we need to specifically ignore styled-components. We don't want to ignore everything in `node_modules`, but we need to ignore styled components. So, add this in the `[ignore]` section:

<PROJECT_ROOT>/node_modules/styled-components/*

Now we can run flow via command line:

```
$ flow
```

And should not get any errors.

**Lifecycle methods**

`ComponentWillMount` - called after a component is rendered but before it is mounted to the DOM. This method can be called on both client and server-rendered React.

`ComponentDidMount` - called after component is rendered and mounted to the DOM. Key thing: you're guaranteed to have a `window` object. So anything you want to do with `window` or `document`, or anything having to do with ajax requests, you do in `ComponentDidMount`.

Another use for `ComponentDidMount` is if you need to integrate with another library. D3, for example. Adding event listeners, too. You use it quite a bit.

`shouldComponentUpdate` - a performance optimization.

`componentWillUnmount` - before component is about to leave the DOM. This is where you kill any event listeners, or detatch from D3, etc. Cleanup happens here. Not something you're typically going to have to do, but it's there if you need it.

**Redux**

Redux will make architecture more complicated. The library is relatively simple, but integrating it adds a lot of complexity.

Dan Abramov based Redux on Facebook's Flux + Elm architecture.

Dispatch actions into data stores, which modify themselves, and notify subscribers. With Flux you have many single-concern stores. In Redux you have 1 store. One tree of data, to mimic the application's tree. Each part of the app can subscribe to one part of the tree.

Top-level function in Redux is a reducer. Or root reducer. A function that takes in existing store's state plus an action, and gives you back a new state. This makes state management with Redux very testable.

Redux eliminates the "data tunneling" problem. Say you have 10 parent-child-related components, where the bottom child needs some state data. That data might have to be passed From the 9 ancestral components - who likely don't care about that data at all - all the way down to the bottom child. With Redux, each component can simply access the store directly.

We're going to take our React component state out of React, and put it in Redux.

Steps:
1.  kick off an event
2.  event is going to call a handler
3.  handler is going to dispatch an action to Redux via an "action creator"
4.  which is then going to get called into a reducer
5.  the reducer is then going to modify state
6.  once the state has been modified, it's going to notify React, which is a subscriber, and who will kick off a re-render
7.  Now state is updated.

At the top level of every store is the `rootReducer`:

```js
const DEFAULT_STATE = {
  searchTerm: ''
}

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
}
```

Given the same input in, it gives you the same output out.

The `rootReducer` is going to dispatch to other reducers that will take care of the transformation. `rootReducer` needs to:

1.  take care of default state. 1st thing Redux does is call the root reducer with no state, to get the initial state.
2.  deal with handling unknown actions (hence the `default` switch block above).

**Actions**

Have a `type` (string) and a `payload` (string | number | bool | object). This is called the flux standard action style:

```js
{
  type: {string},
  payload: {any}
}
```

**Application state vs View state**

This re: a component's presentation layer (is this in focus, for ex) should live in component state (and use `setState`) - no need to store it in Redux application state. But things that come back from an API, etc. should go into application state (Redux).

**Async Redux**

Details.jsx includes a componentDidMount lifecycle method that makes an axios call to our API, and then calls `setState` with the result.

Brian argues that since we're using Redux, it would be better to deal with this in Redux. We should move the logic from componentDidMount into an actionCreator.

But currently, Redux only understands how to handle objects synchronously. We need to augment Redux abilities. Several ways to do this:

1.  Redux Thunk - most popular
2.  Redux Promise
3.  Redux Observable
4.  Redux Sagas

**Thunks**

A thunk is a fancy function the returns a value at runtime (?).

**Universal Rendering**

FKA, "Server Side Rendering", FKA "Isomorphic Rendering", also FKA a bunch of other things.

Server Side Rendering improves perceived load times. You render markup as a string on server, send that to the client, and then React will try to catch up behind the scenes. The 1st paint is not actually interactive. Hopefully, by the time the user sees something they can interact with, React will have been DL'd and parsed and all that.

Key: this requires Node specifically. Not Rails. Not Java. Some companies with non-Node backends will run Node as a "middle end" - Node feeds from an existing non-Node backend, and compiles rendered HTML to send to clients.

SSR by itself is not difficult to do.

Normally have 2 webpack configs - one for dev and one for production. Not doing that today.

**Code Splitting with Webpack**

First reverted SSR w/HMR back to using webpack-dev-server.

Code splitting, aka "chunking". Problem: server-side rendering + HMR + code splitting all at once doesn't work. It's a "pick 2" scenario. All 3 cannot exist together given how webpack works.

What we want: only load the JS necessary for the page. So, when we hit Landing, only load the code for Landing.

**Building for production**

Current bundle size is > 5 MB. Crazy. Webpack to the rescue. Let's disable some stuff when in production mode:

```js
if (process.env.NODE_ENV === 'production') {
  config.entry   = './js/ClientApp.jsx'  // ignore HMR
  config.devtool = false                 // disable sourcemaps
  config.plugins = []                    // explitily ignore plugins
}
```

Typically don't use gzip on a Node/Express server. It's better suited to use on Nginx, etc. But for demonstration, we use it in express.

Then in terminal

```
NODE_ENV=production yarn build -- -p
```

The `-p` flag tells webpack to build for production, generate smallest bundle possible.

Pull branch `v3-30` to catch up.

**Preact**

Branch `v3-31`

The bulk of the minified & gzipped bundle is React itself - approx 43kB. So we can use Preact instead. It's the same API as React in 3kB! How?! No synthetic event systems (it uses DOM events). Not a must, but something to consider. Don't have to change any of our code, and it's just going to work.

How do we use this? Webpack config again

First: alias requests for one thing to another thing.

```js
resolve: {
  extensions: ['.js', '.jsx', '.json'],
  alias: {
    'react': 'preact-compat',
    'react-dom': 'preact-compat'
  }
},
```

Then, since some of preact needs to run through babal, we need to include it:

```js
module: {
  rules: [
    {
      enforce: 'pre',
      ...
    },
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        path.resolve('js'),
        path.resolve('node_modules/preact-compat/src')
      ]
    }
  ]
}
```

Build was 226kB with React (un-gzipped). With Preact, it's down to 131kB. Gzipped we went from 76kB with React down to 39kB with Preact.

There's another lib Inferno that does the same thing.