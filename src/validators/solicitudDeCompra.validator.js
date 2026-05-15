/**
 * @module validators/solicitudDeCompra.validator
 * @description Validaciones para Solicitud de Compra
 */
const { body } = require('express-validator');

const createByRepuestoRules = [
  body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser mayor a 0'),
  body('costoEstimado').optional().isFloat({ gt: 0 }).withMessage('costoEstimado debe ser mayor a 0'),
  body('descripcion').optional().trim().isString(),
  body('conceptoLibre').not().exists().withMessage('Use POST /solicitudes-compra para concepto libre'),
  body('repuestoId').not().exists().withMessage('El repuesto se indica en la URL'),
];

const createLibreRules = [
  body('conceptoLibre').trim().notEmpty().withMessage('conceptoLibre es requerido'),
  body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser mayor a 0'),
  body('costoEstimado').isFloat({ gt: 0 }).withMessage('costoEstimado es requerido y debe ser mayor a 0'),
  body('descripcion').optional().trim().isString(),
  body('fecha').optional().isDate().withMessage('Fecha inválida'),
  body('repuestoId').not().exists().withMessage('Use POST /solicitudes-compra/:repuestoId para compras de inventario'),
];

const updateRules = [
  body('cantidad').optional().isInt({ gt: 0 }),
  body('costoEstimado').optional().isFloat({ gt: 0 }),
  body('estado').optional().isIn(['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA']),
  body('conceptoLibre').optional().trim().notEmpty(),
];

module.exports = {
  createRules: createByRepuestoRules,
  createByRepuestoRules,
  createLibreRules,
  updateRules,
};
