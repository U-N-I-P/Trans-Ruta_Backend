'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      correo: { type: Sequelize.STRING, allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING, allowNull: true },
      direccion: { type: Sequelize.TEXT, allowNull: true },
      tipo_documento: {
        type: Sequelize.ENUM('CC', 'NIT', 'CE', 'PASAPORTE'),
        allowNull: false,
      },
      numero_documento: { type: Sequelize.STRING, allowNull: false, unique: true },
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
    await queryInterface.dropTable('clientes');
  },
};
