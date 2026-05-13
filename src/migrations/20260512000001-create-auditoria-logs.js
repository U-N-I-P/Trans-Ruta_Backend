'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auditoria_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      accion: {
        type: Sequelize.ENUM(
          'CREATE',
          'UPDATE',
          'DELETE',
          'APPROVE',
          'REJECT',
          'ASSIGN',
          'LOGIN',
          'LOGOUT'
        ),
        allowNull: false,
      },
      entidad: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      entidad_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      datos_anteriores: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      datos_nuevos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('auditoria_logs', ['usuario_id']);
    await queryInterface.addIndex('auditoria_logs', ['accion']);
    await queryInterface.addIndex('auditoria_logs', ['entidad']);
    await queryInterface.addIndex('auditoria_logs', ['created_at']);
    await queryInterface.addIndex('auditoria_logs', ['entidad', 'entidad_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auditoria_logs');
  },
};
