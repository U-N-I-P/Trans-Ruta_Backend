/**
 * @module routes/repuesto.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/repuesto.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/repuesto.validator');

const router = Router();

router.get('/stock-bajo', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'GESTOR_INVENTARIO'), ctrl.stockBajo);
router.get('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'GESTOR_INVENTARIO'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'GESTOR_INVENTARIO'), ctrl.findById);
router.post('/', auth, authorize('GESTOR_INVENTARIO', 'ADMINISTRADOR'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('GESTOR_INVENTARIO', 'ADMINISTRADOR'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
