/**
 * @module migrations/create-evaluaciones-conductores
 * @description Migración para crear la tabla de evaluaciones de conductores
 */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('evaluaciones_conductores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conductor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'conductores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      periodo: {
        type: Sequelize.STRING(7), // Formato: "YYYY-MM"
        allowNull: false,
        comment: 'Periodo de evaluación en formato YYYY-MM',
      },
      score_total: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Score total de desempeño (0-100)',
      },
      score_puntualidad: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Score de puntualidad (0-30)',
      },
      score_incidentes: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Score de incidentes (0-25)',
      },
      score_combustible: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Score de rendimiento de combustible (0-20)',
      },
      score_calificacion_clientes: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Score de calificación de clientes (0-15)',
      },
      score_cumplimiento_protocolos: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Score de cumplimiento de protocolos (0-10)',
      },
      entregas_totales: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total de entregas realizadas en el periodo',
      },
      entregas_a_tiempo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Entregas realizadas a tiempo',
      },
      incidentes_totales: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total de incidentes reportados',
      },
      rendimiento_promedio: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        comment: 'Rendimiento promedio de combustible (km/l)',
      },
      comentarios_admin: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Comentarios o notas del administrador',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Índices para optimizar consultas
    await queryInterface.addIndex('evaluaciones_conductores', ['conductor_id'], {
      name: 'idx_evaluaciones_conductor_id',
    });

    await queryInterface.addIndex('evaluaciones_conductores', ['periodo'], {
      name: 'idx_evaluaciones_periodo',
    });

    await queryInterface.addIndex('evaluaciones_conductores', ['score_total'], {
      name: 'idx_evaluaciones_score_total',
    });

    await queryInterface.addIndex('evaluaciones_conductores', ['conductor_id', 'periodo'], {
      name: 'idx_evaluaciones_conductor_periodo',
    });

    // Constraint único: un conductor solo puede tener una evaluación por periodo
    await queryInterface.addConstraint('evaluaciones_conductores', {
      fields: ['conductor_id', 'periodo'],
      type: 'unique',
      name: 'unique_conductor_periodo',
    });

    // Check constraint: score_total debe estar entre 0 y 100
    await queryInterface.addConstraint('evaluaciones_conductores', {
      fields: ['score_total'],
      type: 'check',
      where: {
        score_total: {
          [Sequelize.Op.between]: [0, 100],
        },
      },
      name: 'check_score_total_range',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('evaluaciones_conductores');
  },
};
