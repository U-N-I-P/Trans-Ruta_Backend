'use strict';
// bcryptjs es la implementación pura en JS de bcrypt — misma API, sin bindings nativos.
// Se usa aquí para evitar dependencia de herramientas de compilación nativas (node-gyp).
const bcrypt = require('bcryptjs');

/**
 * Seeder completo de Trans-Ruta.
 * Inserta datos representativos para desarrollo y pruebas.
 *
 * Orden de inserción (respeta FK):
 *   1. usuarios → 2. conductores → 3. clientes → 4. vehiculos
 *   → 5. ordenes_de_despacho → 6. entregas → 7. incidentes
 *   → 8. repuestos → 9. solicitudes_de_compra
 *   → 10. planes_de_mantenimiento → 11. ordenes_de_trabajo
 *
 * Contraseña de todos los usuarios: TransRuta2026!
 *
 * NOTA: El seeder inicial (20260418000001) inserta admin@transruta.com y ABC-123.
 * Este seeder usa correos y placas distintos para coexistir sin colisión.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('TransRuta2026!', 10);

    // ─────────────────────────────────────────────
    // 1. USUARIOS (13 registros)
    // ─────────────────────────────────────────────
    await queryInterface.bulkInsert('usuarios', [
      // Roles operativos
      {
        nombre: 'Despachador Principal',
        correo: 'despachador@transruta.com',
        contrasena: hashedPassword,
        rol: 'DESPACHADOR',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Jefe de Taller',
        correo: 'jefe.taller@transruta.com',
        contrasena: hashedPassword,
        rol: 'JEFE_TALLER',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Gestor Inventario',
        correo: 'gestor.inventario@transruta.com',
        contrasena: hashedPassword,
        rol: 'GESTOR_INVENTARIO',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Auditor Sistema',
        correo: 'auditor@transruta.com',
        contrasena: hashedPassword,
        rol: 'AUDITOR',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      // Conductores (usuarios)
      {
        nombre: 'Carlos Rodríguez',
        correo: 'conductor1@transruta.com',
        contrasena: hashedPassword,
        rol: 'CONDUCTOR',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Miguel Torres',
        correo: 'conductor2@transruta.com',
        contrasena: hashedPassword,
        rol: 'CONDUCTOR',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Andrés Vargas',
        correo: 'conductor3@transruta.com',
        contrasena: hashedPassword,
        rol: 'CONDUCTOR',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      // Clientes (usuarios)
      {
        nombre: 'Empresa Logística S.A.S',
        correo: 'cliente1@empresa.com',
        contrasena: hashedPassword,
        rol: 'CLIENTE',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Distribuidora Norte',
        correo: 'cliente2@empresa.com',
        contrasena: hashedPassword,
        rol: 'CLIENTE',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Importadora Sur',
        correo: 'cliente3@empresa.com',
        contrasena: hashedPassword,
        rol: 'CLIENTE',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Comercial Centro',
        correo: 'cliente4@empresa.com',
        contrasena: hashedPassword,
        rol: 'CLIENTE',
        activo: true,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Grupo Industrial',
        correo: 'cliente5@empresa.com',
        contrasena: hashedPassword,
        rol: 'CLIENTE',
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 2. CONDUCTORES (3 registros)
    // Recuperamos los IDs de los usuarios recién insertados por correo
    // ─────────────────────────────────────────────
    const [usuariosConductores] = await queryInterface.sequelize.query(
      `SELECT id, correo FROM usuarios
       WHERE correo IN ('conductor1@transruta.com','conductor2@transruta.com','conductor3@transruta.com')
       ORDER BY correo`
    );

    const ucMap = {};
    usuariosConductores.forEach((u) => { ucMap[u.correo] = u.id; });

    await queryInterface.bulkInsert('conductores', [
      {
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        cedula: '10234567',
        telefono: '3101234567',
        numero_licencia: 'LIC-001-2024',
        categoria_licencia: 'C2',
        fecha_vencimiento_licencia: '2027-06-30',
        horas_conducidas: 1250.5,
        usuario_id: ucMap['conductor1@transruta.com'],
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Miguel',
        apellido: 'Torres',
        cedula: '20345678',
        telefono: '3202345678',
        numero_licencia: 'LIC-002-2024',
        categoria_licencia: 'C3',
        fecha_vencimiento_licencia: '2026-12-15',
        horas_conducidas: 890.0,
        usuario_id: ucMap['conductor2@transruta.com'],
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Andrés',
        apellido: 'Vargas',
        cedula: '30456789',
        telefono: '3003456789',
        numero_licencia: 'LIC-003-2024',
        categoria_licencia: 'C2',
        fecha_vencimiento_licencia: '2028-03-20',
        horas_conducidas: 0,
        usuario_id: ucMap['conductor3@transruta.com'],
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 3. CLIENTES (5 registros)
    // ─────────────────────────────────────────────
    const [usuariosClientes] = await queryInterface.sequelize.query(
      `SELECT id, correo FROM usuarios
       WHERE correo IN ('cliente1@empresa.com','cliente2@empresa.com','cliente3@empresa.com','cliente4@empresa.com','cliente5@empresa.com')
       ORDER BY correo`
    );

    const clMap = {};
    usuariosClientes.forEach((u) => { clMap[u.correo] = u.id; });

    await queryInterface.bulkInsert('clientes', [
      {
        nombre: 'Empresa Logística S.A.S',
        correo: 'cliente1@empresa.com',
        telefono: '6011234567',
        direccion: 'Calle 80 #45-10, Bogotá',
        tipo_documento: 'NIT',
        numero_documento: '900111111-1',
        usuario_id: clMap['cliente1@empresa.com'],
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Distribuidora Norte',
        correo: 'cliente2@empresa.com',
        telefono: '6072345678',
        direccion: 'Carrera 15 #20-30, Medellín',
        tipo_documento: 'NIT',
        numero_documento: '900222222-2',
        usuario_id: clMap['cliente2@empresa.com'],
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Importadora Sur',
        correo: 'cliente3@empresa.com',
        telefono: '6023456789',
        direccion: 'Av. 6N #23-45, Cali',
        tipo_documento: 'NIT',
        numero_documento: '900333333-3',
        usuario_id: clMap['cliente3@empresa.com'],
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Comercial Centro',
        correo: 'cliente4@empresa.com',
        telefono: '6054567890',
        direccion: 'Calle 50 #30-20, Bucaramanga',
        tipo_documento: 'NIT',
        numero_documento: '900444444-4',
        usuario_id: clMap['cliente4@empresa.com'],
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Grupo Industrial',
        correo: 'cliente5@empresa.com',
        telefono: '6045678901',
        direccion: 'Zona Industrial Km 5, Barranquilla',
        tipo_documento: 'NIT',
        numero_documento: '900555555-5',
        usuario_id: clMap['cliente5@empresa.com'],
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 4. VEHÍCULOS (5 registros)
    // capacidad_carga > 0 — respeta chk_vehiculos_capacidad_carga
    // ─────────────────────────────────────────────
    await queryInterface.bulkInsert('vehiculos', [
      {
        placa: 'TRK-001',
        tipo: 'CAMION_CARGA_PESADA',
        capacidad_carga: 35000,
        restricciones: 'No ingresar a zonas de carga restringida nocturna',
        estado: 'DISPONIBLE',
        created_at: now,
        updated_at: now,
      },
      {
        placa: 'TRK-002',
        tipo: 'CAMION_CARGA_PESADA',
        capacidad_carga: 28000,
        restricciones: null,
        estado: 'EN_RUTA',
        created_at: now,
        updated_at: now,
      },
      {
        placa: 'TRB-001',
        tipo: 'TURBO',
        capacidad_carga: 8000,
        restricciones: null,
        estado: 'DISPONIBLE',
        created_at: now,
        updated_at: now,
      },
      {
        placa: 'CMT-001',
        tipo: 'CAMIONETA',
        capacidad_carga: 2500,
        restricciones: 'Solo carga no peligrosa',
        estado: 'EN_MANTENIMIENTO',
        created_at: now,
        updated_at: now,
      },
      {
        placa: 'CMT-002',
        tipo: 'CAMIONETA',
        capacidad_carga: 3000,
        restricciones: null,
        estado: 'FUERA_DE_SERVICIO',
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 5. ÓRDENES DE DESPACHO (10 registros)
    // Recuperamos IDs de conductores, vehículos y clientes por campos únicos
    // peso_carga > 0 — respeta chk_ordenes_de_despacho_peso_carga
    // ─────────────────────────────────────────────
    const [conductoresRows] = await queryInterface.sequelize.query(
      `SELECT id, cedula FROM conductores WHERE cedula IN ('10234567','20345678','30456789') ORDER BY cedula`
    );
    const condMap = {};
    conductoresRows.forEach((r) => { condMap[r.cedula] = r.id; });
    const cond1 = condMap['10234567'], cond2 = condMap['20345678'], cond3 = condMap['30456789'];

    const [vehiculosRows] = await queryInterface.sequelize.query(
      `SELECT id, placa FROM vehiculos WHERE placa IN ('TRK-001','TRK-002','TRB-001') ORDER BY placa`
    );
    const vehMap = {};
    vehiculosRows.forEach((r) => { vehMap[r.placa] = r.id; });
    const veh1 = vehMap['TRK-001'], veh2 = vehMap['TRK-002'], veh3 = vehMap['TRB-001'];

    const [clientesRows] = await queryInterface.sequelize.query(
      `SELECT id, numero_documento FROM clientes WHERE numero_documento IN ('900111111-1','900222222-2','900333333-3') ORDER BY numero_documento`
    );
    const cliMap = {};
    clientesRows.forEach((r) => { cliMap[r.numero_documento] = r.id; });
    const cli1 = cliMap['900111111-1'], cli2 = cliMap['900222222-2'], cli3 = cliMap['900333333-3'];

    await queryInterface.bulkInsert('ordenes_de_despacho', [
      // DESPACHADO (2)
      {
        codigo: 'OD-2026-001',
        fecha_creacion: '2026-04-20',
        fecha_salida: '2026-04-21',
        fecha_entrega_estimada: '2026-04-23',
        estado: 'DESPACHADO',
        origen: 'Bogotá - Bodega Central',
        destino: 'Medellín - Distribuidora Norte',
        peso_carga: 15000,
        descripcion_carga: 'Electrodomésticos empacados',
        conductor_id: cond1,
        vehiculo_id: veh1,
        cliente_id: cli2,
        created_at: now,
        updated_at: now,
      },
      {
        codigo: 'OD-2026-002',
        fecha_creacion: '2026-04-21',
        fecha_salida: '2026-04-22',
        fecha_entrega_estimada: '2026-04-25',
        estado: 'DESPACHADO',
        origen: 'Bogotá - Zona Industrial',
        destino: 'Cali - Importadora Sur',
        peso_carga: 22000,
        descripcion_carga: 'Maquinaria industrial',
        conductor_id: cond2,
        vehiculo_id: veh2,
        cliente_id: cli3,
        created_at: now,
        updated_at: now,
      },
      // EN_RUTA (2)
      {
        codigo: 'OD-2026-003',
        fecha_creacion: '2026-04-18',
        fecha_salida: '2026-04-19',
        fecha_entrega_estimada: '2026-04-22',
        estado: 'EN_RUTA',
        origen: 'Medellín - Puerto',
        destino: 'Bogotá - Comercial Centro',
        peso_carga: 7500,
        descripcion_carga: 'Textiles importados',
        conductor_id: cond3,
        vehiculo_id: veh3,
        cliente_id: cli1,
        created_at: now,
        updated_at: now,
      },
      {
        codigo: 'OD-2026-004',
        fecha_creacion: '2026-04-19',
        fecha_salida: '2026-04-20',
        fecha_entrega_estimada: '2026-04-24',
        estado: 'EN_RUTA',
        origen: 'Cali - Zona Franca',
        destino: 'Barranquilla - Grupo Industrial',
        peso_carga: 18500,
        descripcion_carga: 'Productos químicos no peligrosos',
        conductor_id: cond1,
        vehiculo_id: veh1,
        cliente_id: cli3,
        created_at: now,
        updated_at: now,
      },
      // CERCA_DEL_DESTINO (1)
      {
        codigo: 'OD-2026-005',
        fecha_creacion: '2026-04-17',
        fecha_salida: '2026-04-18',
        fecha_entrega_estimada: '2026-04-21',
        estado: 'CERCA_DEL_DESTINO',
        origen: 'Bucaramanga - Bodega',
        destino: 'Bogotá - Empresa Logística',
        peso_carga: 5200,
        descripcion_carga: 'Repuestos automotrices',
        conductor_id: cond2,
        vehiculo_id: veh3,
        cliente_id: cli1,
        created_at: now,
        updated_at: now,
      },
      // ENTREGADO (3)
      {
        codigo: 'OD-2026-006',
        fecha_creacion: '2026-04-10',
        fecha_salida: '2026-04-11',
        fecha_entrega_estimada: '2026-04-14',
        estado: 'ENTREGADO',
        origen: 'Bogotá - Bodega Central',
        destino: 'Medellín - Distribuidora Norte',
        peso_carga: 12000,
        descripcion_carga: 'Alimentos no perecederos',
        conductor_id: cond1,
        vehiculo_id: veh1,
        cliente_id: cli2,
        created_at: now,
        updated_at: now,
      },
      {
        codigo: 'OD-2026-007',
        fecha_creacion: '2026-04-12',
        fecha_salida: '2026-04-13',
        fecha_entrega_estimada: '2026-04-16',
        estado: 'ENTREGADO',
        origen: 'Cali - Zona Industrial',
        destino: 'Bogotá - Comercial Centro',
        peso_carga: 9800,
        descripcion_carga: 'Materiales de construcción',
        conductor_id: cond3,
        vehiculo_id: veh2,
        cliente_id: cli1,
        created_at: now,
        updated_at: now,
      },
      {
        codigo: 'OD-2026-008',
        fecha_creacion: '2026-04-14',
        fecha_salida: '2026-04-15',
        fecha_entrega_estimada: '2026-04-18',
        estado: 'ENTREGADO',
        origen: 'Barranquilla - Puerto',
        destino: 'Bogotá - Grupo Industrial',
        peso_carga: 25000,
        descripcion_carga: 'Equipos electrónicos',
        conductor_id: cond2,
        vehiculo_id: veh1,
        cliente_id: cli3,
        created_at: now,
        updated_at: now,
      },
      // CANCELADO (2)
      {
        codigo: 'OD-2026-009',
        fecha_creacion: '2026-04-15',
        fecha_salida: null,
        fecha_entrega_estimada: '2026-04-20',
        estado: 'CANCELADO',
        origen: 'Bogotá - Bodega Norte',
        destino: 'Cali - Importadora Sur',
        peso_carga: 3500,
        descripcion_carga: 'Pedido cancelado por cliente',
        conductor_id: cond3,
        vehiculo_id: veh3,
        cliente_id: cli3,
        created_at: now,
        updated_at: now,
      },
      {
        codigo: 'OD-2026-010',
        fecha_creacion: '2026-04-16',
        fecha_salida: null,
        fecha_entrega_estimada: '2026-04-22',
        estado: 'CANCELADO',
        origen: 'Medellín - Zona Industrial',
        destino: 'Bucaramanga - Comercial Centro',
        peso_carga: 6700,
        descripcion_carga: 'Cancelado por fuerza mayor',
        conductor_id: cond1,
        vehiculo_id: veh2,
        cliente_id: cli2,
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 6. ENTREGAS (3 registros — asociadas a órdenes ENTREGADO)
    // ─────────────────────────────────────────────
    const [ordenesEntregadasRows] = await queryInterface.sequelize.query(
      `SELECT id, codigo FROM ordenes_de_despacho WHERE codigo IN ('OD-2026-006','OD-2026-007','OD-2026-008')`
    );
    const odEntMap = {};
    ordenesEntregadasRows.forEach((r) => { odEntMap[r.codigo] = r.id; });

    await queryInterface.bulkInsert('entregas', [
      {
        orden_de_despacho_id: odEntMap['OD-2026-006'],
        fecha_entrega: '2026-04-14',
        firma_digital: null,
        fotografia: null,
        observaciones: 'Entrega sin novedad',
        latitud: 6.2442,
        longitud: -75.5812,
        created_at: now,
        updated_at: now,
      },
      {
        orden_de_despacho_id: odEntMap['OD-2026-007'],
        fecha_entrega: '2026-04-16',
        firma_digital: null,
        fotografia: null,
        observaciones: 'Entrega con leve retraso por tráfico',
        latitud: 3.4516,
        longitud: -76.5320,
        created_at: now,
        updated_at: now,
      },
      {
        orden_de_despacho_id: odEntMap['OD-2026-008'],
        fecha_entrega: '2026-04-18',
        firma_digital: null,
        fotografia: null,
        observaciones: null,
        latitud: 4.7110,
        longitud: -74.0721,
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 7. INCIDENTES (3 registros — distintos tipos)
    // ─────────────────────────────────────────────
    const [ordenesIncidentesRows] = await queryInterface.sequelize.query(
      `SELECT id, codigo FROM ordenes_de_despacho WHERE codigo IN ('OD-2026-003','OD-2026-004','OD-2026-005')`
    );
    const odIncMap = {};
    ordenesIncidentesRows.forEach((r) => { odIncMap[r.codigo] = r.id; });

    await queryInterface.bulkInsert('incidentes', [
      {
        orden_de_despacho_id: odIncMap['OD-2026-003'],
        tipo: 'ACCIDENTE',
        descripcion: 'Colisión menor en la vía Bogotá-Medellín. Sin heridos. Daños leves al vehículo.',
        fecha: '2026-04-19',
        latitud: 5.8520,
        longitud: -75.0320,
        protocolo_activado: true,
        created_at: now,
        updated_at: now,
      },
      {
        orden_de_despacho_id: odIncMap['OD-2026-004'],
        tipo: 'AVERIA',
        descripcion: 'Falla en el sistema de frenos. Vehículo detenido en estación de servicio.',
        fecha: '2026-04-20',
        latitud: 4.1420,
        longitud: -76.1230,
        protocolo_activado: false,
        created_at: now,
        updated_at: now,
      },
      {
        orden_de_despacho_id: odIncMap['OD-2026-005'],
        tipo: 'RETRASO',
        descripcion: 'Cierre vial por manifestación. Desvío de ruta con retraso estimado de 3 horas.',
        fecha: '2026-04-21',
        latitud: null,
        longitud: null,
        protocolo_activado: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 8. REPUESTOS (5 registros)
    // stock_actual >= 0, stock_minimo >= 0, precio > 0
    // ─────────────────────────────────────────────
    await queryInterface.bulkInsert('repuestos', [
      {
        nombre: 'Filtro de aceite',
        referencia: 'FO-2345',
        stock_actual: 15,
        stock_minimo: 5,
        unidad_medida: 'unidad',
        precio: 45000,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Pastillas de freno delanteras',
        referencia: 'PF-8901',
        stock_actual: 8,
        stock_minimo: 4,
        unidad_medida: 'par',
        precio: 120000,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Batería 12V 100Ah',
        referencia: 'BAT-1200',
        stock_actual: 3,
        stock_minimo: 2,
        unidad_medida: 'unidad',
        precio: 380000,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Neumático 295/80 R22.5',
        referencia: 'NEU-2980',
        stock_actual: 0,
        stock_minimo: 4,
        unidad_medida: 'unidad',
        precio: 950000,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Correa de distribución',
        referencia: 'CD-5678',
        stock_actual: 6,
        stock_minimo: 2,
        unidad_medida: 'unidad',
        precio: 85000,
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 9. SOLICITUDES DE COMPRA (3 registros)
    // cantidad > 0, costo_estimado NULL o > 0
    // ─────────────────────────────────────────────
    const [repuestosRows] = await queryInterface.sequelize.query(
      `SELECT id, referencia FROM repuestos WHERE referencia IN ('FO-2345','PF-8901','NEU-2980') ORDER BY referencia`
    );
    const repMap = {};
    repuestosRows.forEach((r) => { repMap[r.referencia] = r.id; });

    await queryInterface.bulkInsert('solicitudes_de_compra', [
      {
        fecha: '2026-04-20',
        estado: 'PENDIENTE',
        descripcion: 'Reposición de stock de filtros de aceite',
        cantidad: 20,
        costo_estimado: 900000,
        repuesto_id: repMap['FO-2345'],
        created_at: now,
        updated_at: now,
      },
      {
        fecha: '2026-04-15',
        estado: 'APROBADA',
        descripcion: 'Compra urgente de pastillas de freno',
        cantidad: 8,
        costo_estimado: 960000,
        repuesto_id: repMap['PF-8901'],
        created_at: now,
        updated_at: now,
      },
      {
        fecha: '2026-04-10',
        estado: 'RECIBIDA',
        descripcion: 'Reposición de neumáticos agotados',
        cantidad: 12,
        costo_estimado: null,
        repuesto_id: repMap['NEU-2980'],
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 10. PLANES DE MANTENIMIENTO (3 registros)
    // Al menos una frecuencia definida y > 0
    // ─────────────────────────────────────────────
    await queryInterface.bulkInsert('planes_de_mantenimiento', [
      {
        nombre: 'Mantenimiento preventivo 5000km',
        descripcion: 'Cambio de aceite, filtros y revisión general cada 5000 km',
        frecuencia_km: 5000,
        frecuencia_dias: null,
        tipo_vehiculo: 'CAMION_CARGA_PESADA',
        vehiculo_id: veh1,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Revisión mensual de frenos',
        descripcion: 'Inspección y ajuste del sistema de frenos',
        frecuencia_km: null,
        frecuencia_dias: 30,
        tipo_vehiculo: 'TURBO',
        vehiculo_id: veh3,
        created_at: now,
        updated_at: now,
      },
      {
        nombre: 'Mantenimiento integral trimestral',
        descripcion: 'Revisión completa de motor, transmisión y sistema eléctrico',
        frecuencia_km: 15000,
        frecuencia_dias: 90,
        tipo_vehiculo: 'CAMION_CARGA_PESADA',
        vehiculo_id: veh2,
        created_at: now,
        updated_at: now,
      },
    ]);

    // ─────────────────────────────────────────────
    // 11. ÓRDENES DE TRABAJO (2 registros)
    // costo NULL o > 0
    // ─────────────────────────────────────────────
    const [repuestosOTRows] = await queryInterface.sequelize.query(
      `SELECT id, referencia FROM repuestos WHERE referencia IN ('BAT-1200','CD-5678') ORDER BY referencia`
    );
    const repOTMap = {};
    repuestosOTRows.forEach((r) => { repOTMap[r.referencia] = r.id; });

    await queryInterface.bulkInsert('ordenes_de_trabajo', [
      {
        codigo: 'OT-2026-001',
        fecha_apertura: '2026-04-19',
        fecha_cierre: '2026-04-20',
        descripcion: 'Reemplazo de batería en CMT-001 por falla de arranque',
        estado: 'CERRADA',
        costo: 420000,
        repuesto_id: repOTMap['BAT-1200'],
        created_at: now,
        updated_at: now,
      },
      {
        codigo: 'OT-2026-002',
        fecha_apertura: '2026-04-22',
        fecha_cierre: null,
        descripcion: 'Cambio de correa de distribución en TRK-002 por desgaste',
        estado: 'EN_PROCESO',
        costo: null,
        repuesto_id: repOTMap['CD-5678'],
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    // Eliminación en orden inverso al de inserción para respetar FK.
    // Se usan condiciones por campos únicos — NO null — para no borrar datos no relacionados.

    await queryInterface.bulkDelete('ordenes_de_trabajo', {
      codigo: ['OT-2026-001', 'OT-2026-002'],
    }, {});

    await queryInterface.bulkDelete('planes_de_mantenimiento', {
      nombre: [
        'Mantenimiento preventivo 5000km',
        'Revisión mensual de frenos',
        'Mantenimiento integral trimestral',
      ],
    }, {});

    await queryInterface.bulkDelete('solicitudes_de_compra', {
      descripcion: [
        'Reposición de stock de filtros de aceite',
        'Compra urgente de pastillas de freno',
        'Reposición de neumáticos agotados',
      ],
    }, {});

    await queryInterface.bulkDelete('repuestos', {
      referencia: ['FO-2345', 'PF-8901', 'BAT-1200', 'NEU-2980', 'CD-5678'],
    }, {});

    await queryInterface.bulkDelete('incidentes', {
      descripcion: [
        'Colisión menor en la vía Bogotá-Medellín. Sin heridos. Daños leves al vehículo.',
        'Falla en el sistema de frenos. Vehículo detenido en estación de servicio.',
        'Cierre vial por manifestación. Desvío de ruta con retraso estimado de 3 horas.',
      ],
    }, {});

    // Entregas: eliminamos por observaciones (campo único en nuestros datos de seed)
    await queryInterface.sequelize.query(
      `DELETE FROM entregas
       WHERE observaciones IN (
         'Entrega sin novedad',
         'Entrega con leve retraso por tráfico'
       )
       OR (observaciones IS NULL AND orden_de_despacho_id IN (
         SELECT id FROM ordenes_de_despacho WHERE codigo = 'OD-2026-008'
       ))`
    );

    await queryInterface.bulkDelete('ordenes_de_despacho', {
      codigo: [
        'OD-2026-001', 'OD-2026-002', 'OD-2026-003', 'OD-2026-004', 'OD-2026-005',
        'OD-2026-006', 'OD-2026-007', 'OD-2026-008', 'OD-2026-009', 'OD-2026-010',
      ],
    }, {});

    await queryInterface.bulkDelete('vehiculos', {
      placa: ['TRK-001', 'TRK-002', 'TRB-001', 'CMT-001', 'CMT-002'],
    }, {});

    await queryInterface.bulkDelete('clientes', {
      numero_documento: [
        '900111111-1', '900222222-2', '900333333-3', '900444444-4', '900555555-5',
      ],
    }, {});

    await queryInterface.bulkDelete('conductores', {
      cedula: ['10234567', '20345678', '30456789'],
    }, {});

    await queryInterface.bulkDelete('usuarios', {
      correo: [
        'despachador@transruta.com',
        'jefe.taller@transruta.com',
        'gestor.inventario@transruta.com',
        'auditor@transruta.com',
        'conductor1@transruta.com',
        'conductor2@transruta.com',
        'conductor3@transruta.com',
        'cliente1@empresa.com',
        'cliente2@empresa.com',
        'cliente3@empresa.com',
        'cliente4@empresa.com',
        'cliente5@empresa.com',
      ],
    }, {});
  },
};
