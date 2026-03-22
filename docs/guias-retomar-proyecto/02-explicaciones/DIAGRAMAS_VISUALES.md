# 🎨 DIAGRAMA VISUAL - CÓMO FUNCIONA TODO JUNTO

## 📱 FLUJO COMPLETO: Desde el Usuario Hasta la Base de Datos

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         1. USUARIO VISITA LA WEB                                │
│                                                                                 │
│                        "Ingresa tu cédula: 1234567890"                          │
│                                                                                 │
│                    (Frontend - Next.js en Puerto 3000)                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Usuario ingresa cédula
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    2. FRONTEND HACE SOLICITUD HTTP GET                          │
│                                                                                 │
│  fetch('https://api.ejemplo.com/users/1234567890', {                          │
│    headers: {                                                                   │
│      'X-Api-Key': 'parque-explora-api-key-2024'                                │
│    }                                                                            │
│  })                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS/REST API
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      3. API GATEWAY RECIBE LA SOLICITUD                         │
│                                                                                 │
│  ✓ Valida que tenga API Key correcta                                           │
│  ✓ Valida que sea un método GET                                                │
│  ✓ Valida que sea un endpoint registrado                                       │
│  ✓ Verifica CORS (¿viene de un origen permitido?)                              │
│                                                                                 │
│  Si todo está bien: Redirige a Lambda                                          │
│  Si hay error: Retorna error inmediatamente                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Invoke Lambda
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    4. LAMBDA FUNCTION SE EJECUTA                                │
│                    (userService - backend/functions/userService/)               │
│                                                                                 │
│  const getUser = async (event) => {                                            │
│    const cedula = event.pathParameters.cedula;  // "1234567890"               │
│                                                                                 │
│    const command = new GetCommand({                                            │
│      TableName: process.env.USERS_TABLE,  // "dev-parque-explora-users"       │
│      Key: { cedula: cedula }                                                   │
│    });                                                                          │
│                                                                                 │
│    const result = await dynamodb.send(command);                                │
│    // Aquí AWS SDK conecta a DynamoDB                                          │
│  }                                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Query DynamoDB
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        5. DYNAMODB BUSCA EN LA TABLA                            │
│                                                                                 │
│  Tabla: dev-parque-explora-users                                               │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ cedula (Primary Key) │ nombre          │ email            │ telefono     │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │ "1234567890"         │ "Juan Pérez"    │ "juan@email.com" │ "300123456" │  │
│  │ "9876543210"         │ "María García"  │ "maria@email.com"│ "300654321" │  │
│  │ "5555555555"         │ "Carlos López"  │ "carlos@email.co"│ "300111111" │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  DynamoDB encuentra: cedula = "1234567890" ✓                                   │
│  Retorna el registro completo                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Retorna datos
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        6. LAMBDA PROCESA EL RESULTADO                           │
│                                                                                 │
│  return {                                                                       │
│    statusCode: 200,                                                            │
│    headers: getCorsHeaders(),                                                  │
│    body: JSON.stringify({                                                      │
│      cedula: "1234567890",                                                     │
│      nombre: "Juan Pérez",                                                     │
│      email: "juan@email.com",                                                  │
│      telefono: "3001234567",                                                   │
│      boletaId: "uuid-123",                                                     │
│      fechaCompra: "2024-01-15",                                                │
│      fechaCreacion: "2024-01-15T10:30:00Z"                                     │
│    })                                                                           │
│  };                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS Response
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      7. API GATEWAY RETORNA LA RESPUESTA                        │
│                                                                                 │
│  Status: 200 OK                                                                │
│  Headers: CORS, Content-Type, etc                                              │
│  Body: JSON del usuario                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Response JSON
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        8. FRONTEND RECIBE LA RESPUESTA                          │
│                                                                                 │
│  const usuario = await response.json();                                        │
│  // usuario = { cedula: "1234567890", nombre: "Juan Pérez", ... }            │
│                                                                                 │
│  console.log(`Hola ${usuario.nombre}, completa tu encuesta`);                 │
│  // Muestra: "Hola Juan Pérez, completa tu encuesta"                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE CREAR UNA ENCUESTA

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    USUARIO COMPLETA ENCUESTA Y HACE CLIC                        │
│                                                                                 │
│                    "Enviar Encuesta" (Botón POST)                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│              FRONTEND ENVÍA (POST REQUEST CON DATOS)                            │
│                                                                                 │
│  fetch('https://api.ejemplo.com/surveys', {                                    │
│    method: 'POST',                                                              │
│    headers: {                                                                   │
│      'Content-Type': 'application/json',                                        │
│      'X-Api-Key': 'parque-explora-api-key-2024'                                │
│    },                                                                           │
│    body: JSON.stringify({                                                      │
│      cedula: "1234567890",                                                     │
│      calificacionGeneral: 5,                                                   │
│      salasVisitadas: ["Sala Interactiva", "Planetario"],                       │
│      salasFavoritas: ["Sala Interactiva"],                                     │
│      comentarios: "¡Excelente experiencia!"                                    │
│    })                                                                           │
│  })                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  API GATEWAY VALIDA Y REDIRIGE A LAMBDA                         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│              LAMBDA SURVEY SERVICE EJECUTA LÓGICA                               │
│                                                                                 │
│  1. Valida que el usuario exista:                                              │
│     GET Users Table WHERE cedula = "1234567890"                                │
│     ✓ Usuario existe                                                           │
│                                                                                 │
│  2. Crea un ID único para la encuesta:                                         │
│     surveyId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"                         │
│                                                                                 │
│  3. Prepara los datos para guardar:                                            │
│     {                                                                           │
│       surveyId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",                       │
│       cedula: "1234567890",                                                    │
│       calificacionGeneral: 5,                                                  │
│       salasVisitadas: ["Sala Interactiva", "Planetario"],                      │
│       salasFavoritas: ["Sala Interactiva"],                                    │
│       comentarios: "¡Excelente experiencia!",                                  │
│       estado: "completed",                                                     │
│       fechaCreacion: "2024-01-15T10:45:00Z",                                   │
│       fechaActualizacion: "2024-01-15T10:45:00Z"                              │
│     }                                                                           │
│                                                                                 │
│  4. Guarda en DynamoDB:                                                        │
│     PUT Surveys Table WITH datos                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│           DYNAMODB GUARDA EN LA TABLA SURVEYS                                   │
│                                                                                 │
│  Tabla: dev-parque-explora-surveys                                             │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ surveyId                           │ cedula      │ calificacion │ ...  │   │
│  ├────────────────────────────────────────────────────────────────────────┤   │
│  │ "a1b2c3d4-e5f6..."                 │ "123456..."│ 5            │ ...  │   │
│  │ "xyz789abc..."                     │ "987654..."│ 4            │ ...  │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ✓ Encuesta guardada exitosamente                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│              LAMBDA RETORNA RESPUESTA DE ÉXITO                                  │
│                                                                                 │
│  Status: 201 Created                                                           │
│  Body: {                                                                        │
│    surveyId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",                          │
│    mensaje: "¡Encuesta guardada!",                                             │
│    cedula: "1234567890"                                                        │
│  }                                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│              FRONTEND MUESTRA MENSAJE DE ÉXITO                                  │
│                                                                                 │
│                  "¡Gracias! Tu encuesta fue enviada"                           │
│                                                                                 │
│                    [Botón: Volver al inicio]                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 👤 PANEL DE ADMIN - FLUJO DE DATOS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      ADMINISTRADOR ACCEDE AL PANEL                              │
│                                                                                 │
│                      (Frontend - Página /admin)                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Admin hace clic en "Ver Usuarios"
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   FRONTEND SOLICITA LISTA DE USUARIOS                           │
│                                                                                 │
│  fetch('https://api.ejemplo.com/admin/users', {                               │
│    headers: { 'X-Api-Key': 'parque-explora-api-key-2024' }                     │
│  })                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   LAMBDA SURVEY SERVICE EJECUTA                                 │
│                                                                                 │
│  const getAllUsers = async (event) => {                                        │
│    const command = new ScanCommand({                                           │
│      TableName: process.env.USERS_TABLE                                        │
│    });                                                                          │
│    const result = await dynamodb.send(command);                                │
│    return result.Items;  // TODOS los usuarios                                 │
│  }                                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   DYNAMODB RETORNA TODOS LOS USUARIOS                           │
│                                                                                 │
│  [                                                                              │
│    {                                                                            │
│      cedula: "1234567890",                                                     │
│      nombre: "Juan Pérez",                                                     │
│      email: "juan@email.com",                                                  │
│      ...                                                                        │
│    },                                                                           │
│    {                                                                            │
│      cedula: "9876543210",                                                     │
│      nombre: "María García",                                                   │
│      email: "maria@email.com",                                                 │
│      ...                                                                        │
│    },                                                                           │
│    ...                                                                          │
│  ]                                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   FRONTEND MUESTRA TABLA CON USUARIOS                           │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ Cédula      │ Nombre         │ Email                │ Acciones       │   │
│  ├────────────────────────────────────────────────────────────────────────┤   │
│  │ 1234567890  │ Juan Pérez     │ juan@email.com       │ Editar Eliminar│   │
│  │ 9876543210  │ María García   │ maria@email.com      │ Editar Eliminar│   │
│  │ 5555555555  │ Carlos López   │ carlos@email.co      │ Editar Eliminar│   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│              Admin hace clic en "Eliminar" para Juan Pérez                     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│               FRONTEND SOLICITA ELIMINAR USUARIO                                │
│                                                                                 │
│  fetch('https://api.ejemplo.com/admin/users/1234567890', {                    │
│    method: 'DELETE',                                                            │
│    headers: { 'X-Api-Key': 'parque-explora-api-key-2024' }                     │
│  })                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  LAMBDA ELIMINA DE DYNAMODB                                     │
│                                                                                 │
│  const deleteUser = async (event) => {                                         │
│    const cedula = event.pathParameters.cedula;                                 │
│    await dynamodb.send(                                                        │
│      new DeleteCommand({                                                       │
│        TableName: process.env.USERS_TABLE,                                     │
│        Key: { cedula }                                                         │
│      })                                                                         │
│    );                                                                           │
│  }                                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   USUARIO ELIMINADO DE DYNAMODB                                 │
│                                                                                 │
│  Tabla Users ANTES:       Tabla Users DESPUÉS:                                 │
│  ┌──────────────────┐     ┌──────────────────┐                                │
│  │ 1234567890 ✓     │     │ 1234567890 ✗ ❌  │                                │
│  │ 9876543210 ✓     │  →  │ 9876543210 ✓     │                                │
│  │ 5555555555 ✓     │     │ 5555555555 ✓     │                                │
│  └──────────────────┘     └──────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   FRONTEND ACTUALIZA LA TABLA                                   │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ Cédula      │ Nombre         │ Email                │ Acciones       │   │
│  ├────────────────────────────────────────────────────────────────────────┤   │
│  │ 9876543210  │ María García   │ maria@email.com      │ Editar Eliminar│   │
│  │ 5555555555  │ Carlos López   │ carlos@email.co      │ Editar Eliminar│   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│                  "¡Usuario eliminado exitosamente!"                            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 SEGURIDAD - CÓMO SE PROTEGE LA API

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND ENVÍA SOLICITUD HTTP                             │
│                                                                              │
│  fetch('https://api.ejemplo.com/users/1234567890', {                       │
│    headers: {                                                                │
│      'X-Api-Key': 'parque-explora-api-key-2024',  ← REQUISITO 1            │
│      'Content-Type': 'application/json'           ← REQUISITO 2            │
│    }                                                                         │
│  })                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              PASO 1: VALIDAR PROTOCOLO HTTPS (TLS)                          │
│                                                                              │
│  ❌ http://api.ejemplo.com/users  → RECHAZADO (sin encriptación)           │
│  ✓ https://api.ejemplo.com/users → ACEPTADO (encriptación SSL/TLS)         │
│                                                                              │
│  La comunicación está encriptada entre Frontend y AWS                       │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              PASO 2: VALIDAR API KEY                                         │
│                                                                              │
│  Header: X-Api-Key = "parque-explora-api-key-2024"                          │
│                                                                              │
│  API Gateway verifica:                                                      │
│    ✓ ¿Está la key en la solicitud?                                          │
│    ✓ ¿Es válida la key?                                                     │
│    ✓ ¿Está activa?                                                          │
│                                                                              │
│  Si falla: Retorna 403 Forbidden                                            │
│  Si pasa: Continúa                                                          │
│                                                                              │
│  ❌ Sin API Key          → RECHAZADO                                        │
│  ❌ API Key incorrecta   → RECHAZADO                                        │
│  ✓ API Key correcta     → ACEPTADO                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              PASO 3: VALIDAR ENDPOINT                                        │
│                                                                              │
│  ¿Es un endpoint registrado?                                                │
│                                                                              │
│  ❌ GET /usuarios             → RECHAZADO (no existe)                       │
│  ❌ POST /users               → RECHAZADO (espera GET)                      │
│  ✓ GET /users/1234567890     → ACEPTADO                                     │
│                                                                              │
│  Si falla: Retorna 404 Not Found o 405 Method Not Allowed                   │
│  Si pasa: Continúa                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              PASO 4: VALIDAR CORS                                            │
│                                                                              │
│  Origin de la solicitud: https://parque-explora.com                         │
│                                                                              │
│  ¿Está permitido este origen?                                               │
│                                                                              │
│  CORS Config en template.yaml:                                              │
│    AllowOrigin: "'*'"  ← PERMITE CUALQUIER ORIGEN                          │
│                                                                              │
│  ✓ Solicitud aceptada                                                      │
│                                                                              │
│  (En producción: restringir a AllowOrigin: "'https://parque-explora.com'") │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              PASO 5: INVOCAR LAMBDA CON PERMISOS IAM                        │
│                                                                              │
│  API Gateway → Lambda Function                                              │
│                                                                              │
│  IAM Role del Lambda verifica:                                              │
│    ✓ ¿Puede acceder a DynamoDB?                                             │
│    ✓ ¿Puede solo leer (GetItem)?                                            │
│    ✓ ¿Puede acceder a la tabla users?                                       │
│                                                                              │
│  Políticas IAM:                                                             │
│    - DynamoDBReadPolicy → Solo lectura                                      │
│    - DynamoDBCrudPolicy → Lectura, creación, actualización, eliminación     │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              PASO 6: VALIDAR DATOS EN LAMBDA                                │
│                                                                              │
│  const createUser = async (event) => {                                      │
│    const { cedula, nombre, email } = JSON.parse(event.body);               │
│                                                                              │
│    // Validar datos
│    if (!cedula || !nombre || !email) {                                      │
│      return { statusCode: 400, body: 'Datos incompletos' };                │
│    }                                                                         │
│                                                                              │
│    // Validar formato
│    if (!email.includes('@')) {                                              │
│      return { statusCode: 400, body: 'Email inválido' };                    │
│    }                                                                         │
│  }                                                                           │
│                                                                              │
│  Si datos son inválidos: Rechaza la solicitud                               │
│  Si datos son válidos: Continúa                                             │
└──────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              ✓ SOLICITUD ACEPTADA - PROCESA EN DYNAMODB                      │
│                                                                              │
│  Todos los controles de seguridad pasaron:                                  │
│    ✓ HTTPS encriptado                                                       │
│    ✓ API Key válida                                                         │
│    ✓ Endpoint válido                                                        │
│    ✓ CORS permitido                                                         │
│    ✓ Permisos IAM correctos                                                 │
│    ✓ Datos validados                                                        │
│                                                                              │
│  Ahora sí: Accede a DynamoDB y ejecuta la operación                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 CASOS DE ERROR

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ERROR 1: API KEY INCORRECTA                           │
│                                                                              │
│  fetch('https://api.ejemplo.com/users/1234567890', {                       │
│    headers: { 'X-Api-Key': 'LLAVE-INCORRECTA' }                            │
│  })                                                                          │
│                                                                              │
│  API Gateway verifica la key → RECHAZADA ❌                                 │
│                                                                              │
│  Respuesta:                                                                 │
│  Status: 403 Forbidden                                                      │
│  Body: { "message": "Invalid API Key" }                                    │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                      ERROR 2: USUARIO NO ENCONTRADO                          │
│                                                                              │
│  fetch('https://api.ejemplo.com/users/9999999999', {                       │
│    headers: { 'X-Api-Key': 'parque-explora-api-key-2024' }                  │
│  })                                                                          │
│                                                                              │
│  Lambda busca en DynamoDB: cedula = "9999999999"                            │
│  Resultado: No encuentra el registro ❌                                     │
│                                                                              │
│  Respuesta:                                                                 │
│  Status: 404 Not Found                                                      │
│  Body: { "error": "Usuario no encontrado" }                                │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                      ERROR 3: DATOS INCOMPLETOS                              │
│                                                                              │
│  fetch('https://api.ejemplo.com/users', {                                  │
│    method: 'POST',                                                           │
│    body: JSON.stringify({                                                   │
│      nombre: "Juan",                  // FALTA: cedula, email               │
│      email: "juan@email.com"                                                │
│    })                                                                        │
│  })                                                                          │
│                                                                              │
│  Lambda valida: ¿cedula? ❌ ¿nombre? ✓ ¿email? ✓                           │
│  Resultado: Datos incompletos ❌                                            │
│                                                                              │
│  Respuesta:                                                                 │
│  Status: 400 Bad Request                                                    │
│  Body: { "error": "Datos requeridos: cedula, nombre, email" }             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                   ERROR 4: ERROR INTERNO (DYNAMODB)                          │
│                                                                              │
│  Lambda intenta acceder a DynamoDB pero falla:                              │
│    - Tabla no existe                                                         │
│    - Permiso IAM insuficiente                                                │
│    - Timeout de conexión                                                    │
│                                                                              │
│  Respuesta:                                                                 │
│  Status: 500 Internal Server Error                                          │
│  Body: { "error": "Error interno del servidor" }                           │
│                                                                              │
│  Cómo debuggear:                                                            │
│    1. Ver logs en CloudWatch                                                │
│    2. Verificar permisos IAM                                                │
│    3. Verificar si la tabla existe                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 COSTOS - CÓMO SE CALCULA

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          EJEMPLO DE UN MES                                   │
│                                                                              │
│  Supongamos: 10,000 visitantes/mes hacen encuestas                         │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        1. LAMBDA (Invocaciones)                              │
│                                                                              │
│  Cada solicitud HTTP = 1 invocación de Lambda                               │
│  10,000 usuarios × 3 solicitudes (buscar, crear encuesta, guardar)         │
│  = 30,000 invocaciones/mes                                                  │
│                                                                              │
│  Capa gratuita: 1,000,000 invocaciones/mes                                  │
│  30,000 < 1,000,000 ✓                                                       │
│                                                                              │
│  Costo: $0 (dentro de la capa gratuita)                                     │
│                                                                              │
│  Si lo usaras mucho más:                                                    │
│    Precio: $0.0000002 por invocación adicional                              │
│    Ejemplo: 5,000,000 invocaciones = (5M - 1M) × $0.0000002 = $0.80        │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                      2. DYNAMODB (Lecturas/Escrituras)                       │
│                                                                              │
│  Modo: PAY_PER_REQUEST (pagas por operación)                                │
│                                                                              │
│  Capa gratuita: 25 GB de almacenamiento/mes                                 │
│  25 GB = muchas operaciones de lectura/escritura                            │
│                                                                              │
│  Ejemplo de uso:                                                             │
│    - 10,000 usuarios registrados × 0.5 KB = 5 MB                            │
│    - 10,000 encuestas × 1 KB = 10 MB                                        │
│    - Total: ~15 MB (muy por debajo de 25 GB)                                │
│                                                                              │
│  Costo: $0 (dentro de la capa gratuita)                                     │
│                                                                              │
│  Si usaras mucho más:                                                       │
│    Lecturas: $0.25 por millón de unidades de lectura                        │
│    Escrituras: $1.25 por millón de unidades de escritura                    │
│    Almacenamiento: $0.25 por GB                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                    3. API GATEWAY (Llamadas a API)                           │
│                                                                              │
│  Capa gratuita: 1,000,000 llamadas a API/mes                                │
│  30,000 < 1,000,000 ✓                                                       │
│                                                                              │
│  Costo: $0 (dentro de la capa gratuita)                                     │
│                                                                              │
│  Si usaras mucho más:                                                       │
│    Precio: $3.50 por millón de llamadas adicionales                         │
│    Ejemplo: 2,000,000 llamadas = (2M - 1M) × $3.50 = $3.50                │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          RESUMEN DE COSTOS                                   │
│                                                                              │
│  Mes 1-12 (Capa gratuita de AWS primer año):                               │
│    Lambda:      $0 (1M invocaciones gratis)                                 │
│    DynamoDB:    $0 (25 GB gratis)                                           │
│    API Gateway: $0 (1M llamadas gratis)                                     │
│    ────────────────                                                         │
│    TOTAL:       $0 ✓ GRATIS                                                 │
│                                                                              │
│  Mes 13+ (Sin capa gratuita):                                               │
│    Con 10,000 usuarios haciendo 3 solicitudes c/u:                          │
│    Lambda:      ~$0.01 (30,000 invocaciones)                                │
│    DynamoDB:    ~$0.01 (15 MB de datos)                                     │
│    API Gateway: ~$0.10 (30,000 llamadas)                                    │
│    ────────────────────                                                     │
│    TOTAL:       ~$0.12/mes (MUY BARATO)                                     │
│                                                                              │
│  BENEFICIO: Pagas SOLO si tu app se usa.                                    │
│  Si nadie la usa = COSTO CERO                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

¡Ahora tienes una visión completa de cómo funciona tu proyecto! 🎉
