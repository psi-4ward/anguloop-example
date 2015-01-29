var loopback = require('loopback');
var boot = require('loopback-boot');
var packageloader = require('loopback-packageloader');
var expressWebsocket = require('express-websocket');

var app = module.exports = loopback();

// generate a boot config that supports packages
var bootCfg = packageloader();

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, bootCfg);

// start the web server
var httpServer = app.listen(function() {
  app.emit('started');
  console.log('Web server listening at: %s', app.get('url'));
});

// attach express-websocket
expressWebsocket(app, httpServer);
