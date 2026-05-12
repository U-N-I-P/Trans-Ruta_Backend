/**
 * @module controllers/gastoViatico.controller
 */
const service = require('../services/gastoViatico.service');
const { success } = require('../utils/response.helper');

async function registrarGasto(req, res, next) {
  try {
    const data = await service.registrarGasto(req.body);
    return success(res, 'Gasto registrado correctamente', data, 201);
  } catch (err) { next(err); }
}

async function aprobarGasto(req, res, next) {
  try {
    const { comentariosAdmin } = req.body;
    const result = await service.aprobarGasto(req.params.id, comentariosAdmin);
    let message = 'Gasto aprobado correctamente';
    if (result.generarAlerta) {
      message += ' (ALERTA: Saldo menor al 10% del monto o negativo)';
    }
    return success(res, message, result);
  } catch (err) { next(err); }
}

async function rechazarGasto(req, res, next) {
  try {
    const { comentariosAdmin } = req.body;
    const data = await service.rechazarGasto(req.params.id, comentariosAdmin);
    return success(res, 'Gasto rechazado', data);
  } catch (err) { next(err); }
}

async function findByViatico(req, res, next) {
  try {
    const data = await service.findByViatico(req.params.viaticoId);
    return success(res, 'Gastos del viático obtenidos', data);
  } catch (err) { next(err); }
}

module.exports = { registrarGasto, aprobarGasto, rechazarGasto, findByViatico };
