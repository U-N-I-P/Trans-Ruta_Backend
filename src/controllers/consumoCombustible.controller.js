/**
 * @module controllers/consumoCombustible.controller
 */
const service = require('../services/consumoCombustible.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await service.findAll(req.query);
    return success(res, 'Registros de consumo obtenidos', items, 200, pagination);
  } catch (err) { next(err); }
}

async function findById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    return success(res, 'Registro de consumo obtenido', data);
  } catch (err) { next(err); }
}

async function findByVehiculo(req, res, next) {
  try {
    const data = await service.findByVehiculo(req.params.vehiculoId);
    return success(res, 'Registros de consumo del vehículo obtenidos', data);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { consumo, generarAlerta } = await service.create(req.body);
    let message = 'Registro de consumo creado';
    if (generarAlerta) {
      message += ' (ALERTA: Rendimiento 20% por debajo del promedio)';
    }
    return success(res, message, consumo, 201);
  } catch (err) { next(err); }
}

module.exports = { findAll, findById, findByVehiculo, create };
