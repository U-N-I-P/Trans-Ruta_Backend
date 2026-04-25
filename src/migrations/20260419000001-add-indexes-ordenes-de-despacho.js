'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex('ordenes_de_despacho', ['estado'], {
        name: 'idx_ordenes_de_despacho_estado',
        transaction,
      });
      await queryInterface.addIndex('ordenes_de_despacho', ['conductor_id'], {
        name: 'idx_ordenes_de_despacho_conductor_id',
        transaction,
      });
      await queryInterface.addIndex('ordenes_de_despacho', ['vehiculo_id'], {
        name: 'idx_ordenes_de_despacho_vehiculo_id',
        transaction,
      });
      await queryInterface.addIndex('ordenes_de_despacho', ['cliente_id'], {
        name: 'idx_ordenes_de_despacho_cliente_id',
        transaction,
      });
      await queryInterface.addIndex('ordenes_de_despacho', ['fecha_creacion'], {
        name: 'idx_ordenes_de_despacho_fecha_creacion',
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex('ordenes_de_despacho', 'idx_ordenes_de_despacho_estado', { transaction });
      await queryInterface.removeIndex('ordenes_de_despacho', 'idx_ordenes_de_despacho_conductor_id', { transaction });
      await queryInterface.removeIndex('ordenes_de_despacho', 'idx_ordenes_de_despacho_vehiculo_id', { transaction });
      await queryInterface.removeIndex('ordenes_de_despacho', 'idx_ordenes_de_despacho_cliente_id', { transaction });
      await queryInterface.removeIndex('ordenes_de_despacho', 'idx_ordenes_de_despacho_fecha_creacion', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
