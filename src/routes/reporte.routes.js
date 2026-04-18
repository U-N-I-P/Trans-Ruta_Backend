/**
 * @module routes/reporte.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/reporte.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRules } = require('../validators/reporte.validator');

const router = Router();

router.get('/', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.findAll);
router.get('/combustible', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.combustible);
router.get('/rutas-rentables', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.rutasRentables);
router.get('/cumplimiento-entregas', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.cumplimientoEntregas);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.findById);
router.post('/generar', auth, authorize('ADMINISTRADOR', 'DESPACHADOR'), createRules, validate, ctrl.generar);
router.delete('/:id', auth, authorize('ADMINISTRADOR'), ctrl.remove);

module.exports = router;
