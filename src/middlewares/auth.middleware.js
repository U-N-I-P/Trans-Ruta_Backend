/**
 * @module middlewares/auth
 * @description Verifica el token JWT en el header Authorization
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { error } = require('../utils/response.helper');

/**
 * Middleware de autenticación JWT
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return error(res, 'Token de autenticación no proporcionado', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expirado', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Token inválido', 401);
    }
    return error(res, 'Error de autenticación', 401);
  }
}

module.exports = auth;
