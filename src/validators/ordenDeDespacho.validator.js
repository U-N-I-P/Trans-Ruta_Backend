/**
 * @module validators/ordenDeDespacho.validator
 * @description Validaciones para Orden de Despacho
 */
const { body } = require('express-validator');

const estados = ['DESPACHADO', 'EN_RUTA', 'CERCA_DEL_DESTINO', 'ENTREGADO', 'CANCELADO'];

const createRules = [
  body('origen').notEmpty().withMessage('El origen es requerido'),
  body('destino').notEmpty().withMessage('El destino es requerido'),
  body('pesoCarga').isFloat({ gt: 0 }).withMessage('El peso de carga debe ser mayor a 0'),
  body('conductorId').isInt().withMessage('conductorId es requerido'),
  body('vehiculoId').isInt().withMessage('vehiculoId es requerido'),
  body('clienteId').isInt().withMessage('clienteId es requerido'),
  body('fechaEntregaEstimada').optional().isDate().withMessage('Fecha de entrega estimada inválida'),
  body('fechaSalida').optional().isDate().withMessage('Fecha de salida inválida'),
];

const updateRules = [
  body('origen').optional().notEmpty(),
  body('destino').optional().notEmpty(),
  body('pesoCarga').optional().isFloat({ gt: 0 }),
];

const cambiarEstadoRules = [
  body('estado').isIn(estados).withMessage(`Estado debe ser uno de: ${estados.join(', ')}`),
];

module.exports = { createRules, updateRules, cambiarEstadoRules };
