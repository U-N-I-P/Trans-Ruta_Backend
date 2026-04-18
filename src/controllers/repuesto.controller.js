/**
 * @module controllers/repuesto.controller
 */
const service = require('../services/repuesto.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Repuestos obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Repuesto obtenido', data);
  } catch (err) { next(err); }
}

async function stockBajo(req, res, next) {
  try {
    const data = await service.stockBajo();
    return success(res, 'Repuestos con stock bajo', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return success(res, 'Repuesto creado', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    return success(res, 'Repuesto actualizado', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Repuesto eliminado');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, stockBajo, create, update, remove };
