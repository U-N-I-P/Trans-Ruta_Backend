/**
 * @module app
 * @description Configuración central de Express
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');

const app = express();

// 1. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. CORS
app.use(cors({ origin: env.corsOrigin, credentials: true }));

// 3. Logger HTTP
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// 4. Cargar modelos y asociaciones
require('./models');

// 5. Swagger Documentation
const { setupSwagger } = require('./config/swagger.config');
setupSwagger(app);

// 6. Rutas
const routes = require('./routes');
app.use('/api/v1', routes);
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Trans-Ruta API v1 funcionando',
    documentation: '/api-docs'
  });
});

// 7. Middleware 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// 8. Manejador global de errores
const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = app;
