/**
 * @module routes/conductor.routes
 * @description Rutas CRUD de Conductores
 */
const { Router } = require('express');
const ctrl = require('../controllers/conductor.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/conductor.validator');

const router = Router();

router.get('/licencias-por-vencer', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), ctrl.licenciasPorVencer);
router.get('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), ctrl.findById);
router.post('/', auth, authorize('ADMINISTRADOR'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('ADMINISTRADOR'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
