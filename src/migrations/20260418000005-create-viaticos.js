'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('viaticos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      monto: { type: Sequelize.DOUBLE, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      estado: {
        type: Sequelize.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'PAGADO'),
        allowNull: false,
      },
      conductor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'conductores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('viaticos');
  },
};
