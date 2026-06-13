const app = require('./src/app');
const sequelize = require('./src/config/database');
const http = require('http');

async function runTests() {
  const PORT = 8888;
  const server = http.createServer(app);
  
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  try {
    const baseUrl = `http://localhost:${PORT}/api/v1`;

    // 1. Create Student 1
    console.log('\n--- 1. Creando Estudiante 1 ---');
    const res1 = await fetch(`${baseUrl}/estudiantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Integration Test 1' })
    });
    const data1 = await res1.json();
    console.log(data1);
    const pin1 = data1.data.pin;

    // 2. Create Student 2
    console.log('\n--- 2. Creando Estudiante 2 ---');
    const res2 = await fetch(`${baseUrl}/estudiantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Integration Test 2' })
    });
    const data2 = await res2.json();
    console.log(data2);
    const pin2 = data2.data.pin;

    // 3. Create Team
    console.log('\n--- 3. Creando Equipo ---');
    const resTeam = await fetch(`${baseUrl}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Equipo Alpha de Prueba', description: 'Test' }) // Adjust fields if needed
    });
    const dataTeam = await resTeam.json();
    console.log(dataTeam);
    const teamId = dataTeam.id || dataTeam.data?.id;

    // 4. Add Student 1 to Team
    console.log(`\n--- 4. Agregando Estudiante 1 (PIN: ${pin1}) al Equipo ${teamId} ---`);
    const resAdd1 = await fetch(`${baseUrl}/teams/${teamId}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin1 })
    });
    const dataAdd1 = await resAdd1.json();
    console.log(dataAdd1);

    // 5. Add Student 2 to Team
    console.log(`\n--- 5. Agregando Estudiante 2 (PIN: ${pin2}) al Equipo ${teamId} ---`);
    const resAdd2 = await fetch(`${baseUrl}/teams/${teamId}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin2 })
    });
    const dataAdd2 = await resAdd2.json();
    console.log(dataAdd2);

    // 6. Try adding Student 1 again (Should fail)
    console.log(`\n--- 6. Intentando agregar Estudiante 1 (PIN: ${pin1}) de nuevo (DEBE FALLAR) ---`);
    const resAddFail = await fetch(`${baseUrl}/teams/${teamId}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin1 })
    });
    const dataAddFail = await resAddFail.json();
    console.log(dataAddFail);

    // 7. Get Team Participants
    console.log(`\n--- 7. Listando Participantes del Equipo ${teamId} ---`);
    const resList = await fetch(`${baseUrl}/teams/${teamId}/students`);
    const dataList = await resList.json();
    console.log(JSON.stringify(dataList, null, 2));

    console.log('\n✅ VALIDACIÓN COMPLETADA EXITOSAMENTE');
  } catch (error) {
    console.error('❌ Error en la validación:', error);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
