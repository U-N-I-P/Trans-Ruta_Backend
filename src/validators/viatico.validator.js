/**
 * @module validators/viatico.validator
 * @description Validaciones para Viático
 */
const { body } = require('express-validator');

const estados = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'PAGADO'];

const createRules = [
  body('monto').isFloat({ gt: 0 }).withMessage('El monto debe ser mayor a 0'),
  body('fecha').isDate().withMessage('Fecha inválida'),
  body('estado').isIn(estados).withMessage('Estado inválido'),
  body('conductorId').isInt().withMessage('conductorId es requerido'),
];

const updateRules = [
  body('monto').optional().isFloat({ gt: 0 }),
  body('fecha').optional().isDate(),
  body('estado').optional().isIn(estados),
];

module.exports = { createRules, updateRules };
