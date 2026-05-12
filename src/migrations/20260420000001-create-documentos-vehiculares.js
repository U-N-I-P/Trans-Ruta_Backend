'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documentos_vehiculares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.ENUM('SOAT', 'TECNOMECANICA', 'REVISION_GASES', 'POLIZA', 'TARJETA_OPERACION'),
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fecha_expedicion: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_vencimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      archivo_adjunto: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('documentos_vehiculares');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_documentos_vehiculares_tipo";');
  }
};
