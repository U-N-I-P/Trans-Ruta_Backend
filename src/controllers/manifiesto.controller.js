/**
 * @module controllers/manifiesto.controller
 */
const service = require('../services/manifiesto.service');
const { success } = require('../utils/response.helper');

async function generarManifiesto(req, res, next) {
  try {
    const data = await service.generarManifiesto(req.params.ordenId);
    return success(res, 'Manifiesto generado', data);
  } catch (err) { next(err); }
}

module.exports = { generarManifiesto };
