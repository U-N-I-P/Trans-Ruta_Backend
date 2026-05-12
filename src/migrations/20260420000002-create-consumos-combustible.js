'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('consumos_combustible', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kilometraje_inicial: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      kilometraje_final: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      litros_cargados: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      costo_total: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      rendimiento: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      distancia_recorrida: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      evidencia_fotografica: {
        type: Sequelize.STRING,
        allowNull: true
      },
      orden_de_despacho_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ordenes_de_despacho',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vehiculo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehiculos',
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
    await queryInterface.dropTable('consumos_combustible');
  }
};
