/**
 * @module services/usuario.service
 * @description Lógica de negocio para Usuarios
 */
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

/**
 * @param {object} query - req.query
 * @returns {Promise<{ items: Array, pagination: object }>}
 */
async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Usuario.findAndCountAll({
    attributes: { exclude: ['contrasena'] },
    limit,
    offset,
    order: [['id', 'ASC']],
  });
  return paginate(data, page, limit);
}

/**
 * @param {number} id
 * @returns {Promise<object>}
 */
async function findById(id) {
  const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['contrasena'] } });
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return usuario;
}

/**
 * @param {object} data
 * @returns {Promise<object>}
 */
async function create(data) {
  data.contrasena = await bcrypt.hash(data.contrasena, 10);
  const usuario = await Usuario.create(data);
  const { contrasena, ...result } = usuario.toJSON();
  return result;
}

/**
 * @param {number} id
 * @param {object} data
 * @returns {Promise<object>}
 */
async function update(id, data) {
  const usuario = await findById(id);
  if (data.contrasena) {
    data.contrasena = await bcrypt.hash(data.contrasena, 10);
  }
  await usuario.update(data);
  const { contrasena, ...result } = usuario.toJSON();
  return result;
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
async function remove(id) {
  const usuario = await findById(id);
  await usuario.destroy();
}

module.exports = { findAll, findById, create, update, remove };
