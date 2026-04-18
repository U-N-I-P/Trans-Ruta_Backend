/**
 * @module validators/solicitudDeCompra.validator
 * @description Validaciones para Solicitud de Compra
 */
const { body } = require('express-validator');

const createRules = [
  body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser mayor a 0'),
  body('repuestoId').isInt().withMessage('repuestoId es requerido'),
];

const updateRules = [
  body('cantidad').optional().isInt({ gt: 0 }),
  body('estado').optional().isIn(['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA']),
];

module.exports = { createRules, updateRules };
