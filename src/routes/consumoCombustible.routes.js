/**
 * @module routes/consumoCombustible.routes
 */
const { Router } = require('express');
const controller = require('../controllers/consumoCombustible.controller');

const router = Router();

router.get('/', controller.findAll);
router.get('/vehiculo/:vehiculoId', controller.findByVehiculo);
router.get('/:id', controller.findById);
router.post('/', controller.create);

module.exports = router;
