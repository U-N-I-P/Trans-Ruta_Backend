'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('incidentes', 'estado', {
      type: Sequelize.ENUM('ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'),
      allowNull: false,
      defaultValue: 'ABIERTO',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('incidentes', 'estado');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_incidentes_estado";');
  },
};
