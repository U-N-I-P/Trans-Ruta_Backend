/**
 * @module controllers/solicitudDeCompra.controller
 */
const service = require('../services/solicitudDeCompra.service');
const { success } = require('../utils/response.helper');

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

async function crearPorRepuesto(req, res, next) {
  try {
    const data = await service.crearPorRepuesto(req.params.repuestoId, req.body);
    return success(res, 'Solicitud de compra creada', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    return success(res, 'Solicitud de compra actualizada', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Solicitud de compra eliminada');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, crearPorRepuesto, update, remove };
