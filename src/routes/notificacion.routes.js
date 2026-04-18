/**
 * @module routes/notificacion.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/notificacion.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules } = require('../validators/notificacion.validator');

const router = Router();

router.get('/', auth, authorize('CLIENTE', 'ADMINISTRADOR'), ctrl.findAll);
router.get('/:id', auth, authorize('CLIENTE', 'ADMINISTRADOR'), ctrl.findById);
router.post('/', auth, authorize('ADMINISTRADOR'), createRules, validate, ctrl.create);
router.patch('/:id/leida', auth, authorize('CLIENTE'), ctrl.marcarLeida);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
