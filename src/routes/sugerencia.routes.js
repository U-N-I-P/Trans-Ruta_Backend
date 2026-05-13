/**
 * @module routes/sugerencia.routes
 * @description Rutas para gestionar sugerencias de asignación de vehículos y conductores
 */
const { Router } = require('express');
const controller = require('../controllers/sugerencia.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

/**
 * GET /api/v1/sugerencias
 * Obtiene sugerencias de vehículos y conductores para una orden de despacho
 * Query params: pesoCarga, origen, destino, limite (opcional)
 * Roles permitidos: ADMINISTRADOR, DESPACHADOR
 */
router.get(
  '/',
  authenticate,
  authorize(['ADMINISTRADOR', 'DESPACHADOR']),
  controller.obtenerSugerencias
);

module.exports = router;
