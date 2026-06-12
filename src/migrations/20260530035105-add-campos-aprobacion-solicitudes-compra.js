'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('solicitudes_de_compra', 'aprobador_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('solicitudes_de_compra', 'fecha_aprobacion', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('solicitudes_de_compra', 'comentarios_aprobacion', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('solicitudes_de_compra', 'fecha_recepcion', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('solicitudes_de_compra', 'monto_total', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('solicitudes_de_compra', 'aprobador_id');
    await queryInterface.removeColumn('solicitudes_de_compra', 'fecha_aprobacion');
    await queryInterface.removeColumn('solicitudes_de_compra', 'comentarios_aprobacion');
    await queryInterface.removeColumn('solicitudes_de_compra', 'fecha_recepcion');
    await queryInterface.removeColumn('solicitudes_de_compra', 'monto_total');
  }
};
