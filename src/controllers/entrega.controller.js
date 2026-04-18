/**
 * @module controllers/entrega.controller
 */
const service = require('../services/entrega.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Entregas obtenidas', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Entrega obtenida', data);
  } catch (err) { next(err); }
}

async function registrar(req, res, next) {
  try {
    const data = await service.registrar(req.params.ordenId, req.body);
    return success(res, 'Entrega registrada', data, 201);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Entrega eliminada');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, registrar, remove };
