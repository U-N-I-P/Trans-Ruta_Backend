/**
 * @module middlewares/error
 * @description Manejador global de errores
 */
const { error } = require('../utils/response.helper');

/**
 * Middleware manejador global de errores
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
function errorHandler(err, req, res, _next) {
  console.error('❌ Error:', err);

  // Errores de Sequelize — Validación
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return error(res, 'Error de validación en la base de datos', 400, errors);
  }

  // Errores de Sequelize — Unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: `${e.path} ya existe` }));
    return error(res, 'Registro duplicado', 409, errors);
  }

  // Errores de Sequelize — FK constraint
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, 'Referencia a registro inexistente', 400);
  }

  // Errores JWT
  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token expirado', 401);
  }
  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Token inválido', 401);
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  return error(res, message, statusCode);
}

module.exports = errorHandler;
