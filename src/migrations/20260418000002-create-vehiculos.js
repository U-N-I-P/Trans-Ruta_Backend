'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehiculos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      placa: { type: Sequelize.STRING, allowNull: false, unique: true },
      tipo: {
        type: Sequelize.ENUM('CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'),
        allowNull: false,
      },
      capacidad_carga: { type: Sequelize.DOUBLE, allowNull: false },
      restricciones: { type: Sequelize.TEXT, allowNull: true },
      estado: {
        type: Sequelize.ENUM('DISPONIBLE', 'EN_RUTA', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'),
        allowNull: false,
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('vehiculos');
  },
};
