/**
 * @module validators/ordenDeTrabajo.validator
 * @description Validaciones para Orden de Trabajo
 */
const { body } = require('express-validator');

const estados = ['ABIERTA', 'EN_PROCESO', 'CERRADA', 'CANCELADA'];

const createRules = [
  body('descripcion').notEmpty().withMessage('La descripción es requerida'),
  body('fechaApertura').isDate().withMessage('Fecha de apertura inválida'),
];

const updateRules = [
  body('estado').optional().isIn(estados),
  body('descripcion').optional().notEmpty(),
];

module.exports = { createRules, updateRules };
