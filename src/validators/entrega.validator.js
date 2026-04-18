/**
 * @module validators/entrega.validator
 * @description Validaciones para Entrega
 */
const { body } = require('express-validator');

const createRules = [
  body('fechaEntrega').isDate().withMessage('Fecha de entrega inválida'),
];

module.exports = { createRules };
