/**
 * @module validators/reporte.validator
 * @description Validaciones para Reporte
 */
const { body } = require('express-validator');

const tipos = ['COMBUSTIBLE', 'RUTAS_RENTABLES', 'CUMPLIMIENTO_ENTREGAS', 'MANTENIMIENTO', 'INVENTARIO'];
const formatos = ['JSON', 'CSV', 'PDF'];

const createRules = [
  body('tipo').isIn(tipos).withMessage(`Tipo debe ser uno de: ${tipos.join(', ')}`),
  body('formato').optional().isIn(formatos).withMessage('Formato inválido'),
];

module.exports = { createRules };
