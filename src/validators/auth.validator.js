/**
 * @module validators/auth.validator
 * @description Validaciones para autenticación
 */
const { body } = require('express-validator');

const loginRules = [
  body('correo').isEmail().withMessage('Correo electrónico inválido'),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
];

module.exports = { loginRules };
