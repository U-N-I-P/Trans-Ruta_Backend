/**
 * @module routes/usuario.routes
 * @description Rutas CRUD de Usuarios
 */
const { Router } = require('express');
const ctrl = require('../controllers/usuario.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules } = require('../validators/usuario.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR'), ctrl.findById);
router.post('/', auth, authorize('ADMINISTRADOR'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('ADMINISTRADOR'), updateRules, validate, ctrl.update);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
