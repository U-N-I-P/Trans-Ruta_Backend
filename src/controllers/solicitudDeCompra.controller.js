/**
 * @module controllers/solicitudDeCompra.controller
 */
const service = require('../services/solicitudDeCompra.service');
const { success } = require('../utils/response.helper');
const { buildAuditContext } = require('../utils/audit.util');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Solicitudes de compra obtenidas', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Solicitud de compra obtenida', data);
  } catch (err) { next(err); }
}

async function crearLibre(req, res, next) {
  try {
    const data = await service.crearLibre(req.body, buildAuditContext(req));
    return success(res, 'Solicitud de compra creada', data, 201);
  } catch (err) { next(err); }
}

async function crearPorRepuesto(req, res, next) {
  try {
    const data = await service.crearPorRepuesto(req.params.repuestoId, req.body, buildAuditContext(req));
    return success(res, 'Solicitud de compra creada', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body, buildAuditContext(req));
    return success(res, 'Solicitud de compra actualizada', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id, buildAuditContext(req));
    return success(res, 'Solicitud de compra eliminada');
  } catch (err) { next(err); }
}

async function aprobar(req, res, next) {
  try {
    const { comentarios } = req.body;
    const data = await service.aprobar(req.params.id, req.user.id, comentarios, buildAuditContext(req));
    return success(res, 'Solicitud aprobada', data);
  } catch (err) { next(err); }
}

async function rechazar(req, res, next) {
  try {
    const { comentarios } = req.body;
    const data = await service.rechazar(req.params.id, req.user.id, comentarios, buildAuditContext(req));
    return success(res, 'Solicitud rechazada', data);
  } catch (err) { next(err); }
}

async function registrarRecepcion(req, res, next) {
  try {
    const data = await service.registrarRecepcion(req.params.id, buildAuditContext(req));
    return success(res, 'Recepción registrada, inventario actualizado', data);
  } catch (err) { next(err); }
}

async function findPendientes(req, res, next) {
  try {
    const data = await service.findPendientes();
    return success(res, 'Solicitudes pendientes obtenidas', data);
  } catch (err) { next(err); }
}

module.exports = {
  findAll,
  findById,
  crearLibre,
  crearPorRepuesto,
  update,
  remove,
  aprobar,
  rechazar,
  registrarRecepcion,
  findPendientes,
};
