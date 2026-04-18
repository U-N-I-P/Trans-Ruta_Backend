'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incidentes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tipo: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      latitud: { type: Sequelize.DOUBLE, allowNull: true },
      longitud: { type: Sequelize.DOUBLE, allowNull: true },
      protocolo_activado: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      orden_de_despacho_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ordenes_de_despacho', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('incidentes');
  },
};
