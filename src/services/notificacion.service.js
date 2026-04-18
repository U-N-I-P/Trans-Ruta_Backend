/**
 * @module services/notificacion.service
 * @description Lógica de negocio para Notificaciones
 */
const { Notificacion, Cliente } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Notificacion.findAndCountAll({
    include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] }],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const notif = await Notificacion.findByPk(id, {
    include: [{ model: Cliente, as: 'cliente' }],
  });
  if (!notif) {
    const err = new Error('Notificación no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return notif;
}

async function create(data) {
  data.fecha = data.fecha || new Date().toISOString().split('T')[0];
  return await Notificacion.create(data);
}

/**
 * Marcar una notificación como leída
 * @param {number} id
 * @returns {Promise<object>}
 */
async function marcarLeida(id) {
  const notif = await findById(id);
  await notif.update({ leida: true });
  return notif;
}

async function remove(id) {
  const notif = await findById(id);
  await notif.destroy();
}

module.exports = { findAll, findById, create, marcarLeida, remove };
