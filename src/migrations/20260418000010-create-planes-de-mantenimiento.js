'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('planes_de_mantenimiento', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      frecuencia_km: { type: Sequelize.INTEGER, allowNull: true },
      frecuencia_dias: { type: Sequelize.INTEGER, allowNull: true },
      tipo_vehiculo: {
        type: Sequelize.ENUM('CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'),
        allowNull: false,
      },
      vehiculo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'vehiculos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('planes_de_mantenimiento');
  },
};
