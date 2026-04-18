/**
 * @module routes/entrega.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/entrega.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules } = require('../validators/entrega.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CLIENTE', 'AUDITOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CLIENTE', 'AUDITOR'), ctrl.findById);
router.post('/:ordenId/registrar', auth, authorize('CONDUCTOR'), createRules, validate, ctrl.registrar);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
