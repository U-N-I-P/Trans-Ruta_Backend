'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('solicitudes_de_compra', 'concepto_libre', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE solicitudes_de_compra ALTER COLUMN repuesto_id DROP NOT NULL',
    );

    await queryInterface.removeConstraint(
      'solicitudes_de_compra',
      'solicitudes_de_compra_repuesto_id_fkey',
    ).catch(() => {});

    await queryInterface.changeColumn('solicitudes_de_compra', 'repuesto_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'repuestos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('solicitudes_de_compra', 'concepto_libre');

    await queryInterface.changeColumn('solicitudes_de_compra', 'repuesto_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'repuestos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE solicitudes_de_compra ALTER COLUMN repuesto_id SET NOT NULL',
    );
  },
};
