'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('vehiculos', {
        fields: ['capacidad_carga'],
        type: 'check',
        name: 'chk_vehiculos_capacidad_carga',
        where: { capacidad_carga: { [Sequelize.Op.gt]: 0 } },
        transaction,
      });
      await queryInterface.addConstraint('ordenes_de_despacho', {
        fields: ['peso_carga'],
        type: 'check',
        name: 'chk_ordenes_de_despacho_peso_carga',
        where: { peso_carga: { [Sequelize.Op.gt]: 0 } },
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
      await queryInterface.removeConstraint('vehiculos', 'chk_vehiculos_capacidad_carga', { transaction });
      await queryInterface.removeConstraint('ordenes_de_despacho', 'chk_ordenes_de_despacho_peso_carga', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
