/**
 * @module services/solicitudDeCompra.service
 * @description Lógica de negocio para Solicitudes de Compra
 */
const { SolicitudDeCompra, Repuesto } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { registrarAuditoria } = require('./auditoria.service');

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
async function crearPorRepuesto(repuestoId, data, auditCtx) {
  const repuesto = await Repuesto.findByPk(repuestoId);
  if (!repuesto) {
    const err = new Error('Repuesto no encontrado');
    err.statusCode = 404;
    throw err;
  }
  data.repuestoId = repuestoId;
  data.fecha = data.fecha || new Date().toISOString().split('T')[0];
  const sol = await SolicitudDeCompra.create(data);
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'CREATE',
      entidad: 'SolicitudDeCompra',
      entidadId: sol.id,
      datosAnteriores: null,
      datosNuevos: sol.get({ plain: true }),
    });
  }
  return sol;
}

async function update(id, data, auditCtx) {
  const sol = await findById(id);
  const antes = sol.get({ plain: true });
  await sol.update(data);
  await sol.reload();
  const despues = sol.get({ plain: true });

  if (auditCtx) {
    let accion = 'UPDATE';
    if (despues.estado === 'APROBADA' && antes.estado !== 'APROBADA') accion = 'APPROVE';
    else if (despues.estado === 'RECHAZADA' && antes.estado !== 'RECHAZADA') accion = 'REJECT';

    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion,
      entidad: 'SolicitudDeCompra',
      entidadId: sol.id,
      datosAnteriores: accion === 'UPDATE' ? antes : null,
      datosNuevos: { ...despues, estadoAnterior: antes.estado },
    });
  }

  return sol;
}

async function remove(id, auditCtx) {
  const sol = await findById(id);
  const snapshot = sol.get({ plain: true });
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'DELETE',
      entidad: 'SolicitudDeCompra',
      entidadId: sol.id,
      datosAnteriores: null,
      datosNuevos: snapshot,
    });
  }
  await sol.destroy();
}

module.exports = { findAll, findById, crearPorRepuesto, update, remove };
