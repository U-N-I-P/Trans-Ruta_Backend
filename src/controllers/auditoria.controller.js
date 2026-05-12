/**
 * @module controllers/auditoria.controller
 * @description Consulta y exportación de auditoría (HU-18)
 */
const auditoriaService = require('../services/auditoria.service');
const { success } = require('../utils/response.helper');

async function findAll(req, res, next) {
  try {
    const { items, pagination } = await auditoriaService.findAll(req.query);
    return success(res, 'Registros de auditoría obtenidos', items, 200, pagination);
  } catch (err) {
    next(err);
  }
}

async function findById(req, res, next) {
  try {
    const data = await auditoriaService.findById(req.params.id);
    return success(res, 'Registro de auditoría obtenido', data);
  } catch (err) {
    next(err);
  }
}

async function exportar(req, res, next) {
  try {
    const formato = (req.query.formato || 'csv').toLowerCase();
    if (formato !== 'csv' && formato !== 'pdf') {
      const err = new Error('Parámetro formato inválido (use csv o pdf)');
      err.statusCode = 400;
      throw err;
    }
    const { body, contentType, filename } = await auditoriaService.exportar(req.query, formato);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(body);
  } catch (err) {
    next(err);
  }
}

module.exports = { findAll, findById, exportar };
