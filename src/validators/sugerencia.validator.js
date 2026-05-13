/**
 * @module validators/sugerencia.validator
 * @description Validadores para el módulo de sugerencias de asignación
 */
const { query, validationResult } = require('express-validator');

/**
 * Reglas de validación para obtener sugerencias
 */
const obtenerSugerenciasRules = [
  query('pesoCarga')
    .notEmpty()
    .withMessage('El peso de la carga es requerido')
    .isFloat({ min: 0.01 })
    .withMessage('El peso de la carga debe ser un número positivo'),
  
  query('origen')
    .notEmpty()
    .withMessage('El origen es requerido')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El origen debe tener entre 3 y 200 caracteres'),
  
  query('destino')
    .notEmpty()
    .withMessage('El destino es requerido')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El destino debe tener entre 3 y 200 caracteres'),
  
  query('limite')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('El límite debe ser un número entre 1 y 20'),
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
  obtenerSugerenciasRules,
  validate,
};
