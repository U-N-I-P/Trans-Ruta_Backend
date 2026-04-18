'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conductores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      apellido: { type: Sequelize.STRING, allowNull: false },
      cedula: { type: Sequelize.STRING, allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING, allowNull: true },
      numero_licencia: { type: Sequelize.STRING, allowNull: false, unique: true },
      categoria_licencia: { type: Sequelize.STRING, allowNull: false },
      fecha_vencimiento_licencia: { type: Sequelize.DATEONLY, allowNull: false },
      horas_conducidas: { type: Sequelize.DOUBLE, defaultValue: 0 },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('conductores');
  },
};
