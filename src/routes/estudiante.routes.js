/**
 * @module routes/estudiante.routes
 * @description Rutas para la gestión de estudiantes
 */
const { Router } = require('express');
const { generarPinAdmin, registrarEstudiante, obtenerEstudiantes } = require('../controllers/estudiante.controller');
const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/roles.middleware');

const router = Router();

// Endpoint para generar PIN (Solo Administradores)
router.post('/pin', auth, authorize('ADMINISTRADOR'), generarPinAdmin);

// Endpoint para registrarse consumiendo el PIN (Público / o logueado si es admin pero no requiere auth explícito porque el admin también lo puede usar)
router.post('/', registrarEstudiante);

// Endpoint para listar estudiantes
router.get('/', obtenerEstudiantes);

module.exports = router;
