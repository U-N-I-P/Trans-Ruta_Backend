'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('viaticos', 'orden_de_despacho_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ordenes_de_despacho',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('viaticos', 'saldo', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('viaticos', 'orden_de_despacho_id');
    await queryInterface.removeColumn('viaticos', 'saldo');
  }
};
