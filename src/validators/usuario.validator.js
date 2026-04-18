/**
 * @module validators/usuario.validator
 * @description Validaciones para Usuario
 */
const { body } = require('express-validator');

const roles = ['ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR', 'CLIENTE', 'JEFE_TALLER', 'GESTOR_INVENTARIO', 'AUDITOR'];

const createRules = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('correo').isEmail().withMessage('Correo electrónico inválido'),
  body('contrasena').isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
  body('rol').isIn(roles).withMessage(`El rol debe ser uno de: ${roles.join(', ')}`),
];

const updateRules = [
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('correo').optional().isEmail().withMessage('Correo electrónico inválido'),
  body('contrasena').optional().isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
  body('rol').optional().isIn(roles).withMessage(`El rol debe ser uno de: ${roles.join(', ')}`),
];

module.exports = { createRules, updateRules };
