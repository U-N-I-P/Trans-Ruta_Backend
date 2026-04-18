/**
 * @module utils/logger
 * @description Configuración de Morgan
 */
const morgan = require('morgan');

const logger = morgan('dev');

module.exports = logger;
