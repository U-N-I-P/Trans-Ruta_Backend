/**
 * @module utils/response.helper
 * @description Formateador de respuestas estándar de la API
 */

/**
 * Envía una respuesta exitosa
 * @param {import('express').Response} res
 * @param {string} message
 * @param {*} data
 * @param {number} statusCode
 * @param {object} [pagination]
 */
function success(res, message = 'Operación exitosa', data = null, statusCode = 200, pagination = null) {
  const response = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
}

/**
 * Envía una respuesta de error
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {Array} [errors]
 */
function error(res, message = 'Error interno del servidor', statusCode = 500, errors = null) {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

module.exports = { success, error };
