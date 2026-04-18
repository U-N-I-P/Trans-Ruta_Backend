/**
 * @module services/incidente.service
 * @description Lógica de negocio para Incidentes
 */
const { Incidente, OrdenDeDespacho, Notificacion, Cliente } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Incidente.findAndCountAll({
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho', attributes: ['id', 'codigo'] }],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const incidente = await Incidente.findByPk(id, {
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho' }],
  });
  if (!incidente) {
    const err = new Error('Incidente no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return incidente;
}

/**
 * Reportar un incidente vinculado a una orden.
 * Si protocoloActivado=true, crea notificación automática.
 * @param {number} ordenId
 * @param {object} data
 * @returns {Promise<object>}
 */
async function reportar(ordenId, data) {
  const orden = await OrdenDeDespacho.findByPk(ordenId, {
    include: [{ model: Cliente, as: 'cliente' }],
  });
  if (!orden) {
    const err = new Error('Orden de despacho no encontrada');
    err.statusCode = 404;
    throw err;
  }

  data.ordenDeDespachoId = ordenId;
  const incidente = await Incidente.create(data);

  // Si se activó protocolo, crear notificación automática
  if (data.protocoloActivado && orden.cliente) {
    await Notificacion.create({
      mensaje: `Incidente reportado en la orden ${orden.codigo}: ${data.tipo} - ${data.descripcion}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'INCIDENTE',
      destinatario: 'ADMINISTRADOR,DESPACHADOR',
      clienteId: orden.clienteId,
    });
  }

  return incidente;
}

async function remove(id) {
  const incidente = await findById(id);
  await incidente.destroy();
}

module.exports = { findAll, findById, reportar, remove };
