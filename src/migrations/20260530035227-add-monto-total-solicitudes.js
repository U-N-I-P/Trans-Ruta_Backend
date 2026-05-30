'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('solicitudes_de_compra', 'monto_total', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('solicitudes_de_compra', 'monto_total');
  }
};
