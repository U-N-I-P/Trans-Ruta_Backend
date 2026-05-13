/**
 * @module routes/evaluacion.routes
 * @description Rutas para gestionar evaluaciones de desempeño de conductores
 */
const { Router } = require('express');
const controller = require('../controllers/evaluacion.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

/**
 * POST /api/v1/evaluaciones/generar
 * Genera evaluaciones mensuales para todos los conductores
 * Requiere: ADMINISTRADOR
 */
router.post(
  '/generar',
  authenticate,
  authorize(['ADMINISTRADOR']),
  controller.generarEvaluaciones
);

/**
 * GET /api/v1/evaluaciones/ranking?periodo=YYYY-MM
 * Obtiene el ranking de conductores de un periodo
 * Requiere: ADMINISTRADOR
 */
router.get(
  '/ranking',
  authenticate,
  authorize(['ADMINISTRADOR']),
  controller.obtenerRanking
);

/**
 * GET /api/v1/evaluaciones/conductor/:conductorId/:periodo
 * Obtiene la evaluación de un conductor específico
 * Requiere: ADMINISTRADOR o el propio CONDUCTOR
 */
router.get(
  '/conductor/:conductorId/:periodo',
  authenticate,
  controller.obtenerEvaluacionConductor
);

/**
 * GET /api/v1/evaluaciones/conductor/:conductorId/historial
 * Obtiene el historial de evaluaciones de un conductor
 * Requiere: ADMINISTRADOR o el propio CONDUCTOR
 */
router.get(
  '/conductor/:conductorId/historial',
  authenticate,
  controller.obtenerHistorial
);

/**
 * PATCH /api/v1/evaluaciones/:id/comentarios
 * Agrega comentarios del administrador a una evaluación
 * Requiere: ADMINISTRADOR
 */
router.patch(
  '/:id/comentarios',
  authenticate,
  authorize(['ADMINISTRADOR']),
  controller.agregarComentarios
);

module.exports = router;
