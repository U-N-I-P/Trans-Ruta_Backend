'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // 1. Usuario administrador
    const hashedPassword = await bcrypt.hash('Admin1234!', 10);
    await queryInterface.bulkInsert('usuarios', [{
      nombre: 'Administrador Trans-Ruta',
      correo: 'admin@transruta.com',
      contrasena: hashedPassword,
      rol: 'ADMINISTRADOR',
      activo: true,
      created_at: new Date(),
      updated_at: new Date(),
    }]);

    // 2. Vehículo de ejemplo
    await queryInterface.bulkInsert('vehiculos', [{
      placa: 'ABC-123',
      tipo: 'CAMION_CARGA_PESADA',
      capacidad_carga: 35000,
      restricciones: null,
      estado: 'DISPONIBLE',
      created_at: new Date(),
      updated_at: new Date(),
    }]);

    // 3. Cliente de ejemplo
    await queryInterface.bulkInsert('clientes', [{
      nombre: 'Empresa Ejemplo S.A.S',
      correo: 'cliente@ejemplo.com',
      telefono: '3001234567',
      direccion: 'Calle 10 #15-20, Bogotá',
      tipo_documento: 'NIT',
      numero_documento: '900123456-1',
      usuario_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clientes', null, {});
    await queryInterface.bulkDelete('vehiculos', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  },
};
