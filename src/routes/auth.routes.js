/**
 * @module routes/auth.routes
 * @description Rutas de autenticación
 */
const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { loginRules } = require('../validators/auth.validator');

const router = Router();

router.post('/login', loginRules, validate, ctrl.login);
router.post('/logout', auth, ctrl.logout);
router.post('/refresh', auth, ctrl.refresh);
router.get('/me', auth, ctrl.me);

module.exports = router;
