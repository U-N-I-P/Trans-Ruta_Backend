/**
 * @module controllers/reporte.controller
 */
const service = require('../services/reporte.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Reportes obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Reporte obtenido', data);
  } catch (err) { next(err); }
}

async function generar(req, res, next) {
  try {
    req.body.usuarioId = req.user.id;
    const data = await service.generar(req.body);
    return success(res, 'Reporte generado', data, 201);
  } catch (err) { next(err); }
}

async function combustible(req, res, next) {
  try {
    const data = await service.reporteCombustible(req.query);
    return success(res, 'Reporte de combustible', data);
  } catch (err) { next(err); }
}

async function rutasRentables(req, res, next) {
  try {
    const data = await service.reporteRutasRentables();
    return success(res, 'Rutas más rentables', data);
  } catch (err) { next(err); }
}

async function cumplimientoEntregas(req, res, next) {
  try {
    const data = await service.reporteCumplimiento();
    return success(res, 'Cumplimiento de entregas', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Reporte eliminado');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, generar, combustible, rutasRentables, cumplimientoEntregas, remove };
