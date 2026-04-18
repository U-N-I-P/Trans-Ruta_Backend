/**
 * @module validators/conductor.validator
 * @description Validaciones para Conductor
 */
const { body } = require('express-validator');

const createRules = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('cedula').isNumeric().withMessage('La cédula debe ser numérica'),
  body('numeroLicencia').notEmpty().withMessage('El número de licencia es requerido'),
  body('categoriaLicencia').notEmpty().withMessage('La categoría de licencia es requerida'),
  body('fechaVencimientoLicencia')
    .isDate()
    .withMessage('Fecha de vencimiento inválida')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('La fecha de vencimiento debe ser futura');
      }
      return true;
    }),
];

const updateRules = [
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('apellido').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('cedula').optional().isNumeric().withMessage('La cédula debe ser numérica'),
  body('fechaVencimientoLicencia').optional().isDate().withMessage('Fecha inválida'),
];

module.exports = { createRules, updateRules };
