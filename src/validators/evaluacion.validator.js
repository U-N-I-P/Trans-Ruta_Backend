/**
 * @module validators/evaluacion.validator
 * @description Validadores para el módulo de evaluaciones de conductores
 */
const { body, query, param, validationResult } = require('express-validator');

/**
 * Reglas de validación para generar evaluaciones
 */
const generarEvaluacionesRules = [
  body('periodo')
    .notEmpty()
    .withMessage('El periodo es requerido')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('El periodo debe tener el formato YYYY-MM (ej: 2026-05)')
    .custom((value) => {
      const [year, month] = value.split('-').map(Number);
      if (year < 2020 || year > 2100) {
        throw new Error('El año debe estar entre 2020 y 2100');
      }
      if (month < 1 || month > 12) {
        throw new Error('El mes debe estar entre 01 y 12');
      }
      return true;
    }),
];

/**
 * Reglas de validación para obtener ranking
 */
const obtenerRankingRules = [
  query('periodo')
    .notEmpty()
    .withMessage('El periodo es requerido')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('El periodo debe tener el formato YYYY-MM (ej: 2026-05)'),
];

/**
 * Reglas de validación para obtener evaluación de conductor
 */
const obtenerEvaluacionConductorRules = [
  param('conductorId')
    .notEmpty()
    .withMessage('El ID del conductor es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del conductor debe ser un número entero positivo'),
  
  param('periodo')
    .notEmpty()
    .withMessage('El periodo es requerido')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('El periodo debe tener el formato YYYY-MM (ej: 2026-05)'),
];

/**
 * Reglas de validación para obtener historial
 */
const obtenerHistorialRules = [
  param('conductorId')
    .notEmpty()
    .withMessage('El ID del conductor es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID del conductor debe ser un número entero positivo'),
  
  query('limite')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('El límite debe ser un número entre 1 y 24'),
];

/**
 * Reglas de validación para agregar comentarios
 */
const agregarComentariosRules = [
  param('id')
    .notEmpty()
    .withMessage('El ID de la evaluación es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID de la evaluación debe ser un número entero positivo'),
  
  body('comentarios')
    .notEmpty()
    .withMessage('Los comentarios son requeridos')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Los comentarios deben tener entre 10 y 2000 caracteres'),
];

/**
 * Middleware para validar los resultados
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array(),
    });
  }
  next();
}

module.exports = {
  generarEvaluacionesRules,
  obtenerRankingRules,
  obtenerEvaluacionConductorRules,
  obtenerHistorialRules,
  agregarComentariosRules,
  validate,
};
