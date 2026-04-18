/**
 * @module routes/viatico.routes
 * @description Rutas CRUD de Viáticos
 */
const { Router } = require('express');
const ctrl = require('../controllers/viatico.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/viatico.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR'), ctrl.findById);
router.post('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('ADMINISTRADOR'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
