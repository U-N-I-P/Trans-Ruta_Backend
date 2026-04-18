/**
 * @module validators/notificacion.validator
 * @description Validaciones para Notificación
 */
const { body } = require('express-validator');

const tipos = ['ESTADO_ENVIO', 'INCIDENTE', 'STOCK_BAJO', 'MANTENIMIENTO', 'SISTEMA'];

const createRules = [
  body('mensaje').notEmpty().withMessage('El mensaje es requerido'),
  body('tipo').isIn(tipos).withMessage('Tipo de notificación inválido'),
  body('destinatario').notEmpty().withMessage('El destinatario es requerido'),
  body('clienteId').isInt().withMessage('clienteId es requerido'),
];

module.exports = { createRules };
