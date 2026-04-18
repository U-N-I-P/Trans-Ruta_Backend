'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      correo: { type: Sequelize.STRING, allowNull: false, unique: true },
      contrasena: { type: Sequelize.STRING, allowNull: false },
      rol: {
        type: Sequelize.ENUM('ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR', 'CLIENTE', 'JEFE_TALLER', 'GESTOR_INVENTARIO', 'AUDITOR'),
        allowNull: false,
      },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
