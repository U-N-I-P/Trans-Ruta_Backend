'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ordenes_de_despacho', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      codigo: { type: Sequelize.STRING, allowNull: false, unique: true },
      fecha_creacion: { type: Sequelize.DATEONLY, allowNull: false },
      fecha_salida: { type: Sequelize.DATEONLY, allowNull: true },
      fecha_entrega_estimada: { type: Sequelize.DATEONLY, allowNull: true },
      estado: {
        type: Sequelize.ENUM('DESPACHADO', 'EN_RUTA', 'CERCA_DEL_DESTINO', 'ENTREGADO', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'DESPACHADO',
      },
      origen: { type: Sequelize.STRING, allowNull: false },
      destino: { type: Sequelize.STRING, allowNull: false },
      peso_carga: { type: Sequelize.DOUBLE, allowNull: false },
      descripcion_carga: { type: Sequelize.TEXT, allowNull: true },
      conductor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'conductores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      vehiculo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'vehiculos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ordenes_de_despacho');
  },
};
