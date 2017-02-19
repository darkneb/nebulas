const debug = require('../lib/debug')(__filename)
const path = require('path')
const connect = require('connect')
const http = require('http')
const serveStatic = require('serve-static')

module.exports = function (appConfig) {
  debug('starting web server at http://localhost:%s', appConfig.serverPort)
  const app = connect()

  // parse urlencoded request bodies into req.body
  // var bodyParser = require('body-parser');
  // app.use(bodyParser.urlencoded({extended: false}));

  // add a simple logger for non-static file requests
  app.use(function (req, res, next) {
    debug('request: %s', req.url)
    next()
  })

  app.use('/config/save', function (req, res) {
    res.end(JSON.stringify({
      success: true
    }))
  })

  // global error handling
  app.use(function onerror (err, req, res, next) {
    debug('error!')
    console.error(err)
    res.status(500).end('Unexpected Error')
  })

  // static files
  const staticRoot = path.resolve(__dirname, '../../webroot')
  app.use(serveStatic(staticRoot, {
    'index': ['index.html']
  }))

  // create node.js http server and listen on port
  http.createServer(app).listen(appConfig.serverPort)
}
