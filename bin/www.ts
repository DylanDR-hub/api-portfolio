#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from '../app';
import debug from 'debug';
import http from 'http';
import dotenv from 'dotenv';
import {closeDb} from "../db";

// Charger les variables d'environnement
dotenv.config();

const log = debug('api-portfolio:server');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();

  if (!addr) {
    console.error('Erreur: impossible de récupérer l\'adresse du serveur');
    return;
  }

  const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

  if (typeof addr !== 'string') {
    console.log('');
    console.log('🚀 Serveur démarré avec succès !');
    console.log('📡 API disponible sur http://localhost:' + addr.port);
    console.log('📚 Documentation Swagger sur http://localhost:' + addr.port + '/api-docs');
    console.log('');
  }

  log('Listening on ' + bind);
}

process.on('SIGINT', async () => {
  await closeDb();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDb();
  process.exit(0);
});