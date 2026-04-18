'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orden_trabajo_plan', {
      orden_de_trabajo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ordenes_de_trabajo', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      plan_de_mantenimiento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'planes_de_mantenimiento', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orden_trabajo_plan');
  },
};
