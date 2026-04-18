'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificaciones', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      tipo: {
        type: Sequelize.ENUM('ESTADO_ENVIO', 'INCIDENTE', 'STOCK_BAJO', 'MANTENIMIENTO', 'SISTEMA'),
        allowNull: false,
      },
      leida: { type: Sequelize.BOOLEAN, defaultValue: false },
      destinatario: { type: Sequelize.STRING, allowNull: false },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('notificaciones');
  },
};
