/**
 * @module validators/incidente.validator
 * @description Validaciones para Incidente
 */
const { body } = require('express-validator');

const estados = ['ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

const tipos = [
  'ACCIDENTE',
  'AVERIA',
  'RETRASO',
  'FALLA_MECANICA',
  'CHOQUE',
  'ROBO',
  'CLIMATICO',
  'OTRO',
];

const rechazarEstadoEnBody = body('estado')
  .not()
  .exists()
  .withMessage('El estado se gestiona con PATCH /:id/estado o PATCH /:id/finalizar');

const createRules = [
  body('tipo')
    .trim()
    .notEmpty()
    .withMessage('El tipo de incidente es requerido')
    .isIn(tipos)
    .withMessage(`tipo debe ser uno de: ${tipos.join(', ')}`),
  body('descripcion').trim().notEmpty().withMessage('La descripción es requerida'),
  body('fecha').isDate().withMessage('Fecha inválida'),
  body('latitud').optional({ values: 'null' }).isFloat().withMessage('Latitud inválida'),
  body('longitud').optional({ values: 'null' }).isFloat().withMessage('Longitud inválida'),
  body('protocoloActivado').optional().isBoolean().withMessage('protocoloActivado debe ser booleano'),
  rechazarEstadoEnBody,
];

const updateRules = [
  body('tipo')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El tipo de incidente no puede estar vacío')
    .isIn(tipos)
    .withMessage(`tipo debe ser uno de: ${tipos.join(', ')}`),
  body('descripcion').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía'),
  body('fecha').optional().isDate().withMessage('Fecha inválida'),
  body('latitud').optional({ values: 'null' }).isFloat().withMessage('Latitud inválida'),
  body('longitud').optional({ values: 'null' }).isFloat().withMessage('Longitud inválida'),
  body('protocoloActivado').optional().isBoolean().withMessage('protocoloActivado debe ser booleano'),
  rechazarEstadoEnBody,
];

const cambiarEstadoRules = [
  body('estado')
    .isIn(estados)
    .withMessage(`Estado debe ser uno de: ${estados.join(', ')}`),
];

const finalizarRules = [
  body('estado').not().exists().withMessage('Use PATCH /:id/estado para cambiar a otro estado'),
];

module.exports = {
  createRules,
  updateRules,
  cambiarEstadoRules,
  finalizarRules,
  estados,
  tipos,
};
