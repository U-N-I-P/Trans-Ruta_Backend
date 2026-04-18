'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tipo: {
        type: Sequelize.ENUM('COMBUSTIBLE', 'RUTAS_RENTABLES', 'CUMPLIMIENTO_ENTREGAS', 'MANTENIMIENTO', 'INVENTARIO'),
        allowNull: false,
      },
      fecha_generacion: { type: Sequelize.DATEONLY, allowNull: false },
      parametros: { type: Sequelize.TEXT, allowNull: true },
      contenido: { type: Sequelize.TEXT, allowNull: true },
      formato: {
        type: Sequelize.ENUM('JSON', 'CSV', 'PDF'),
        allowNull: false,
        defaultValue: 'JSON',
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('reportes');
  },
};
