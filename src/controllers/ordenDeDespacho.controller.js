/**
 * @module controllers/ordenDeDespacho.controller
 */
const service = require('../services/ordenDeDespacho.service');
const { success } = require('../utils/response.helper');
const { buildAuditContext } = require('../utils/audit.util');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Órdenes de despacho obtenidas', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Orden de despacho obtenida', data);
  } catch (err) { next(err); }
}

async function findByConductor(req, res, next) {
  try {
    const data = await service.findByConductor(req.params.id);
    return success(res, 'Órdenes del conductor', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body, buildAuditContext(req));
    return success(res, 'Orden de despacho creada', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body, buildAuditContext(req));
    return success(res, 'Orden de despacho actualizada', data);
  } catch (err) { next(err); }
}

async function cambiarEstado(req, res, next) {
  try {
    const data = await service.cambiarEstado(req.params.id, req.body.estado, buildAuditContext(req));
    return success(res, 'Estado actualizado', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id, buildAuditContext(req));
    return success(res, 'Orden de despacho eliminada');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, findByConductor, create, update, cambiarEstado, remove };
