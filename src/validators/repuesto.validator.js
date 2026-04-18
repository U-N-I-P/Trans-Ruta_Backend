/**
 * @module validators/repuesto.validator
 * @description Validaciones para Repuesto
 */
const { body } = require('express-validator');

const createRules = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('stockMinimo').isInt({ min: 0 }).withMessage('stockMinimo debe ser >= 0'),
  body('unidadMedida').notEmpty().withMessage('La unidad de medida es requerida'),
  body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
];

const updateRules = [
  body('nombre').optional().notEmpty(),
  body('stockMinimo').optional().isInt({ min: 0 }),
  body('precio').optional().isFloat({ gt: 0 }),
];

module.exports = { createRules, updateRules };
