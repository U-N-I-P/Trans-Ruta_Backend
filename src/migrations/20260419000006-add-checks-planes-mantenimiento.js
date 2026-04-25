'use strict';

/**
 * Los tres constraints de planes_de_mantenimiento usan expresiones multi-columna
 * o condicionales (IS NULL OR / IS NOT NULL OR) que addConstraint no soporta.
 * Se usa SQL raw para los tres.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Al menos una frecuencia debe estar definida
      await queryInterface.sequelize.query(
        `ALTER TABLE planes_de_mantenimiento
         ADD CONSTRAINT chk_planes_de_mantenimiento_frecuencia_requerida
         CHECK (frecuencia_km IS NOT NULL OR frecuencia_dias IS NOT NULL)`,
        { transaction }
      );

      // Si frecuencia_km está presente, debe ser > 0
      await queryInterface.sequelize.query(
        `ALTER TABLE planes_de_mantenimiento
         ADD CONSTRAINT chk_planes_de_mantenimiento_frecuencia_km
         CHECK (frecuencia_km IS NULL OR frecuencia_km > 0)`,
        { transaction }
      );

      // Si frecuencia_dias está presente, debe ser > 0
      await queryInterface.sequelize.query(
        `ALTER TABLE planes_de_mantenimiento
         ADD CONSTRAINT chk_planes_de_mantenimiento_frecuencia_dias
         CHECK (frecuencia_dias IS NULL OR frecuencia_dias > 0)`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'planes_de_mantenimiento',
        'chk_planes_de_mantenimiento_frecuencia_requerida',
        { transaction }
      );
      await queryInterface.removeConstraint(
        'planes_de_mantenimiento',
        'chk_planes_de_mantenimiento_frecuencia_km',
        { transaction }
      );
      await queryInterface.removeConstraint(
        'planes_de_mantenimiento',
        'chk_planes_de_mantenimiento_frecuencia_dias',
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
