/**
 * @module routes/ordenDeTrabajo.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/ordenDeTrabajo.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/ordenDeTrabajo.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'AUDITOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'JEFE_TALLER', 'AUDITOR'), ctrl.findById);
router.post('/', auth, authorize('JEFE_TALLER'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('JEFE_TALLER'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
