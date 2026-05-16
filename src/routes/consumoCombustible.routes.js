/**
 * @module routes/consumoCombustible.routes
 */
const { Router } = require('express');
const controller = require('../controllers/consumoCombustible.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

// Rutas de lectura
router.get('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'DESPACHADOR'), controller.findAll);
router.get('/vehiculo/:vehiculoId', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'DESPACHADOR', 'CONDUCTOR'), controller.findByVehiculo);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'DESPACHADOR', 'CONDUCTOR'), controller.findById);

// Rutas de escritura
router.post('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'CONDUCTOR'), controller.create);

module.exports = router;
