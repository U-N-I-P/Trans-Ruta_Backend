/**
 * @module services/solicitudDeCompra.service
 * @description Lógica de negocio para Solicitudes de Compra
 */
const { SolicitudDeCompra, Repuesto } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await SolicitudDeCompra.findAndCountAll({
    include: [{ model: Repuesto, as: 'repuesto', attributes: ['id', 'nombre', 'referencia'] }],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const sol = await SolicitudDeCompra.findByPk(id, {
    include: [{ model: Repuesto, as: 'repuesto' }],
  });
  if (!sol) {
    const err = new Error('Solicitud de compra no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return sol;
}

/**
 * Crear solicitud de compra vinculada a un repuesto
 * @param {number} repuestoId
 * @param {object} data
 * @returns {Promise<object>}
 */
async function crearPorRepuesto(repuestoId, data) {
  const repuesto = await Repuesto.findByPk(repuestoId);
  if (!repuesto) {
    const err = new Error('Repuesto no encontrado');
    err.statusCode = 404;
    throw err;
  }
  data.repuestoId = repuestoId;
  data.fecha = data.fecha || new Date().toISOString().split('T')[0];
  return await SolicitudDeCompra.create(data);
}

async function update(id, data) {
  const sol = await findById(id);
  await sol.update(data);
  return sol;
}

async function remove(id) {
  const sol = await findById(id);
  await sol.destroy();
}

module.exports = { findAll, findById, crearPorRepuesto, update, remove };
