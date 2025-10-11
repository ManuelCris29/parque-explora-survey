// Script para poblar la base de datos con datos de prueba
// Ejecutar con: node scripts/populate-test-data.js

const AWS = require('aws-sdk');

// Configurar DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1' // Cambiar por tu región
});

// Tabla de usuarios (ajustar el nombre según tu entorno)
const USERS_TABLE = 'dev-parque-explora-users';
const ROOMS_TABLE = 'dev-parque-explora-rooms';

// Usuarios de prueba
const testUsers = [
  {
    cedula: '12345678',
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '3001234567',
    fechaCompra: new Date().toISOString(),
    boletaId: 'BOL-001-12345678',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    cedula: '87654321',
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    telefono: '3007654321',
    fechaCompra: new Date(Date.now() - 86400000).toISOString(), // Ayer
    boletaId: 'BOL-002-87654321',
    fechaCreacion: new Date(Date.now() - 86400000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 86400000).toISOString()
  },
  {
    cedula: '11223344',
    nombre: 'Carlos López',
    email: 'carlos.lopez@email.com',
    telefono: '3001122334',
    fechaCompra: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
    boletaId: 'BOL-003-11223344',
    fechaCreacion: new Date(Date.now() - 172800000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 172800000).toISOString()
  },
  {
    cedula: '55667788',
    nombre: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    telefono: '3005566778',
    fechaCompra: new Date(Date.now() - 259200000).toISOString(), // Hace 3 días
    boletaId: 'BOL-004-55667788',
    fechaCreacion: new Date(Date.now() - 259200000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 259200000).toISOString()
  },
  {
    cedula: '99887766',
    nombre: 'Pedro Rodríguez',
    email: 'pedro.rodriguez@email.com',
    telefono: '3009988776',
    fechaCompra: new Date(Date.now() - 345600000).toISOString(), // Hace 4 días
    boletaId: 'BOL-005-99887766',
    fechaCreacion: new Date(Date.now() - 345600000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 345600000).toISOString()
  }
];

// Salas del parque
const testRooms = [
  {
    roomId: 'sala-1',
    nombre: 'Sala de Proyección 3D',
    descripcion: 'Experiencia inmersiva en 3D con tecnología de última generación',
    categoria: 'Tecnología',
    estado: 'activa'
  },
  {
    roomId: 'sala-2',
    nombre: 'Planetario',
    descripcion: 'Observación del cosmos y proyecciones astronómicas',
    categoria: 'Astronomía',
    estado: 'activa'
  },
  {
    roomId: 'sala-3',
    nombre: 'Laboratorio de Química',
    descripcion: 'Experimentos interactivos de química y física',
    categoria: 'Ciencias',
    estado: 'activa'
  },
  {
    roomId: 'sala-4',
    nombre: 'Acuario',
    descripcion: 'Exhibición de vida marina y ecosistemas acuáticos',
    categoria: 'Biología',
    estado: 'activa'
  },
  {
    roomId: 'sala-5',
    nombre: 'Sala de Robots',
    descripcion: 'Interacción con robots y tecnología de inteligencia artificial',
    categoria: 'Robótica',
    estado: 'activa'
  },
  {
    roomId: 'sala-6',
    nombre: 'Museo de la Tierra',
    descripcion: 'Exhibición sobre geología y formaciones terrestres',
    categoria: 'Geología',
    estado: 'activa'
  }
];

async function populateUsers() {
  console.log('🔄 Poblando tabla de usuarios...');
  
  for (const user of testUsers) {
    try {
      await dynamodb.put({
        TableName: USERS_TABLE,
        Item: user
      }).promise();
      console.log(`✅ Usuario creado: ${user.nombre} (${user.cedula})`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${user.cedula}:`, error.message);
    }
  }
}

async function populateRooms() {
  console.log('🔄 Poblando tabla de salas...');
  
  for (const room of testRooms) {
    try {
      await dynamodb.put({
        TableName: ROOMS_TABLE,
        Item: room
      }).promise();
      console.log(`✅ Sala creada: ${room.nombre} (${room.roomId})`);
    } catch (error) {
      console.error(`❌ Error creando sala ${room.roomId}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando población de datos de prueba...');
  console.log(`📍 Tabla de usuarios: ${USERS_TABLE}`);
  console.log(`📍 Tabla de salas: ${ROOMS_TABLE}`);
  console.log('');
  
  try {
    await populateUsers();
    console.log('');
    await populateRooms();
    console.log('');
    
    console.log('🎉 ¡Datos de prueba creados exitosamente!');
    console.log('');
    console.log('👥 Usuarios de prueba creados:');
    testUsers.forEach(user => {
      console.log(`   - ${user.nombre} (Cédula: ${user.cedula})`);
    });
    console.log('');
    console.log('🏛️ Salas del parque creadas:');
    testRooms.forEach(room => {
      console.log(`   - ${room.nombre} (${room.categoria})`);
    });
    console.log('');
    console.log('💡 Ahora puedes usar estos usuarios para probar el sistema:');
    console.log('   1. Ve a http://localhost:3000');
    console.log('   2. Ingresa cualquiera de las cédulas de prueba');
    console.log('   3. Completa la encuesta de satisfacción');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Verificar que se ejecute directamente
if (require.main === module) {
  main();
}

module.exports = {
  testUsers,
  testRooms,
  populateUsers,
  populateRooms
};
