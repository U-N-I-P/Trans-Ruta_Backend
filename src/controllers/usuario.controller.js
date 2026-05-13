/**
 * @module controllers/usuario.controller
 * @description Controlador CRUD de Usuarios
 */
const service = require('../services/usuario.service');
const { success } = require('../utils/response.helper');
const { buildAuditContext } = require('../utils/audit.util');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Usuarios obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Usuario obtenido', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body, buildAuditContext(req));
    return success(res, 'Usuario creado', data, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body, buildAuditContext(req));
    return success(res, 'Usuario actualizado', data);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id, buildAuditContext(req));
    return success(res, 'Usuario eliminado');
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, create, update, remove };
