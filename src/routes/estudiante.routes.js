/**
 * @module routes/estudiante.routes
 * @description Rutas para la gestión de estudiantes
 */
const { Router } = require('express');
const { crearEstudiante, obtenerEstudiantes } = require('../controllers/estudiante.controller');

const router = Router();

// Endpoint para crear un estudiante
router.post('/', crearEstudiante);

// Endpoint para listar estudiantes
router.get('/', obtenerEstudiantes);

module.exports = router;
