/**
 * @module controllers/notificacion.controller
 */
const service = require('../services/notificacion.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Notificaciones obtenidas', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Notificación obtenida', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return success(res, 'Notificación creada', data, 201);
  } catch (err) { next(err); }
}

async function marcarLeida(req, res, next) {
  try {
    const data = await service.marcarLeida(req.params.id);
    return success(res, 'Notificación marcada como leída', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Notificación eliminada');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, create, marcarLeida, remove };
