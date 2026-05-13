/**
 * @module swagger
 * @description Configuración de Swagger para documentación de la API
 */

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Trans-Ruta API',
    version: '1.0.0',
    description: 'API RESTful para el sistema de gestión logística y transporte de carga Trans-Ruta',
    contact: {
      name: 'Equipo Backend Trans-Ruta',
      email: 'backend@trans-ruta.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Servidor de Desarrollo',
    },
    {
      url: 'https://api.trans-ruta.com/api/v1',
      description: 'Servidor de Producción',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido del endpoint /auth/login',
      },
    },
    schemas: {
      // Respuestas estándar
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operación realizada con éxito',
          },
          data: {
            type: 'object',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error en la operación',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                param: {
                  type: 'string',
                },
                msg: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      PaginationResponse: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'integer',
            example: 50,
          },
          totalPages: {
            type: 'integer',
            example: 5,
          },
          currentPage: {
            type: 'integer',
            example: 1,
          },
        },
      },
      
      // Modelos de datos
      Usuario: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          nombre: {
            type: 'string',
            example: 'Juan Pérez',
          },
          correo: {
            type: 'string',
            format: 'email',
            example: 'juan@trans-ruta.com',
          },
          rol: {
            type: 'string',
            enum: ['ADMINISTRADOR', 'DESPACHADOR', 'CONDUCTOR', 'JEFE_TALLER', 'GESTOR_INVENTARIO', 'AUDITOR'],
            example: 'ADMINISTRADOR',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      
      Vehiculo: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          placa: {
            type: 'string',
            example: 'TRK-900',
          },
          tipo: {
            type: 'string',
            enum: ['CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'],
            example: 'CAMION_CARGA_PESADA',
          },
          capacidadCarga: {
            type: 'number',
            format: 'double',
            example: 15000,
          },
          estado: {
            type: 'string',
            enum: ['DISPONIBLE', 'EN_RUTA', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'],
            example: 'DISPONIBLE',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      
      Conductor: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          nombre: {
            type: 'string',
            example: 'Carlos',
          },
          apellido: {
            type: 'string',
            example: 'Rodríguez',
          },
          cedula: {
            type: 'string',
            example: '1234567890',
          },
          numeroLicencia: {
            type: 'string',
            example: '12345678',
          },
          categoriaLicencia: {
            type: 'string',
            enum: ['B1', 'B2', 'C1', 'C2', 'C3'],
            example: 'C2',
          },
          fechaVencimientoLicencia: {
            type: 'string',
            format: 'date',
            example: '2027-12-31',
          },
          usuarioId: {
            type: 'integer',
            example: 5,
          },
        },
      },
      
      OrdenDeDespacho: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          codigo: {
            type: 'string',
            example: 'OD-2026-001',
          },
          origen: {
            type: 'string',
            example: 'Bogotá',
          },
          destino: {
            type: 'string',
            example: 'Medellín',
          },
          pesoCarga: {
            type: 'number',
            format: 'double',
            example: 12000,
          },
          descripcionCarga: {
            type: 'string',
            example: 'Materiales de construcción',
          },
          estado: {
            type: 'string',
            enum: ['DESPACHADO', 'EN_RUTA', 'CERCA_DEL_DESTINO', 'ENTREGADO', 'CANCELADO'],
            example: 'DESPACHADO',
          },
          vehiculoId: {
            type: 'integer',
            example: 2,
          },
          conductorId: {
            type: 'integer',
            example: 5,
          },
          clienteId: {
            type: 'integer',
            example: 8,
          },
          fechaEntregaEstimada: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      
      DocumentoVehicular: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          tipo: {
            type: 'string',
            enum: ['SOAT', 'TECNOMECANICA', 'REVISION_GASES', 'POLIZA', 'TARJETA_OPERACION'],
            example: 'SOAT',
          },
          numero: {
            type: 'string',
            example: '888999',
          },
          fechaExpedicion: {
            type: 'string',
            format: 'date',
            example: '2025-05-10',
          },
          fechaVencimiento: {
            type: 'string',
            format: 'date',
            example: '2026-05-10',
          },
          archivoAdjunto: {
            type: 'string',
            example: 'https://storage.trans-ruta.com/docs/soat-888999.pdf',
          },
          vehiculoId: {
            type: 'integer',
            example: 2,
          },
        },
      },
      
      ConsumoCombustible: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          kilometrajeInicial: {
            type: 'number',
            format: 'double',
            example: 120000,
          },
          kilometrajeFinal: {
            type: 'number',
            format: 'double',
            example: 120500,
          },
          litrosCargados: {
            type: 'number',
            format: 'double',
            example: 85.0,
          },
          costoTotal: {
            type: 'number',
            format: 'double',
            example: 320000,
          },
          rendimiento: {
            type: 'number',
            format: 'double',
            example: 5.88,
            description: 'Calculado automáticamente (Km/L)',
          },
          distanciaRecorrida: {
            type: 'number',
            format: 'double',
            example: 500,
            description: 'Calculado automáticamente',
          },
          evidenciaFotografica: {
            type: 'string',
            example: 'https://storage.trans-ruta.com/evidencias/ticket-123.jpg',
          },
          ordenDeDespachoId: {
            type: 'integer',
            example: 5,
          },
          vehiculoId: {
            type: 'integer',
            example: 2,
          },
        },
      },
      
      GastoViatico: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          monto: {
            type: 'number',
            format: 'double',
            example: 25000,
          },
          categoria: {
            type: 'string',
            enum: ['COMBUSTIBLE', 'PEAJES', 'ALIMENTACION', 'HOSPEDAJE', 'OTROS'],
            example: 'PEAJES',
          },
          descripcion: {
            type: 'string',
            example: 'Peaje Bogotá',
          },
          fechaHora: {
            type: 'string',
            format: 'date-time',
          },
          evidenciaFotografica: {
            type: 'string',
            example: 'https://url-del-ticket.jpg',
          },
          estado: {
            type: 'string',
            enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'],
            example: 'PENDIENTE',
          },
          comentariosAdmin: {
            type: 'string',
            example: 'Todo en orden',
          },
          viaticoId: {
            type: 'integer',
            example: 1,
          },
        },
      },
      
      SolicitudDeCompra: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          fecha: {
            type: 'string',
            format: 'date',
          },
          estado: {
            type: 'string',
            enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA'],
            example: 'PENDIENTE',
          },
          descripcion: {
            type: 'string',
            example: 'Filtros de aceite para mantenimiento preventivo',
          },
          cantidad: {
            type: 'integer',
            example: 5,
          },
          costoEstimado: {
            type: 'number',
            format: 'double',
            example: 450000,
          },
          montoTotal: {
            type: 'number',
            format: 'double',
            example: 2250000,
            description: 'Calculado automáticamente (cantidad * costoEstimado)',
          },
          repuestoId: {
            type: 'integer',
            example: 2,
          },
          aprobadorId: {
            type: 'integer',
            example: 1,
          },
          fechaAprobacion: {
            type: 'string',
            format: 'date-time',
          },
          comentariosAprobacion: {
            type: 'string',
            example: 'Aprobado por necesidad urgente',
          },
          fechaRecepcion: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      
      AuditoriaLog: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          usuarioId: {
            type: 'integer',
            example: 1,
          },
          accion: {
            type: 'string',
            enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'ASSIGN', 'LOGIN', 'LOGOUT'],
            example: 'APPROVE',
          },
          entidad: {
            type: 'string',
            example: 'SolicitudDeCompra',
          },
          entidadId: {
            type: 'integer',
            example: 15,
          },
          ipAddress: {
            type: 'string',
            example: '192.168.1.100',
          },
          datosAnteriores: {
            type: 'object',
            nullable: true,
          },
          datosNuevos: {
            type: 'object',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      
      Sugerencia: {
        type: 'object',
        properties: {
          vehiculo: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 2,
              },
              placa: {
                type: 'string',
                example: 'TRK-900',
              },
              tipo: {
                type: 'string',
                example: 'CAMION_CARGA_PESADA',
              },
              capacidadCarga: {
                type: 'number',
                example: 15000,
              },
            },
          },
          conductor: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 5,
              },
              nombre: {
                type: 'string',
                example: 'Carlos Rodríguez',
              },
              numeroLicencia: {
                type: 'string',
                example: '12345678',
              },
              categoriaLicencia: {
                type: 'string',
                example: 'C2',
              },
            },
          },
          scoreVehiculo: {
            type: 'integer',
            example: 95,
          },
          scoreConductor: {
            type: 'integer',
            example: 88,
          },
          scoreCombinado: {
            type: 'integer',
            example: 92,
          },
          detallesVehiculo: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['Capacidad óptima (80-100% utilizada)', 'Estado: DISPONIBLE'],
          },
          detallesConductor: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['Licencia C2 vigente', 'Descansado (15h desde último viaje)'],
          },
          justificacion: {
            type: 'string',
            example: 'Score combinado: 92/100 (Vehículo: 95, Conductor: 88)',
          },
        },
      },
      
      EvaluacionConductor: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          conductorId: {
            type: 'integer',
            example: 5,
          },
          periodo: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}$',
            example: '2026-05',
            description: 'Formato: YYYY-MM',
          },
          scoreTotal: {
            type: 'number',
            format: 'double',
            example: 87.50,
            description: 'Score total de desempeño (0-100)',
          },
          scorePuntualidad: {
            type: 'number',
            format: 'double',
            example: 28.00,
            description: 'Score de puntualidad (0-30)',
          },
          scoreIncidentes: {
            type: 'number',
            format: 'double',
            example: 25.00,
            description: 'Score de incidentes (0-25)',
          },
          scoreCombustible: {
            type: 'number',
            format: 'double',
            example: 18.00,
            description: 'Score de rendimiento de combustible (0-20)',
          },
          scoreCalificacionClientes: {
            type: 'number',
            format: 'double',
            example: 15.00,
            description: 'Score de calificación de clientes (0-15)',
          },
          scoreCumplimientoProtocolos: {
            type: 'number',
            format: 'double',
            example: 9.50,
            description: 'Score de cumplimiento de protocolos (0-10)',
          },
          entregasTotales: {
            type: 'integer',
            example: 25,
          },
          entregasATiempo: {
            type: 'integer',
            example: 23,
          },
          incidentesTotales: {
            type: 'integer',
            example: 1,
          },
          rendimientoPromedio: {
            type: 'number',
            format: 'double',
            example: 7.45,
            description: 'Rendimiento promedio de combustible (km/l)',
          },
          comentariosAdmin: {
            type: 'string',
            example: 'Buen desempeño general. Mejorar puntualidad.',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Autenticación',
      description: 'Endpoints de autenticación y registro',
    },
    {
      name: 'Usuarios',
      description: 'Gestión de usuarios del sistema',
    },
    {
      name: 'Vehículos',
      description: 'Gestión de flota vehicular',
    },
    {
      name: 'Conductores',
      description: 'Gestión de conductores',
    },
    {
      name: 'Órdenes de Despacho',
      description: 'Gestión de viajes y despachos',
    },
    {
      name: 'Documentos Vehiculares',
      description: 'Gestión de documentos de vehículos (SOAT, Tecnomecánica, etc.)',
    },
    {
      name: 'Consumo de Combustible',
      description: 'Registro y seguimiento de consumo de combustible',
    },
    {
      name: 'Viáticos y Gastos',
      description: 'Gestión de viáticos y gastos de conductores',
    },
    {
      name: 'Solicitudes de Compra',
      description: 'Gestión de solicitudes de compra de repuestos',
    },
    {
      name: 'Auditoría',
      description: 'Consulta de logs de auditoría del sistema',
    },
    {
      name: 'Sugerencias',
      description: 'Sistema inteligente de sugerencias de asignación',
    },
    {
      name: 'Evaluaciones',
      description: 'Sistema de evaluación de desempeño de conductores',
    },
  ],
};

module.exports = swaggerDefinition;
