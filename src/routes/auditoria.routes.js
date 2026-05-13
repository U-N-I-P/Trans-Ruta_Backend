/**
 * @module routes/auditoria.routes
 * @description Rutas de consulta de auditoría (solo ADMINISTRADOR y AUDITOR)
 */
const { Router } = require('express');
const ctrl = require('../controllers/auditoria.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

router.get('/exportar', auth, authorize('ADMINISTRADOR', 'AUDITOR'), ctrl.exportar);
router.get('/', auth, authorize('ADMINISTRADOR', 'AUDITOR'), ctrl.findAll);
router.get('/:id', auth, authorize('ADMINISTRADOR', 'AUDITOR'), ctrl.findById);

module.exports = router;
