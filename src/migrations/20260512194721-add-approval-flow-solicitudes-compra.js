'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar nuevos campos para flujo de aprobación
    await queryInterface.addColumn('solicitudes_de_compra', 'monto_total', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('solicitudes_de_compra', 'aprobador_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id' },
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

    // Índice para consultas rápidas por estado
    await queryInterface.addIndex('solicitudes_de_compra', ['estado']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('solicitudes_de_compra', ['estado']);
    await queryInterface.removeColumn('solicitudes_de_compra', 'monto_total');
    await queryInterface.removeColumn('solicitudes_de_compra', 'aprobador_id');
    await queryInterface.removeColumn('solicitudes_de_compra', 'fecha_aprobacion');
    await queryInterface.removeColumn('solicitudes_de_compra', 'comentarios_aprobacion');
    await queryInterface.removeColumn('solicitudes_de_compra', 'fecha_recepcion');
  }
};
