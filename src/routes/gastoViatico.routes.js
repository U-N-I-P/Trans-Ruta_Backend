/**
 * @module routes/gastoViatico.routes
 */
const { Router } = require('express');
const controller = require('../controllers/gastoViatico.controller');

const router = Router();

router.get('/viatico/:viaticoId', controller.findByViatico);
router.post('/', controller.registrarGasto);
router.patch('/:id/aprobar', controller.aprobarGasto);
router.patch('/:id/rechazar', controller.rechazarGasto);

module.exports = router;
