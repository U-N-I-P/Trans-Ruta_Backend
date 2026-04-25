'use strict';

/**
 * Los constraints condicionales (IS NULL OR valor > 0) no son soportados
 * por addConstraint con la opción `where` de Sequelize.
 * Se usa SQL raw con queryInterface.sequelize.query() para estos casos.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // solicitudes_de_compra: cantidad > 0 (campo NOT NULL, addConstraint es suficiente)
      await queryInterface.addConstraint('solicitudes_de_compra', {
        fields: ['cantidad'],
        type: 'check',
        name: 'chk_solicitudes_de_compra_cantidad',
        where: { cantidad: { [Sequelize.Op.gt]: 0 } },
        transaction,
      });

      // solicitudes_de_compra: costo_estimado IS NULL OR costo_estimado > 0 (campo nullable)
      await queryInterface.sequelize.query(
        `ALTER TABLE solicitudes_de_compra
         ADD CONSTRAINT chk_solicitudes_de_compra_costo_estimado
         CHECK (costo_estimado IS NULL OR costo_estimado > 0)`,
        { transaction }
      );

      // ordenes_de_trabajo: costo IS NULL OR costo > 0 (campo nullable)
      await queryInterface.sequelize.query(
        `ALTER TABLE ordenes_de_trabajo
         ADD CONSTRAINT chk_ordenes_de_trabajo_costo
         CHECK (costo IS NULL OR costo > 0)`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint('solicitudes_de_compra', 'chk_solicitudes_de_compra_cantidad', { transaction });
      await queryInterface.removeConstraint('solicitudes_de_compra', 'chk_solicitudes_de_compra_costo_estimado', { transaction });
      await queryInterface.removeConstraint('ordenes_de_trabajo', 'chk_ordenes_de_trabajo_costo', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
