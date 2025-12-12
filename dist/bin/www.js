#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const app_1 = __importDefault(require("../app"));
const debug_1 = __importDefault(require("debug"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db");
// Charger les variables d'environnement
dotenv_1.default.config();
const log = (0, debug_1.default)('api-portfolio:server');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app_1.default.set('port', port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app_1.default);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
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
function onError(error) {
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
function onListening() {
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
    await (0, db_1.closeDb)();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await (0, db_1.closeDb)();
    process.exit(0);
});
