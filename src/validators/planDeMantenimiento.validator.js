/**
 * @module validators/planDeMantenimiento.validator
 * @description Validaciones para Plan de Mantenimiento
 */
const { body } = require('express-validator');

const tipos = ['CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'];

const createRules = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('tipoVehiculo').isIn(tipos).withMessage('Tipo de vehículo inválido'),
  body('vehiculoId').isInt().withMessage('vehiculoId es requerido'),
];

const updateRules = [
  body('nombre').optional().notEmpty(),
  body('tipoVehiculo').optional().isIn(tipos),
];

module.exports = { createRules, updateRules };
