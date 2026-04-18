/**
 * @module routes/ordenDeDespacho.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/ordenDeDespacho.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules, updateRules, cambiarEstadoRules } = require('../validators/ordenDeDespacho.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR', 'AUDITOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR', 'AUDITOR'), ctrl.findById);
router.get('/conductor/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR'), ctrl.findByConductor);
router.post('/', auth, authorize('DESPACHADOR', 'ADMINISTRADOR'), createRules, validate, ctrl.create);
router.put('/:id', auth, authorize('DESPACHADOR', 'ADMINISTRADOR'), updateRules, validate, ctrl.update);
router.patch('/:id/estado', auth, authorize('CONDUCTOR', 'DESPACHADOR'), cambiarEstadoRules, validate, ctrl.cambiarEstado);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
