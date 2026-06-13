/**
 * @module controllers/estudiante.controller
 * @description Controlador para la gestión de estudiantes
 */
const { Estudiante } = require('../models');
const { generateUniquePin } = require('../utils/pinGenerator');

/**
 * Crea un nuevo estudiante con un PIN auto-generado
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 */
const crearEstudiante = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    const pin = await generateUniquePin(6);

    const estudiante = await Estudiante.create({
      nombre,
      pin,
    });

    return res.status(201).json({
      success: true,
      message: 'Estudiante creado exitosamente',
      data: estudiante,
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear estudiante',
      error: error.message
    });
  }
};

/**
 * Obtiene todos los estudiantes
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 */
const obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    return res.status(200).json({
      success: true,
      data: estudiantes,
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener estudiantes',
      error: error.message
    });
  }
};

module.exports = {
  crearEstudiante,
  obtenerEstudiantes,
};
