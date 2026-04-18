/**
 * @module controllers/conductor.controller
 * @description Controlador CRUD de Conductores
 */
const service = require('../services/conductor.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Conductores obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Conductor obtenido', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return success(res, 'Conductor creado', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    return success(res, 'Conductor actualizado', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Conductor eliminado');
  } catch (err) { next(err); }
}

async function licenciasPorVencer(req, res, next) {
  try {
    const data = await service.licenciasPorVencer();
    return success(res, 'Licencias próximas a vencer', data);
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, create, update, remove, licenciasPorVencer };
