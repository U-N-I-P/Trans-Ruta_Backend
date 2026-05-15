/**
 * @module controllers/incidente.controller
 */
const service = require('../services/incidente.service');
const { success } = require('../utils/response.helper');
const { buildAuditContext } = require('../utils/audit.util');

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

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body, buildAuditContext(req));
    return success(res, 'Incidente actualizado', data);
  } catch (err) { next(err); }
}

async function cambiarEstado(req, res, next) {
  try {
    const data = await service.cambiarEstado(
      req.params.id,
      req.body.estado,
      buildAuditContext(req),
    );
    return success(res, 'Estado del incidente actualizado', data);
  } catch (err) { next(err); }
}

async function finalizar(req, res, next) {
  try {
    const data = await service.finalizar(req.params.id, buildAuditContext(req));
    return success(res, 'Incidente finalizado', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Incidente eliminado');
  } catch (err) { next(err); }
}

module.exports = {
  findAll, findById, reportar, update, cambiarEstado, finalizar, remove,
};
