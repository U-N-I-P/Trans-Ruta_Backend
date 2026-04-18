/**
 * @module config/database
 * @description Configuración de Sequelize + PostgreSQL
 */
const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: env.nodeEnv === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

/**
 * Prueba la conexión a la base de datos
 * @returns {Promise<void>}
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

// Exportación compatible con Sequelize CLI y con la app
module.exports = sequelize;
module.exports.testConnection = testConnection;
module.exports.development = {
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
};
module.exports.production = {
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: false,
};
