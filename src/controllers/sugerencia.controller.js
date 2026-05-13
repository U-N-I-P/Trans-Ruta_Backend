/**
 * @module controllers/sugerencia.controller
 * @description Controlador para gestionar sugerencias de asignación de vehículos y conductores
 */
const service = require('../services/sugerencia.service');
const { success } = require('../utils/response.helper');

/**
 * Obtiene sugerencias de vehículos y conductores para una orden de despacho
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function obtenerSugerencias(req, res, next) {
  try {
    const { pesoCarga, origen, destino, limite } = req.query;

    // Validar parámetros requeridos
    if (!pesoCarga || !origen || !destino) {
      const err = new Error('Parámetros requeridos: pesoCarga, origen, destino');
      err.statusCode = 400;
      throw err;
    }

    // Validar que pesoCarga sea un número positivo
    const peso = parseFloat(pesoCarga);
    if (isNaN(peso) || peso <= 0) {
      const err = new Error('El peso de la carga debe ser un número positivo');
      err.statusCode = 400;
      throw err;
    }

    // Validar límite si se proporciona
    let limiteNumerico = 5; // Valor por defecto
    if (limite) {
      limiteNumerico = parseInt(limite, 10);
      if (isNaN(limiteNumerico) || limiteNumerico < 1 || limiteNumerico > 20) {
        const err = new Error('El límite debe ser un número entre 1 y 20');
        err.statusCode = 400;
        throw err;
      }
    }

    const data = await service.obtenerSugerencias(
      peso,
      origen.trim(),
      destino.trim(),
      limiteNumerico
    );

    if (data.length === 0) {
      return success(
        res,
        'No se encontraron sugerencias disponibles para los criterios especificados',
        data
      );
    }

    return success(res, 'Sugerencias obtenidas exitosamente', data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  obtenerSugerencias,
};
