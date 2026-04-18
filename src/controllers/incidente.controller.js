/**
 * @module controllers/incidente.controller
 */
const service = require('../services/incidente.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Incidentes obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Incidente obtenido', data);
  } catch (err) { next(err); }
}

async function reportar(req, res, next) {
  try {
    const data = await service.reportar(req.params.ordenId, req.body);
    return success(res, 'Incidente reportado', data, 201);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Incidente eliminado');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, reportar, remove };
