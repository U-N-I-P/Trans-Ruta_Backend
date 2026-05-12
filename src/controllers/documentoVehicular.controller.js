/**
 * @module controllers/documentoVehicular.controller
 */
const service = require('../services/documentoVehicular.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Documentos vehiculares obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Documento vehicular obtenido', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return success(res, 'Documento vehicular creado', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    return success(res, 'Documento vehicular actualizado', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    return success(res, 'Documento vehicular eliminado');
  } catch (err) { next(err); }
}

async function getAlertas(req, res, next) {
  try {
    const data = await service.obtenerAlertasVencimiento();
    return success(res, 'Alertas de vencimiento obtenidas', data);
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, create, update, remove, getAlertas };
