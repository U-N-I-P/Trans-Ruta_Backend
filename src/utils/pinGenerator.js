/**
 * @module utils/pinGenerator
 * @description Utilidades para la generación de pines únicos
 */
const { Estudiante } = require('../models');

/**
 * Genera un PIN único aleatorio
 * @param {number} length - Longitud del PIN (por defecto 6)
 * @returns {Promise<string>} PIN único generado
 */
const generateUniquePin = async (length = 6) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let isUnique = false;
  let pin = '';

  while (!isUnique) {
    pin = '';
    for (let i = 0; i < length; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if exists
    const existing = await Estudiante.findOne({ where: { pin } });
    if (!existing) {
      isUnique = true;
    }
  }

  return pin;
};

module.exports = {
  generateUniquePin,
};
