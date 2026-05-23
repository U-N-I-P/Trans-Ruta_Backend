/**
 * @module routes/gastoViatico.routes
 */
const { Router } = require('express');
const controller = require('../controllers/gastoViatico.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

// Conductor y admin pueden consultar los gastos de un viático
router.get('/viatico/:viaticoId', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR'), controller.findByViatico);
// Solo el conductor registra el gasto
router.post('/', auth, authorize('ADMINISTRADOR', 'CONDUCTOR'), controller.registrarGasto);
// Solo el administrador aprueba o rechaza
router.patch('/:id/aprobar', auth, authorize('ADMINISTRADOR'), controller.aprobarGasto);
router.patch('/:id/rechazar', auth, authorize('ADMINISTRADOR'), controller.rechazarGasto);

module.exports = router;
