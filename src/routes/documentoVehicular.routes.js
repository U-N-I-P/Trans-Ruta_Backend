/**
 * @module routes/documentoVehicular.routes
 */
const { Router } = require('express');
const controller = require('../controllers/documentoVehicular.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

// Rutas de lectura
router.get('/alertas', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'DESPACHADOR'), controller.getAlertas); // Endpoint específico primero
router.get('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'DESPACHADOR'), controller.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'DESPACHADOR'), controller.findById);

// Rutas de escritura
router.post('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), controller.create);
router.put('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), controller.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), controller.remove);

module.exports = router;
