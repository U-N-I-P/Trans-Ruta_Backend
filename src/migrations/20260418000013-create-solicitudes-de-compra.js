'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('solicitudes_de_compra', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      estado: {
        type: Sequelize.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA'),
        allowNull: false,
        defaultValue: 'PENDIENTE',
      },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      costo_estimado: { type: Sequelize.DOUBLE, allowNull: true },
      repuesto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'repuestos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('solicitudes_de_compra');
  },
};
