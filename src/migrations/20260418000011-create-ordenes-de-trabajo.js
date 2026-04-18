'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ordenes_de_trabajo', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      codigo: { type: Sequelize.STRING, allowNull: false, unique: true },
      fecha_apertura: { type: Sequelize.DATEONLY, allowNull: false },
      fecha_cierre: { type: Sequelize.DATEONLY, allowNull: true },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      estado: {
        type: Sequelize.ENUM('ABIERTA', 'EN_PROCESO', 'CERRADA', 'CANCELADA'),
        allowNull: false,
        defaultValue: 'ABIERTA',
      },
      costo: { type: Sequelize.DOUBLE, allowNull: true },
      repuesto_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'repuestos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ordenes_de_trabajo');
  },
};
