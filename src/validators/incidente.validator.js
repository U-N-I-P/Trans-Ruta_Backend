/**
 * @module validators/incidente.validator
 * @description Validaciones para Incidente
 */
const { body } = require('express-validator');

const createRules = [
  body('tipo').notEmpty().withMessage('El tipo de incidente es requerido'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida'),
  body('fecha').isDate().withMessage('Fecha inválida'),
];

module.exports = { createRules };
