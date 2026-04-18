/**
 * @module controllers/ordenDeTrabajo.controller
 */
const service = require('../services/ordenDeTrabajo.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Órdenes de trabajo obtenidas', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Orden de trabajo obtenida', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return success(res, 'Orden de trabajo creada', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    return success(res, 'Orden de trabajo actualizada', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Orden de trabajo eliminada');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, create, update, remove };
