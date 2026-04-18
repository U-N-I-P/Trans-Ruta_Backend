/**
 * @module routes/planDeMantenimiento.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/planDeMantenimiento.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/planDeMantenimiento.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), ctrl.findById);
router.post('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
