/**
 * @module controllers/estudiante.controller
 * @description Controlador para la gestión de estudiantes
 */
const { Estudiante } = require('../models');
const { generateUniquePin } = require('../utils/pinGenerator');

/**
 * Genera un PIN vacío para un estudiante (Solo Administrador)
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 */
const generarPinAdmin = async (req, res) => {
  try {
    const pin = await generateUniquePin(6);
    
    // Crear el registro sin nombre (nombre=null)
    const estudiante = await Estudiante.create({ pin });

    return res.status(201).json({
      success: true,
      message: 'PIN generado exitosamente',
      data: {
        pin: estudiante.pin
      }
    });
  } catch (error) {
    console.error('Error al generar PIN:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar PIN',
      error: error.message
    });
  }
};

/**
 * Registra un estudiante consumiendo un PIN pre-generado
 * @param {Object} req - Objeto de petición Express
 * @param {Object} res - Objeto de respuesta Express
 */
const registrarEstudiante = async (req, res) => {
  try {
    const { nombre, pin } = req.body;
    
    if (!nombre || !pin) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y el pin son requeridos'
      });
    }

    // Buscar estudiante por PIN que no tenga nombre (registro pendiente)
    const estudiante = await Estudiante.findOne({ where: { pin, nombre: null } });

    if (!estudiante) {
      return res.status(400).json({
        success: false,
        message: 'PIN inválido o ya utilizado para registro'
      });
    }

    // Actualizar nombre
    estudiante.nombre = nombre;
    await estudiante.save();

    return res.status(200).json({
      success: true,
      message: 'Estudiante registrado exitosamente',
      data: estudiante,
    });
  } catch (error) {
    console.error('Error al registrar estudiante:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar estudiante',
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
  generarPinAdmin,
  registrarEstudiante,
  obtenerEstudiantes,
};
