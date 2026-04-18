/**
 * @module server
 * @description Punto de entrada del servidor Trans-Ruta
 */
require('dotenv').config();

const app = require('./src/app');
const env = require('./src/config/env');
const sequelize = require('./src/config/database');
const { testConnection } = require('./src/config/database');

const PORT = env.port;

async function startServer() {
  // 1. Probar conexión a la BD
  await testConnection();

  // 2. Sincronizar modelos (solo en desarrollo)
  if (env.nodeEnv === 'development') {
    await sequelize.sync({ alter: false });
    console.log('📦 Modelos sincronizados.');
  }

  // 3. Levantar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Trans-Ruta corriendo en http://localhost:${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api/v1`);
    console.log(`🌍 Entorno: ${env.nodeEnv}`);
  });
}

startServer().catch((err) => {
  console.error('💥 Error al iniciar el servidor:', err);
  process.exit(1);
});
