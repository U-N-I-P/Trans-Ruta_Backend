/**
 * @module validators/cliente.validator
 * @description Validaciones para Cliente
 */
const { body } = require('express-validator');

const tiposDoc = ['CC', 'NIT', 'CE', 'PASAPORTE'];

const createRules = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('correo').isEmail().withMessage('Correo electrónico inválido'),
  body('tipoDocumento').isIn(tiposDoc).withMessage(`Tipo de documento inválido`),
  body('numeroDocumento').notEmpty().withMessage('El número de documento es requerido'),
];

const updateRules = [
  body('nombre').optional().notEmpty(),
  body('correo').optional().isEmail().withMessage('Correo inválido'),
  body('tipoDocumento').optional().isIn(tiposDoc),
];

module.exports = { createRules, updateRules };
