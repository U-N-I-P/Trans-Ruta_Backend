/**
 * @module config/env
 * @description Carga y validación de variables de entorno
 */
require('dotenv').config();

const requiredVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET'
];

/**
 * Valida que las variables de entorno requeridas estén definidas
 * @throws {Error} Si falta alguna variable requerida
 */
function validateEnv() {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
  }
}

validateEnv();

function parseCorsOrigins(value) {
  if (value === '*') return true; // Refleja el origen exacto permitiendo credentials
  const fallback = 'http://localhost:5173,http://localhost:5174';
  return (value || fallback)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
};
