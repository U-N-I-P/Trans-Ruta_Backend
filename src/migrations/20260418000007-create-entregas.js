'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entregas', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      fecha_entrega: { type: Sequelize.DATEONLY, allowNull: false },
      firma_digital: { type: Sequelize.TEXT, allowNull: true },
      fotografia: { type: Sequelize.TEXT, allowNull: true },
      observaciones: { type: Sequelize.TEXT, allowNull: true },
      latitud: { type: Sequelize.DOUBLE, allowNull: true },
      longitud: { type: Sequelize.DOUBLE, allowNull: true },
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
    await queryInterface.dropTable('entregas');
  },
};
