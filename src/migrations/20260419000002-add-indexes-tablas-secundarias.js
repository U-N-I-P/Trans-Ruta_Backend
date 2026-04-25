'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // entregas
      await queryInterface.addIndex('entregas', ['orden_de_despacho_id'], {
        name: 'idx_entregas_orden_de_despacho_id',
        transaction,
      });

      // incidentes
      await queryInterface.addIndex('incidentes', ['orden_de_despacho_id'], {
        name: 'idx_incidentes_orden_de_despacho_id',
        transaction,
      });

      // notificaciones
      await queryInterface.addIndex('notificaciones', ['cliente_id'], {
        name: 'idx_notificaciones_cliente_id',
        transaction,
      });
      await queryInterface.addIndex('notificaciones', ['leida'], {
        name: 'idx_notificaciones_leida',
        transaction,
      });

      // viaticos
      await queryInterface.addIndex('viaticos', ['conductor_id'], {
        name: 'idx_viaticos_conductor_id',
        transaction,
      });
      await queryInterface.addIndex('viaticos', ['estado'], {
        name: 'idx_viaticos_estado',
        transaction,
      });

      // conductores
      await queryInterface.addIndex('conductores', ['usuario_id'], {
        name: 'idx_conductores_usuario_id',
        transaction,
      });

      // repuestos
      await queryInterface.addIndex('repuestos', ['stock_actual'], {
        name: 'idx_repuestos_stock_actual',
        transaction,
      });

      // solicitudes_de_compra
      await queryInterface.addIndex('solicitudes_de_compra', ['repuesto_id'], {
        name: 'idx_solicitudes_de_compra_repuesto_id',
        transaction,
      });
      await queryInterface.addIndex('solicitudes_de_compra', ['estado'], {
        name: 'idx_solicitudes_de_compra_estado',
        transaction,
      });

      // planes_de_mantenimiento
      await queryInterface.addIndex('planes_de_mantenimiento', ['vehiculo_id'], {
        name: 'idx_planes_de_mantenimiento_vehiculo_id',
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
      await queryInterface.removeIndex('entregas', 'idx_entregas_orden_de_despacho_id', { transaction });
      await queryInterface.removeIndex('incidentes', 'idx_incidentes_orden_de_despacho_id', { transaction });
      await queryInterface.removeIndex('notificaciones', 'idx_notificaciones_cliente_id', { transaction });
      await queryInterface.removeIndex('notificaciones', 'idx_notificaciones_leida', { transaction });
      await queryInterface.removeIndex('viaticos', 'idx_viaticos_conductor_id', { transaction });
      await queryInterface.removeIndex('viaticos', 'idx_viaticos_estado', { transaction });
      await queryInterface.removeIndex('conductores', 'idx_conductores_usuario_id', { transaction });
      await queryInterface.removeIndex('repuestos', 'idx_repuestos_stock_actual', { transaction });
      await queryInterface.removeIndex('solicitudes_de_compra', 'idx_solicitudes_de_compra_repuesto_id', { transaction });
      await queryInterface.removeIndex('solicitudes_de_compra', 'idx_solicitudes_de_compra_estado', { transaction });
      await queryInterface.removeIndex('planes_de_mantenimiento', 'idx_planes_de_mantenimiento_vehiculo_id', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
