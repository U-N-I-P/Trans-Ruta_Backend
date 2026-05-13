/**
 * @module services/usuario.service
 * @description Lógica de negocio para Usuarios
 */
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { registrarAuditoria } = require('./auditoria.service');

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
async function create(data, auditCtx) {
  data.contrasena = await bcrypt.hash(data.contrasena, 10);
  const usuario = await Usuario.create(data);
  const { contrasena, ...result } = usuario.toJSON();
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'CREATE',
      entidad: 'Usuario',
      entidadId: usuario.id,
      datosAnteriores: null,
      datosNuevos: result,
    });
  }
  return result;
}

/**
 * @param {number} id
 * @param {object} data
 * @returns {Promise<object>}
 */
async function update(id, data, auditCtx) {
  const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['contrasena'] } });
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  const antes = usuario.get({ plain: true });
  if (data.contrasena) {
    data.contrasena = await bcrypt.hash(data.contrasena, 10);
  }
  await usuario.update(data);
  const refreshed = await Usuario.findByPk(id, { attributes: { exclude: ['contrasena'] } });
  const result = refreshed.get({ plain: true });
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'UPDATE',
      entidad: 'Usuario',
      entidadId: id,
      datosAnteriores: antes,
      datosNuevos: result,
    });
  }
  return result;
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
async function remove(id, auditCtx) {
  const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['contrasena'] } });
  if (!usuario) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  const snapshot = usuario.get({ plain: true });
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'DELETE',
      entidad: 'Usuario',
      entidadId: id,
      datosAnteriores: null,
      datosNuevos: snapshot,
    });
  }
  await usuario.destroy();
}

module.exports = { findAll, findById, create, update, remove };
