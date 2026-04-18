/**
 * @module services/entrega.service
 * @description Lógica de negocio para Entregas
 */
const { Entrega, OrdenDeDespacho } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Entrega.findAndCountAll({
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho', attributes: ['id', 'codigo', 'estado'] }],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const entrega = await Entrega.findByPk(id, {
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho' }],
  });
  if (!entrega) {
    const err = new Error('Entrega no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return entrega;
}

/**
 * Registrar entrega con firma y foto vinculada a una orden
 * @param {number} ordenId
 * @param {object} data
 * @returns {Promise<object>}
 */
async function registrar(ordenId, data) {
  const orden = await OrdenDeDespacho.findByPk(ordenId);
  if (!orden) {
    const err = new Error('Orden de despacho no encontrada');
    err.statusCode = 404;
    throw err;
  }

  // Verificar que no exista ya una entrega
  const existente = await Entrega.findOne({ where: { ordenDeDespachoId: ordenId } });
  if (existente) {
    const err = new Error('Ya existe una entrega registrada para esta orden');
    err.statusCode = 409;
    throw err;
  }

  data.ordenDeDespachoId = ordenId;
  const entrega = await Entrega.create(data);
  return entrega;
}

async function remove(id) {
  const entrega = await findById(id);
  await entrega.destroy();
}

module.exports = { findAll, findById, registrar, remove };
