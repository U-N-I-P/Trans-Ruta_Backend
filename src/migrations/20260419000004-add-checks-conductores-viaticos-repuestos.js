'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // conductores: horas_conducidas >= 0 (cero es válido para conductor nuevo)
      await queryInterface.addConstraint('conductores', {
        fields: ['horas_conducidas'],
        type: 'check',
        name: 'chk_conductores_horas_conducidas',
        where: { horas_conducidas: { [Sequelize.Op.gte]: 0 } },
        transaction,
      });

      // viaticos: monto > 0
      await queryInterface.addConstraint('viaticos', {
        fields: ['monto'],
        type: 'check',
        name: 'chk_viaticos_monto',
        where: { monto: { [Sequelize.Op.gt]: 0 } },
        transaction,
      });

      // repuestos: stock_actual >= 0
      await queryInterface.addConstraint('repuestos', {
        fields: ['stock_actual'],
        type: 'check',
        name: 'chk_repuestos_stock_actual',
        where: { stock_actual: { [Sequelize.Op.gte]: 0 } },
        transaction,
      });

      // repuestos: stock_minimo >= 0
      await queryInterface.addConstraint('repuestos', {
        fields: ['stock_minimo'],
        type: 'check',
        name: 'chk_repuestos_stock_minimo',
        where: { stock_minimo: { [Sequelize.Op.gte]: 0 } },
        transaction,
      });

      // repuestos: precio > 0
      await queryInterface.addConstraint('repuestos', {
        fields: ['precio'],
        type: 'check',
        name: 'chk_repuestos_precio',
        where: { precio: { [Sequelize.Op.gt]: 0 } },
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
      await queryInterface.removeConstraint('conductores', 'chk_conductores_horas_conducidas', { transaction });
      await queryInterface.removeConstraint('viaticos', 'chk_viaticos_monto', { transaction });
      await queryInterface.removeConstraint('repuestos', 'chk_repuestos_stock_actual', { transaction });
      await queryInterface.removeConstraint('repuestos', 'chk_repuestos_stock_minimo', { transaction });
      await queryInterface.removeConstraint('repuestos', 'chk_repuestos_precio', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
