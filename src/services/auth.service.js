/**
 * @module services/auth.service
 * @description Lógica de negocio para autenticación
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const env = require('../config/env');

/**
 * Autentica un usuario y retorna un JWT
 * @param {string} correo
 * @param {string} contrasena
 * @returns {Promise<{ token: string, usuario: object }>}
 */
async function login(correo, contrasena) {
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) {
    const err = new Error('Credenciales inválidas');
    err.statusCode = 401;
    throw err;
  }
  if (!usuario.activo) {
    const err = new Error('Usuario desactivado');
    err.statusCode = 403;
    throw err;
  }

  const valid = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!valid) {
    const err = new Error('Credenciales inválidas');
    err.statusCode = 401;
    throw err;
  }

  const payload = { id: usuario.id, correo: usuario.correo, rol: usuario.rol };
  const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
  };
}

/**
 * Refresca un token JWT válido
 * @param {object} user - Datos del usuario del token actual
 * @returns {{ token: string }}
 */
function refresh(user) {
  const payload = { id: user.id, correo: user.correo, rol: user.rol };
  const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  return { token };
}

/**
 * Obtiene datos del usuario autenticado
 * @param {number} userId
 * @returns {Promise<object>}
 */
async function me(userId) {
  const usuario = await Usuario.findByPk(userId, {
    attributes: { exclude: ['contrasena'] },
  });
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return usuario;
}

module.exports = { login, refresh, me };
