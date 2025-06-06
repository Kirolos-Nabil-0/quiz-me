#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Module dependencies.
 */
"use strict";

var _debug = _interopRequireDefault(require("debug"));
var _http = _interopRequireDefault(require("http"));
var _app = _interopRequireDefault(require("../app"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const debug = (0, _debug.default)('js/www:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process && process.env && process.env.PORT || undefined || '3001');
_app.default.set('port', port);

/**
 * Create HTTP server.
 */

const server = _http.default.createServer(_app.default);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`App listening on PORT ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const portNum = parseInt(val, 10);
  if (Number.isNaN(portNum)) {
    // named pipe
    return val;
  }
  if (portNum >= 0) {
    // port number
    return portNum;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}