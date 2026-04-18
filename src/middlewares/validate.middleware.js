/**
 * @module middlewares/validate
 * @description Procesa errores de express-validator
 */
const { validationResult } = require('express-validator');
const { error } = require('../utils/response.helper');

/**
 * Middleware que verifica el resultado de las validaciones de express-validator
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return error(res, 'Errores de validación', 400, extractedErrors);
  }
  next();
}

module.exports = validate;
