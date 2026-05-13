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

    // Las validaciones ya se hicieron en el validator
    const peso = parseFloat(pesoCarga);
    const limiteNumerico = limite ? parseInt(limite, 10) : 5;

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
