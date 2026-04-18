/**
 * @module routes/solicitudDeCompra.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/solicitudDeCompra.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/solicitudDeCompra.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'GESTOR_INVENTARIO', 'JEFE_TALLER'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'GESTOR_INVENTARIO', 'JEFE_TALLER'), ctrl.findById);
router.post('/:repuestoId', auth, authorize('JEFE_TALLER', 'GESTOR_INVENTARIO'), createRules, validate, ctrl.crearPorRepuesto);
router.put('/:id', auth, authorize('ADMINISTRADOR', 'GESTOR_INVENTARIO'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
