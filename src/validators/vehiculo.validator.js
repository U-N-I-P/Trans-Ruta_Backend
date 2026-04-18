/**
 * @module validators/vehiculo.validator
 * @description Validaciones para Vehículo
 */
const { body } = require('express-validator');

const tipos = ['CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'];
const estados = ['DISPONIBLE', 'EN_RUTA', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'];

const createRules = [
  body('placa')
    .matches(/^[A-Z]{2,3}-\d{3,4}$/)
    .withMessage('La placa debe tener formato colombiano (ABC-123 o AB-1234)'),
  body('tipo').isIn(tipos).withMessage(`El tipo debe ser uno de: ${tipos.join(', ')}`),
  body('capacidadCarga').isFloat({ gt: 0 }).withMessage('La capacidad de carga debe ser mayor a 0'),
  body('estado').isIn(estados).withMessage(`El estado debe ser uno de: ${estados.join(', ')}`),
];

const updateRules = [
  body('placa').optional().matches(/^[A-Z]{2,3}-\d{3,4}$/).withMessage('Formato de placa inválido'),
  body('tipo').optional().isIn(tipos).withMessage(`Tipo inválido`),
  body('capacidadCarga').optional().isFloat({ gt: 0 }).withMessage('La capacidad debe ser mayor a 0'),
  body('estado').optional().isIn(estados).withMessage('Estado inválido'),
];

module.exports = { createRules, updateRules };
