'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gastos_viaticos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      monto: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      categoria: {
        type: Sequelize.ENUM('COMBUSTIBLE', 'PEAJES', 'ALIMENTACION', 'HOSPEDAJE', 'OTROS'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      evidencia_fotografica: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO'),
        allowNull: false,
        defaultValue: 'PENDIENTE'
      },
      comentarios_admin: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      viatico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'viaticos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gastos_viaticos');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_gastos_viaticos_categoria";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_gastos_viaticos_estado";');
  }
};
