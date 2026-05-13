/**
 * @module controllers/evaluacion.controller
 * @description Controlador para gestionar evaluaciones de desempeño de conductores
 */
const service = require('../services/evaluacion.service');
const { success } = require('../utils/response.helper');

/**
 * Genera evaluaciones para todos los conductores de un periodo
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function generarEvaluaciones(req, res, next) {
  try {
    const { periodo } = req.body;

    if (!periodo) {
      const err = new Error('Parámetro requerido: periodo (formato YYYY-MM)');
      err.statusCode = 400;
      throw err;
    }

    const data = await service.generarEvaluacionesMensuales(periodo);

    return success(res, 'Evaluaciones generadas exitosamente', data, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Obtiene el ranking de conductores de un periodo
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function obtenerRanking(req, res, next) {
  try {
    const { periodo } = req.query;

    if (!periodo) {
      const err = new Error('Parámetro requerido: periodo (formato YYYY-MM)');
      err.statusCode = 400;
      throw err;
    }

    const data = await service.obtenerRanking(periodo);

    if (data.length === 0) {
      return success(res, 'No hay evaluaciones disponibles para este periodo', data);
    }

    return success(res, 'Ranking obtenido exitosamente', data);
  } catch (err) {
    next(err);
  }
}

/**
 * Obtiene la evaluación de un conductor específico
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function obtenerEvaluacionConductor(req, res, next) {
  try {
    const { conductorId, periodo } = req.params;

    if (!conductorId || !periodo) {
      const err = new Error('Parámetros requeridos: conductorId, periodo');
      err.statusCode = 400;
      throw err;
    }

    const conductorIdNum = parseInt(conductorId, 10);
    if (isNaN(conductorIdNum)) {
      const err = new Error('El conductorId debe ser un número válido');
      err.statusCode = 400;
      throw err;
    }

    const data = await service.obtenerEvaluacionConductor(conductorIdNum, periodo);

    return success(res, 'Evaluación obtenida exitosamente', data);
  } catch (err) {
    next(err);
  }
}

/**
 * Agrega comentarios del administrador a una evaluación
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function agregarComentarios(req, res, next) {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;

    if (!id) {
      const err = new Error('Parámetro requerido: id');
      err.statusCode = 400;
      throw err;
    }

    if (!comentarios || typeof comentarios !== 'string' || comentarios.trim() === '') {
      const err = new Error('El campo comentarios es requerido y debe ser un texto válido');
      err.statusCode = 400;
      throw err;
    }

    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      const err = new Error('El id debe ser un número válido');
      err.statusCode = 400;
      throw err;
    }

    const data = await service.agregarComentarios(idNum, comentarios.trim());

    return success(res, 'Comentarios agregados exitosamente', data);
  } catch (err) {
    next(err);
  }
}

/**
 * Obtiene el historial de evaluaciones de un conductor
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function obtenerHistorial(req, res, next) {
  try {
    const { conductorId } = req.params;
    const { limite } = req.query;

    if (!conductorId) {
      const err = new Error('Parámetro requerido: conductorId');
      err.statusCode = 400;
      throw err;
    }

    const conductorIdNum = parseInt(conductorId, 10);
    if (isNaN(conductorIdNum)) {
      const err = new Error('El conductorId debe ser un número válido');
      err.statusCode = 400;
      throw err;
    }

    let limiteNum = 12;
    if (limite) {
      limiteNum = parseInt(limite, 10);
      if (isNaN(limiteNum) || limiteNum < 1 || limiteNum > 24) {
        const err = new Error('El límite debe ser un número entre 1 y 24');
        err.statusCode = 400;
        throw err;
      }
    }

    const data = await service.obtenerHistorialConductor(conductorIdNum, limiteNum);

    return success(res, 'Historial obtenido exitosamente', data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generarEvaluaciones,
  obtenerRanking,
  obtenerEvaluacionConductor,
  agregarComentarios,
  obtenerHistorial,
};
