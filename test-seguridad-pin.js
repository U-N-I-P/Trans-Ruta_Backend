const { sequelize, Estudiante } = require('./src/models');
const { generateUniquePin } = require('./src/utils/pinGenerator');

async function testSecurityFlow() {
  console.log('🔄 Iniciando prueba de seguridad de PIN...');

  try {
    await sequelize.authenticate();
    
    // 1. Simular Admin generando PIN
    console.log('\n--- PASO 1: Admin genera PIN ---');
    const adminPin = await generateUniquePin(6);
    const estudiantePendiente = await Estudiante.create({ pin: adminPin });
    console.log(`✅ PIN Generado exitosamente: ${adminPin} (Registro creado con nombre: null)`);

    // 2. Simular estudiante consumiendo PIN válido
    console.log('\n--- PASO 2: Estudiante se registra con el PIN ---');
    const nombreEstudiante = 'Estudiante Seguro';
    
    // Buscar el PIN no consumido
    let estudianteToUpdate = await Estudiante.findOne({ 
      where: { pin: adminPin, nombre: null } 
    });

    if (estudianteToUpdate) {
      estudianteToUpdate.nombre = nombreEstudiante;
      await estudianteToUpdate.save();
      console.log(`✅ Estudiante "${nombreEstudiante}" registrado correctamente con el PIN ${adminPin}`);
    } else {
      console.error(`❌ Falló la búsqueda del PIN pendiente`);
    }

    // 3. Simular otro estudiante intentando usar el mismo PIN (Replay Attack)
    console.log('\n--- PASO 3: Intento de re-uso de PIN ---');
    let intentoFallido = await Estudiante.findOne({ 
      where: { pin: adminPin, nombre: null } 
    });

    if (!intentoFallido) {
      console.log(`✅ Prueba de seguridad pasada: El PIN ${adminPin} ya no está disponible para un nuevo registro.`);
    } else {
      console.error(`❌ Fallo de seguridad: El PIN se pudo reutilizar.`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await sequelize.close();
  }
}

testSecurityFlow();
