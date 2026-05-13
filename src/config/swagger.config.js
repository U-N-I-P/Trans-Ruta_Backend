/**
 * @module config/swagger.config
 * @description Configuración de Swagger UI con autorización automática
 */
const path = require('path');
const fs = require('fs');

/**
 * Configura Swagger UI en la aplicación Express
 * @param {import('express').Application} app - Aplicación Express
 */
function setupSwagger(app) {
  const swaggerYamlPath = path.join(__dirname, '../../docs/swagger.yaml');
  const swaggerHtmlPath = path.join(__dirname, '../../docs/swagger-ui.html');

  // Servir el archivo YAML
  app.get('/api-docs/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(swaggerYamlPath);
  });

  // Servir el HTML personalizado
  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(swaggerHtmlPath);
  });

  console.log('📚 Swagger UI disponible en: http://localhost:3000/api-docs');
}

module.exports = { setupSwagger };
