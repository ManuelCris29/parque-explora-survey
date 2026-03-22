# 💻 Ejemplos Prácticos - Cómo Usar los Servicios AWS

## 📌 Contenido
1. Cómo hacer solicitudes desde el Frontend
2. Estructura de respuestas del Backend
3. Manejo de errores
4. Testing manual
5. Debugging

---

## 1️⃣ CÓMO HACER SOLICITUDES DESDE EL FRONTEND

### **Ejemplo 1: Buscar un usuario**

```typescript
// archivo: frontend/app/survey/page.tsx

async function buscarUsuario(cedula: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // https://tu-api.com
  const apiKey = process.env.NEXT_PUBLIC_API_KEY; // parque-explora-api-key-2024

  try {
    const response = await fetch(`${apiUrl}/users/${cedula}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const usuario = await response.json();
    console.log('Usuario encontrado:', usuario);
    return usuario;

  } catch (error) {
    console.error('Error buscando usuario:', error);
    return null;
  }
}

// USO:
const usuario = await buscarUsuario('1234567890');
if (usuario) {
  console.log(`Hola ${usuario.nombre}, completa tu encuesta`);
} else {
  console.log('Usuario no encontrado');
}
```

### **Ejemplo 2: Crear un usuario**

```typescript
async function crearUsuario(datos: {
  cedula: string;
  nombre: string;
  email: string;
  telefono?: string;
  boletaId?: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error creando usuario');
    }

    const usuarioCreado = await response.json();
    return usuarioCreado;

  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// USO:
const nuevoUsuario = await crearUsuario({
  cedula: '1234567890',
  nombre: 'Juan Pérez',
  email: 'juan@email.com',
  telefono: '3001234567'
});

if (nuevoUsuario) {
  console.log('Usuario creado con éxito:', nuevoUsuario);
}
```

### **Ejemplo 3: Enviar una encuesta**

```typescript
async function enviarEncuesta(cedula: string, datos: {
  calificacionGeneral: number;
  salasVisitadas: string[];
  salasFavoritas: string[];
  salasParaRenovar: string[];
  comentarios: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const response = await fetch(`${apiUrl}/surveys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        cedula,
        ...datos
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error enviando encuesta');
    }

    const encuestaCreada = await response.json();
    return encuestaCreada;

  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// USO:
const encuesta = await enviarEncuesta('1234567890', {
  calificacionGeneral: 5,
  salasVisitadas: ['Sala Interactiva', 'Planetario'],
  salasFavoritas: ['Sala Interactiva'],
  salasParaRenovar: ['Entrada'],
  comentarios: '¡Excelente experiencia!'
});

if (encuesta) {
  console.log('¡Encuesta enviada:', encuesta.surveyId);
}
```

### **Ejemplo 4: Obtener salas disponibles**

```typescript
async function obtenerSalas() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const response = await fetch(`${apiUrl}/rooms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const salas = await response.json();
    return salas;

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// USO:
const salas = await obtenerSalas();
salas.forEach(sala => {
  console.log(`${sala.nombre}: ${sala.descripcion}`);
});
```

### **Ejemplo 5: Panel de Admin - Obtener todos los usuarios**

```typescript
async function obtenerTodosLosUsuarios() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const response = await fetch(`${apiUrl}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const usuarios = await response.json();
    return usuarios;

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// USO:
const usuarios = await obtenerTodosLosUsuarios();
console.log(`Total de usuarios: ${usuarios.length}`);
usuarios.forEach(usuario => {
  console.log(`- ${usuario.nombre} (${usuario.cedula})`);
});
```

---

## 2️⃣ ESTRUCTURA DE RESPUESTAS

### **Respuesta Exitosa - Crear Usuario (201 Created)**

```json
{
  "cedula": "1234567890",
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "boletaId": "abc123def456",
  "fechaCompra": "2024-01-15T00:00:00Z",
  "fechaCreacion": "2024-01-15T10:30:00Z",
  "fechaActualizacion": "2024-01-15T10:30:00Z"
}
```

### **Respuesta Exitosa - Crear Encuesta (201 Created)**

```json
{
  "surveyId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "cedula": "1234567890",
  "calificacionGeneral": 5,
  "salasVisitadas": ["Sala A", "Sala B"],
  "salasFavoritas": ["Sala B"],
  "comentarios": "¡Excelente!",
  "estado": "completed",
  "fechaCreacion": "2024-01-15T10:45:00Z",
  "fechaActualizacion": "2024-01-15T10:45:00Z"
}
```

### **Respuesta Exitosa - Obtener Salas (200 OK)**

```json
[
  {
    "roomId": "room-001",
    "nombre": "Sala Interactiva",
    "descripcion": "Experiencias interactivas para todas las edades",
    "activa": true,
    "fechaCreacion": "2024-01-01T00:00:00Z"
  },
  {
    "roomId": "room-002",
    "nombre": "Planetario",
    "descripcion": "Observatorio astronómico del parque",
    "activa": true,
    "fechaCreacion": "2024-01-01T00:00:00Z"
  }
]
```

### **Respuesta de Error - Usuario No Encontrado (404 Not Found)**

```json
{
  "error": "Usuario no encontrado"
}
```

### **Respuesta de Error - Datos Incompletos (400 Bad Request)**

```json
{
  "error": "Datos requeridos: cedula, nombre, email"
}
```

### **Respuesta de Error - No Autenticado (401 Unauthorized)**

```json
{
  "message": "Invalid API Key"
}
```

### **Respuesta de Error - Método No Permitido (405 Method Not Allowed)**

```json
{
  "error": "Método no permitido"
}
```

---

## 3️⃣ MANEJO DE ERRORES

### **Crear un servicio de error handling reutilizable**

```typescript
// archivo: frontend/lib/apiClient.ts

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class ApiClient {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

    if (!this.apiUrl || !this.apiKey) {
      throw new Error('API URL o API Key no configuradas');
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.apiUrl}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error || 'Error desconocido',
          statusCode: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status
      };

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error de conexión';

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

### **Usar el cliente de API**

```typescript
// archivo: frontend/app/survey/page.tsx

import { apiClient } from '@/lib/apiClient';

async function manejarEncuesta() {
  // Buscar usuario
  const usuarioResponse = await apiClient.get('/users/1234567890');

  if (!usuarioResponse.success) {
    console.error('Error:', usuarioResponse.error);
    // Mostrar mensaje de error al usuario
    return;
  }

  const usuario = usuarioResponse.data;
  console.log(`Hola ${usuario.nombre}`);

  // Obtener salas
  const salasResponse = await apiClient.get('/rooms');

  if (!salasResponse.success) {
    console.error('Error obteniendo salas:', salasResponse.error);
    return;
  }

  const salas = salasResponse.data;

  // Crear encuesta
  const encuestaResponse = await apiClient.post('/surveys', {
    cedula: usuario.cedula,
    calificacionGeneral: 5,
    salasVisitadas: salas.map(s => s.roomId),
    comentarios: 'Excelente'
  });

  if (!encuestaResponse.success) {
    console.error('Error:', encuestaResponse.error);
    return;
  }

  console.log('¡Encuesta guardada!');
}
```

---

## 4️⃣ TESTING MANUAL (Sin usar herramientas especiales)

### **Opción 1: Usar Postman o Thunder Client**

1. **Descargar Postman** desde https://www.postman.com/downloads/
2. **Crear una nueva solicitud GET**:
   ```
   URL: https://tu-api.com/rooms
   Headers:
     - Key: X-Api-Key
     - Value: parque-explora-api-key-2024
   ```
3. **Click en Send** y ver la respuesta

### **Opción 2: Usar PowerShell**

```powershell
# Test 1: Obtener salas
$apiUrl = "https://tu-api.com"
$apiKey = "parque-explora-api-key-2024"

$response = Invoke-WebRequest `
  -Uri "$apiUrl/rooms" `
  -Headers @{ 'X-Api-Key' = $apiKey } `
  -Method GET

$response.Content | ConvertFrom-Json | Format-Table

# Test 2: Crear usuario
$newUser = @{
  cedula = "9876543210"
  nombre = "María García"
  email = "maria@email.com"
  telefono = "3009876543"
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "$apiUrl/users" `
  -Headers @{
    'Content-Type' = 'application/json'
    'X-Api-Key' = $apiKey
  } `
  -Method POST `
  -Body $newUser

$response.Content | ConvertFrom-Json | Format-Table
```

### **Opción 3: Usar curl (en PowerShell)**

```powershell
# Test: Obtener salas
curl.exe -X GET "https://tu-api.com/rooms" `
  -H "X-Api-Key: parque-explora-api-key-2024"

# Test: Crear usuario
$body = @{
  cedula = "9876543210"
  nombre = "María García"
  email = "maria@email.com"
} | ConvertTo-Json

curl.exe -X POST "https://tu-api.com/users" `
  -H "Content-Type: application/json" `
  -H "X-Api-Key: parque-explora-api-key-2024" `
  -d $body
```

---

## 5️⃣ DEBUGGING

### **Ver los logs de Lambda**

```powershell
# 1. Listar las funciones Lambda
aws lambda list-functions --region us-east-1

# 2. Ver logs de una función específica
aws logs tail /aws/lambda/parque-explora-survey-dev-UserServiceFunction --follow

# 3. Ver logs con timestamps
aws logs tail /aws/lambda/parque-explora-survey-dev-UserServiceFunction --follow --format short
```

### **Ver errores en CloudWatch**

```powershell
# 1. Ir a AWS Console
# 2. CloudWatch > Logs > Log Groups
# 3. Buscar: /aws/lambda/parque-explora-survey-dev-*
# 4. Ver los eventos
```

### **Agregar logs a tu Lambda**

```javascript
// archivo: backend/functions/userService/index.js

const createUser = async (event) => {
  console.log('[DEBUG] Evento recibido:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('[INFO] Datos del usuario:', body);

    if (!body.cedula || !body.nombre || !body.email) {
      console.error('[ERROR] Datos incompletos:', body);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Datos requeridos' })
      };
    }

    const userData = {
      cedula: body.cedula,
      nombre: body.nombre,
      email: body.email,
      // ... más datos
    };

    console.log('[INFO] Guardando usuario en DynamoDB:', userData);

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: userData
      })
    );

    console.log('[INFO] Usuario guardado exitosamente');

    return {
      statusCode: 201,
      body: JSON.stringify(userData)
    };

  } catch (error) {
    console.error('[ERROR] Error al crear usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
```

### **Exportar logs para análisis**

```powershell
# Obtener logs de los últimos 60 minutos
aws logs filter-log-events `
  --log-group-name "/aws/lambda/parque-explora-survey-dev-UserServiceFunction" `
  --start-time (Get-Date).AddMinutes(-60).Ticks `
  --region us-east-1 | ConvertTo-Json
```

---

## 📈 MONITOREO EN TIEMPO REAL

### **Ver cuántas invocaciones tienes (métricas)**

```powershell
# Invocaciones de Lambda en los últimos 5 minutos
aws cloudwatch get-metric-statistics `
  --namespace AWS/Lambda `
  --metric-name Invocations `
  --dimensions Name=FunctionName,Value=parque-explora-survey-dev-UserServiceFunction `
  --start-time (Get-Date).AddMinutes(-5) `
  --end-time (Get-Date) `
  --period 300 `
  --statistics Sum
```

### **Ver errores de Lambda**

```powershell
aws cloudwatch get-metric-statistics `
  --namespace AWS/Lambda `
  --metric-name Errors `
  --dimensions Name=FunctionName,Value=parque-explora-survey-dev-UserServiceFunction `
  --start-time (Get-Date).AddMinutes(-60) `
  --end-time (Get-Date) `
  --period 300 `
  --statistics Sum
```

---

## 🎯 CHECKLIST PARA AGREGAR UNA NUEVA FUNCIONALIDAD

1. **Planificar la solicitud HTTP**
   ```
   METHOD /endpoint
   Headers: Content-Type, X-Api-Key
   Body: { datos }
   ```

2. **Agregar la función en Lambda**
   ```javascript
   export const miNuevaFuncion = async (event) => { ... }
   ```

3. **Conectarla en template.yaml**
   ```yaml
   /mi-endpoint:
     post:
       x-amazon-apigateway-integration:
         httpMethod: POST
         type: aws_proxy
         uri: !Sub 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${MiNuevaFuncion.Arn}/invocations'
   ```

4. **Testar desde frontend**
   ```typescript
   const response = await apiClient.post('/mi-endpoint', datos);
   ```

5. **Desplegar**
   ```powershell
   sam build
   sam deploy
   ```

¡Listo! 🚀
