'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('repuestos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      referencia: { type: Sequelize.STRING, allowNull: true },
      stock_actual: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      stock_minimo: { type: Sequelize.INTEGER, allowNull: false },
      unidad_medida: { type: Sequelize.STRING, allowNull: false },
      precio: { type: Sequelize.DOUBLE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('repuestos');
  },
};
