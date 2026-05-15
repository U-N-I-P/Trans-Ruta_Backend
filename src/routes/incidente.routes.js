/**
 * @module routes/incidente.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/incidente.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createRules,
  updateRules,
  cambiarEstadoRules,
  finalizarRules,
} = require('../validators/incidente.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.findById);
router.patch('/:id/finalizar', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), finalizarRules, validate, ctrl.finalizar);
router.patch('/:id/estado', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), cambiarEstadoRules, validate, ctrl.cambiarEstado);
router.put('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), updateRules, validate, ctrl.update);
router.post('/:ordenId/reportar', auth, authorize('CONDUCTOR', 'ADMINISTRADOR'), createRules, validate, ctrl.reportar);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
