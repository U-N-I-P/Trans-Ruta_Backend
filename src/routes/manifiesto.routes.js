/**
 * @module routes/manifiesto.routes
 */
const { Router } = require('express');
const ctrl = require('../controllers/manifiesto.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

router.get('/:ordenId', auth, authorize('ADMINISTRADOR', 'DESPACHADOR', 'AUDITOR'), ctrl.generarManifiesto);

module.exports = router;
