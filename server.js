// node server for server-side rendering

/* ================================= SETUP ================================= */

// this file will not be run through babel.
// everything this file requires will be run through babel.
require('babel-register')

const express        = require('express')
const React          = require('react')
const ReactDOMServer = require('react-dom/server')
const ReactRouter    = require('react-router-dom')
const _              = require('lodash')
const fs             = require('fs')
const App            = require('./js/App').default

const StaticRouter   = ReactRouter.StaticRouter
const port           = 8080
const baseTemplate   = fs.readFileSync('./index.html')
const template       = _.template(baseTemplate)

const server = express()


/* ================================ CONFIG ================================= */

// serve static assets from
server.use('/public', express.static('./public'))

// serve rendered App
server.use((req, res) => {
  const context = {}
  const body    = ReactDOMServer.renderToString(
    React.createElement(
      StaticRouter, { location: req.url, context },
      React.createElement(App)
    )
  )

  if (context.url) {
    res.redirect(context.url)
  }

  res.write(template({ body }))
  res.end()

})

/* ============================== START SERVER ============================== */
server.listen(port, () => {
  console.log(`listening on ${port}`)
})