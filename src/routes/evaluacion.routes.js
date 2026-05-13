/**
 * @module routes/evaluacion.routes
 * @description Rutas para gestionar evaluaciones de desempeño de conductores
 */
const { Router } = require('express');
const controller = require('../controllers/evaluacion.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const { validateConductorOwnership } = require('../middlewares/conductorOwnership.middleware');
const {
  generarEvaluacionesRules,
  obtenerRankingRules,
  obtenerEvaluacionConductorRules,
  obtenerHistorialRules,
  agregarComentariosRules,
  validate,
} = require('../validators/evaluacion.validator');

const router = Router();

/**
 * POST /api/v1/evaluaciones/generar
 * Genera evaluaciones mensuales para todos los conductores
 * Requiere: ADMINISTRADOR
 */
router.post(
  '/generar',
  auth,
  authorize('ADMINISTRADOR'),
  generarEvaluacionesRules,
  validate,
  controller.generarEvaluaciones
);

/**
 * GET /api/v1/evaluaciones/ranking?periodo=YYYY-MM
 * Obtiene el ranking de conductores de un periodo
 * Requiere: ADMINISTRADOR
 */
router.get(
  '/ranking',
  auth,
  authorize('ADMINISTRADOR'),
  obtenerRankingRules,
  validate,
  controller.obtenerRanking
);

/**
 * GET /api/v1/evaluaciones/conductor/:conductorId/:periodo
 * Obtiene la evaluación de un conductor específico
 * Requiere: ADMINISTRADOR o el propio CONDUCTOR
 */
router.get(
  '/conductor/:conductorId/:periodo',
  auth,
  validateConductorOwnership,
  obtenerEvaluacionConductorRules,
  validate,
  controller.obtenerEvaluacionConductor
);

/**
 * GET /api/v1/evaluaciones/conductor/:conductorId/historial
 * Obtiene el historial de evaluaciones de un conductor
 * Requiere: ADMINISTRADOR o el propio CONDUCTOR
 */
router.get(
  '/conductor/:conductorId/historial',
  auth,
  validateConductorOwnership,
  obtenerHistorialRules,
  validate,
  controller.obtenerHistorial
);

/**
 * PATCH /api/v1/evaluaciones/:id/comentarios
 * Agrega comentarios del administrador a una evaluación
 * Requiere: ADMINISTRADOR
 */
router.patch(
  '/:id/comentarios',
  auth,
  authorize('ADMINISTRADOR'),
  agregarComentariosRules,
  validate,
  controller.agregarComentarios
);

module.exports = router;
