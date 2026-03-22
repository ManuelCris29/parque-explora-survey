# 📚 Explicación Completa - Servicios AWS en Parque Explora Survey

## 🎯 Visión General

Tu proyecto es una **aplicación web serverless** (sin servidores tradicionales) que utiliza los servicios de AWS que ves en el panel:

```
┌─────────────────────────────────────────────────────────────────┐
│                       TU APLICACIÓN WEB                         │
│                    (Frontend + Backend)                         │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DynamoDB        API Gateway      Lambda         IAM            │
│  (Base de         (Puerta de      (Lógica)      (Permisos)      │
│   Datos)          entrada)                                      │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│      IAM Identity Center (Gestión de usuarios/acceso)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 LOS 5 SERVICIOS Y CÓMO FUNCIONAN

### 1️⃣ **DynamoDB** - Base de Datos (NoSQL)

**¿Qué es?**
- Base de datos **NoSQL** (no relacional) que guarda los datos en formato JSON
- Escalable automáticamente (si hay mucho tráfico, crece; si hay poco, se reduce)
- Paga solo por lo que usas

**¿Qué guarda en tu proyecto?**

```javascript
// TABLA 1: USUARIOS (Users Table)
{
  cedula: "1234567890",           // Identificador único (Primary Key)
  nombre: "Juan Pérez",
  email: "juan@email.com",
  telefono: "3001234567",
  boletaId: "uuid-123",
  fechaCompra: "2024-01-15",
  fechaCreacion: "2024-01-15T10:30:00Z",
  fechaActualizacion: "2024-01-15T10:30:00Z"
}

// TABLA 2: ENCUESTAS (Surveys Table)
{
  surveyId: "uuid-456",            // Identificador único
  cedula: "1234567890",            // Vinculado al usuario
  estado: "completed",
  calificacionGeneral: 5,
  salasVisitadas: ["Sala A", "Sala B"],
  salasFavoritas: ["Sala B"],
  comentarios: "¡Excelente experiencia!",
  fechaCreacion: "2024-01-15T10:30:00Z"
}

// TABLA 3: SALAS (Rooms Table)
{
  roomId: "room-001",
  nombre: "Sala Interactiva",
  descripcion: "Experiencias interactivas del parque",
  activa: true
}
```

**Ubicación en el código:**
```yaml
# archivo: template.yaml (línea ~20)
Resources:
  UsersTable:      # Tabla de usuarios
  SurveysTable:    # Tabla de encuestas
  RoomsTable:      # Tabla de salas
```

---

### 2️⃣ **API Gateway** - Puerta de Entrada (REST API)

**¿Qué es?**
- Es como la "puerta de entrada" de tu aplicación
- Recibe las peticiones HTTP del frontend
- Las dirige a las funciones Lambda correctas
- Maneja autenticación, CORS, rate limiting

**¿Qué hace en tu proyecto?**

Define los **endpoints** (puntos de acceso) que tu frontend usa:

```javascript
// ENDPOINTS DE USUARIOS
POST /users                      // Crear usuario
GET /users/{cedula}             // Obtener usuario por cédula
PUT /users/{cedula}             // Actualizar usuario
DELETE /users/{cedula}          // Eliminar usuario

// ENDPOINTS DE ENCUESTAS
POST /surveys                   // Crear encuesta
GET /surveys/{surveyId}         // Obtener encuesta
PUT /surveys/{surveyId}         // Actualizar encuesta
DELETE /surveys/{surveyId}      // Eliminar encuesta
GET /surveys/user/{cedula}      // Obtener encuestas de un usuario

// ENDPOINTS DE SALAS
GET /rooms                      // Obtener todas las salas

// ENDPOINTS DE ADMIN
GET /admin/users                // Ver todos los usuarios
GET /admin/surveys              // Ver todas las encuestas
```

**Ejemplo de flujo:**
```
1. Frontend hace: GET https://tu-api.amazonaws.com/users/1234567890
   (Incluye API Key en el header)
   
2. API Gateway valida:
   ✓ ¿Es un endpoint válido?
   ✓ ¿Es el método correcto (GET)?
   ✓ ¿Tiene API Key válida?
   
3. Si todo está bien, API Gateway redirige a Lambda
   
4. Lambda procesa y devuelve respuesta
```

**Ubicación en el código:**
```yaml
# archivo: template.yaml (línea ~80)
ParqueExploraApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: dev           # O "prod"
    Cors: ...                # Configuración CORS
    GatewayResponses: ...    # Manejo de errores
```

---

### 3️⃣ **Lambda** - Funciones (Lógica del Negocio)

**¿Qué es?**
- "Funciones sin servidor" que se ejecutan bajo demanda
- Solo se activan cuando se llama un endpoint
- Se ejecutan en Node.js 22.x
- Pagas solo el tiempo que están activas

**¿Qué hace en tu proyecto?**

Tienes **3 servicios** (3 funciones Lambda):

#### **Service 1: User Service** 📁 `backend/functions/userService/`

```javascript
// Funciones disponibles:

1. createUser(event)
   - Recibe: { cedula, nombre, email, telefono, boletaId }
   - Valida que no exista ya
   - Guarda en DynamoDB
   - Retorna: usuario creado

2. getUser(event)
   - Recibe: cedula
   - Busca en DynamoDB
   - Retorna: datos del usuario

3. updateUser(event)
   - Recibe: cedula + datos a actualizar
   - Actualiza en DynamoDB
   - Retorna: usuario actualizado

4. deleteUser(event)
   - Recibe: cedula
   - Elimina de DynamoDB
   - Retorna: confirmación

5. getAllUsers(event)
   - Sin parámetros
   - Obtiene TODOS los usuarios
   - Retorna: lista completa
```

#### **Service 2: Survey Service** 📁 `backend/functions/surveyService/`

```javascript
// Funciones disponibles:

1. createSurvey(event)
   - Recibe: { cedula, calificacionGeneral, comentarios, etc }
   - Valida que el usuario exista
   - Crea un surveyId único (UUID)
   - Guarda en DynamoDB
   - Retorna: encuesta creada

2. getSurvey(event)
   - Recibe: surveyId
   - Busca en DynamoDB
   - Retorna: datos de la encuesta

3. updateSurvey(event)
   - Recibe: surveyId + datos a actualizar
   - Actualiza estado (pending → completed)
   - Guarda cambios
   - Retorna: encuesta actualizada

4. deleteSurvey(event)
   - Recibe: surveyId
   - Elimina de DynamoDB
   - Retorna: confirmación

5. getSurveysByUser(event)
   - Recibe: cedula
   - Busca todas las encuestas de ese usuario
   - Usa índice CedulaIndex para búsqueda rápida
   - Retorna: lista de encuestas
```

#### **Service 3: Room Service** 📁 `backend/functions/roomService/`

```javascript
// Funciones disponibles:

1. getRooms(event)
   - Sin parámetros
   - Obtiene todas las salas
   - Retorna: lista de salas (Sala A, Sala B, etc)

2. createRoom(event)
   - Recibe: { roomId, nombre, descripcion }
   - Crea nueva sala
   - Retorna: sala creada

3. updateRoom(event)
   - Recibe: roomId + datos a actualizar
   - Actualiza la sala
   - Retorna: sala actualizada
```

**Ubicación en el código:**
```
backend/functions/
  ├── userService/index.js      (423 líneas)
  ├── surveyService/index.js    (539 líneas)
  └── roomService/index.js      (386 líneas)
```

---

### 4️⃣ **IAM** - Control de Acceso

**¿Qué es?**
- **Identity and Access Management** = Gestión de identidad y acceso
- Define quién puede hacer qué en AWS
- Basado en **roles** y **permisos**

**¿Cómo funciona en tu proyecto?**

```
Lambda Functions
     ↓
  ¿Puedo acceder a DynamoDB?
     ↓
IAM Role verifica permisos
     ↓
Si ✓ → Accede a DynamoDB
Si ✗ → Rechaza la solicitud
```

**Permisos que las Lambdas necesitan:**

```json
{
  "permissions": [
    "dynamodb:GetItem",      // Leer un elemento
    "dynamodb:PutItem",      // Crear un elemento
    "dynamodb:UpdateItem",   // Actualizar un elemento
    "dynamodb:DeleteItem",   // Eliminar un elemento
    "dynamodb:Scan",         // Listar elementos
    "dynamodb:Query",        // Buscar elementos
    "logs:CreateLogGroup",   // Crear logs en CloudWatch
    "logs:CreateLogStream",  // Crear stream de logs
    "logs:PutLogEvents"      // Escribir en logs
  ]
}
```

**Ubicación en el código:**
```yaml
# archivo: template.yaml (línea ~300+)
# Los roles se crean automáticamente con SAM CLI
```

---

### 5️⃣ **IAM Identity Center** - Gestión de Usuarios AWS

**¿Qué es?**
- Servicio para gestionar acceso a la consola de AWS
- Permite crear usuarios, grupos y asignar permisos
- En tu caso: **Es para TI** (el desarrollador/administrador), no para los visitantes del parque

**¿Para qué sirve en tu proyecto?**

```
Tú (desarrollador)
    ↓
Usas IAM Identity Center para loguear a AWS Console
    ↓
Puedes ver:
  - DynamoDB Dashboard
  - CloudWatch Logs
  - API Gateway
  - Funciones Lambda
  - Costos
```

---

## 🔄 FLUJO COMPLETO DE UNA ENCUESTA

Vamos a seguir un usuario desde que entra a tu aplicación:

### **Paso 1: Usuario accede a la web**
```
1. Abre: https://tu-app.com
2. Ve formulario: "Ingresa tu cédula"
```

### **Paso 2: Frontend busca si existe**
```javascript
// archivo: frontend/app/survey/page.tsx
fetch('https://tu-api.com/users/1234567890', {
  headers: {
    'X-Api-Key': 'parque-explora-api-key-2024'
  }
})
```

### **Paso 3: API Gateway recibe la solicitud**
```
API Gateway:
  ✓ Valida que tenga API Key correcta
  ✓ Valida que sea GET /users/{cedula}
  ✓ Redirige a Lambda → userService
```

### **Paso 4: Lambda userService se ejecuta**
```javascript
const getUser = async (event) => {
  const cedula = event.pathParameters.cedula;  // "1234567890"
  
  // Conecta a DynamoDB
  const command = new GetCommand({
    TableName: process.env.USERS_TABLE,  // "dev-parque-explora-users"
    Key: { cedula: cedula }
  });
  
  const result = await dynamodb.send(command);
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};
```

### **Paso 5: Consulta a DynamoDB**
```
DynamoDB Users Table:
  ├── cedula: "1234567890" ← BUSCA POR AQUÍ (Primary Key)
  ├── nombre: "Juan Pérez"
  ├── email: "juan@email.com"
  └── ... más datos
```

### **Paso 6: Respuesta regresa al Frontend**
```javascript
// Frontend recibe:
{
  cedula: "1234567890",
  nombre: "Juan Pérez",
  email: "juan@email.com",
  ...
}

// Y muestra: "Hola Juan, completa tu encuesta"
```

### **Paso 7: Usuario completa encuesta y hace clic en "Enviar"**
```javascript
// Frontend envía:
fetch('https://tu-api.com/surveys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'parque-explora-api-key-2024'
  },
  body: JSON.stringify({
    cedula: "1234567890",
    calificacionGeneral: 5,
    comentarios: "¡Excelente!"
  })
})
```

### **Paso 8: API Gateway → Lambda surveyService**
```javascript
const createSurvey = async (event) => {
  const body = JSON.parse(event.body);
  
  // 1. Valida que el usuario exista
  const userExists = await dynamodb.send(
    new GetCommand({ Key: { cedula: body.cedula } })
  );
  
  if (!userExists.Item) {
    return { statusCode: 404, body: 'Usuario no encontrado' };
  }
  
  // 2. Crea un ID único para la encuesta
  const surveyId = uuidv4();  // "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  
  // 3. Guarda en DynamoDB
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.SURVEYS_TABLE,
      Item: {
        surveyId: surveyId,
        cedula: body.cedula,
        calificacionGeneral: body.calificacionGeneral,
        estado: 'completed',
        fechaCreacion: new Date().toISOString()
      }
    })
  );
  
  return {
    statusCode: 201,
    body: JSON.stringify({ surveyId, mensaje: '¡Encuesta guardada!' })
  };
};
```

### **Paso 9: Datos guardados en DynamoDB**
```
DynamoDB Surveys Table:
  ├── surveyId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" (Primary Key)
  ├── cedula: "1234567890" (Foreign Key para búsquedas rápidas)
  ├── calificacionGeneral: 5
  ├── comentarios: "¡Excelente!"
  ├── estado: "completed"
  └── fechaCreacion: "2024-01-15T10:30:00Z"
```

### **Paso 10: Respuesta al Frontend**
```json
{
  "surveyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "mensaje": "¡Encuesta guardada!"
}
```

---

## 📊 FLUJO DE ADMIN

El administrador ve un panel donde puede:

### **1. Ver todos los usuarios**
```javascript
GET /admin/users

Lambda: surveyService.getAllUsers()
  ↓
DynamoDB.Scan(UsersTable)
  ↓
Retorna: [
  { cedula: "123", nombre: "Juan" },
  { cedula: "456", nombre: "María" },
  ...
]
```

### **2. Ver todas las encuestas**
```javascript
GET /admin/surveys

Lambda: surveyService.getAllSurveys()
  ↓
DynamoDB.Scan(SurveysTable)
  ↓
Retorna lista completa con estadísticas
```

### **3. Eliminar un usuario**
```javascript
DELETE /admin/users/1234567890

Lambda: userService.deleteUser()
  ↓
DynamoDB.DeleteItem(UsersTable, { cedula: "1234567890" })
  ↓
También elimina sus encuestas
```

---

## 🚀 CÓMO DESPLEGAR (SAM - Serverless Application Model)

El archivo `template.yaml` describe toda la infraestructura:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

# Define las tablas DynamoDB
Resources:
  UsersTable: ...
  SurveysTable: ...
  RoomsTable: ...
  
  # Define API Gateway
  ParqueExploraApi: ...
  
  # Define Lambda Functions
  UserServiceFunction: ...
  SurveyServiceFunction: ...
  RoomServiceFunction: ...
```

**Comandos para desplegar:**

```powershell
# 1. Construir la aplicación
sam build

# 2. Desplegar en AWS
sam deploy --guided

# El sistema te pregunta:
# - Nombre del stack: "parque-explora-survey-dev"
# - Región: "us-east-1"
# - Crear roles IAM: "Y" (Sí)

# 3. ¡Listo! AWS crea todo automáticamente:
#    - Tablas DynamoDB
#    - API Gateway con endpoints
#    - 3 Funciones Lambda
#    - Roles IAM con permisos
```

---

## 💰 COSTOS

**¿Cuánto cuesta?**

Con la capa gratuita de AWS (primer año):

| Servicio | Límite Gratis | Costo Extra |
|----------|---------------|------------|
| **DynamoDB** | 25 GB/mes | $1.25 por GB extra |
| **Lambda** | 1M invocaciones/mes | $0.0000002 por invocación |
| **API Gateway** | 1M llamadas/mes | $3.50 por millón extra |
| **Total** | ✓ GRATIS en año 1 | Mínimo si lo usas poco |

---

## 🔐 SEGURIDAD

### **¿Cómo está protegida tu aplicación?**

```
1. API Key en cada request
   ├── Solo personas que conocen la key pueden usar la API
   
2. CORS Configuration
   ├── Solo el frontend puede llamar a la API
   
3. IAM Roles
   ├── Las Lambdas solo pueden acceder a sus tablas
   
4. HTTPS (TLS Encryption)
   ├── Toda comunicación está encriptada
   
5. Validación de datos
   ├── Backend valida TODOS los datos
```

---

## 📝 PRÓXIMOS PASOS

### **Para continuar el proyecto, puedes:**

1. **Agregar autenticación de usuario real**
   - En lugar de solo validar cédula
   - Usar Cognito de AWS

2. **Mejorar análisis de datos**
   - Agregar más métricas
   - Exportar a Excel/PDF

3. **Agregar notificaciones**
   - Email cuando se complete una encuesta
   - SMS a administrador

4. **Mejorar el frontend**
   - Gráficos más avanzados
   - Filtros en el admin panel

5. **Agregar logs y monitoreo**
   - CloudWatch para ver qué sucede
   - Alertas si algo falla

---

## 📞 RESUMEN RÁPIDO

| Servicio | Función | Ubicación |
|----------|---------|-----------|
| **DynamoDB** | Almacena datos (usuarios, encuestas, salas) | AWS |
| **API Gateway** | Recibe requests del frontend | AWS |
| **Lambda** | Lógica de negocio (crear, leer, actualizar, eliminar) | `backend/functions/` |
| **IAM** | Permisos para que Lambda acceda a DynamoDB | AWS |
| **IAM Identity Center** | Tu acceso a la consola de AWS | AWS |

¡Espero que ahora entiendas cómo funciona tu proyecto! 🎉
