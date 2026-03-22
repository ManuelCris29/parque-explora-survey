# Guía de Testing - Parque Explora Survey

## 🧪 Casos de Prueba del Sistema

### 1. Validación de Cédula

#### ✅ Casos Válidos
```bash
# Cédulas válidas
12345678    # 8 dígitos
1234567890  # 10 dígitos
123456789012345 # 15 dígitos (máximo)
```

#### ❌ Casos Inválidos
```bash
# Solo números - filtrado automático
abc123      → 123
12 34 56    → 123456
12-34-56    → 123456
12@34#56    → 123456

# Longitud mínima
12345       # Error: mínimo 6 dígitos
```

### 2. Estados de Encuesta

#### 🔄 Flujo Normal
1. Usuario no existe → "Usuario no registrado"
2. Usuario existe, sin encuesta → Crear encuesta automáticamente
3. Usuario existe, encuesta pending → Acceder a encuesta
4. Usuario existe, encuesta in_progress → Continuar encuesta
5. Usuario existe, encuesta completed → "Ya completaste la encuesta"

#### 🚫 Validaciones
- **Una encuesta por día**: Si ya completó hoy, no puede crear otra
- **No edición de completadas**: Encuestas completed no son editables
- **Usuario pre-registrado**: Solo usuarios existentes pueden crear encuestas

### 3. API Endpoints

#### POST /users
```bash
# Request válido
curl -X POST https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/users \
  -H "x-api-key: REPLACE_WITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678",
    "nombre": "Juan Pérez",
    "email": "juan@email.com"
  }'

# Response esperado: 201 Created
```

#### GET /users/{cedula}
```bash
# Usuario existente
curl -X GET https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/users/12345678 \
  -H "x-api-key: REPLACE_WITH_API_KEY"

# Response esperado: 200 OK con datos del usuario

# Usuario no existente
curl -X GET https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/users/99999999 \
  -H "x-api-key: REPLACE_WITH_API_KEY"

# Response esperado: 404 Not Found
```

#### POST /surveys
```bash
# Crear encuesta para usuario existente
curl -X POST https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/surveys \
  -H "x-api-key: REPLACE_WITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678"
  }'

# Response esperado: 201 Created con surveyId
```

#### GET /surveys/user/{cedula}
```bash
# Encuesta existente
curl -X GET https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/surveys/user/12345678 \
  -H "x-api-key: REPLACE_WITH_API_KEY"

# Response esperado: 200 OK con datos de encuesta y usuario
```

#### PUT /surveys/{surveyId}
```bash
# Actualizar encuesta
curl -X PUT https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/surveys/survey-uuid \
  -H "x-api-key: REPLACE_WITH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "completed",
    "salasVisitadas": ["sala-1", "sala-2"],
    "calificacionGeneral": 4
  }'

# Response esperado: 200 OK
```

### 4. Autenticación

#### ✅ API Key Válida
```bash
x-api-key: REPLACE_WITH_API_KEY
```

#### ❌ API Key Inválida
```bash
x-api-key: invalid-key
# Response: 403 Forbidden
```

#### ❌ Sin API Key
```bash
# Sin header x-api-key
# Response: 403 Forbidden
```

### 5. Frontend Testing

#### Pantalla Principal
1. **Campo cédula**:
   - ✅ Acepta solo números
   - ✅ Máximo 15 caracteres
   - ✅ Mínimo 6 caracteres para enviar
   - ❌ Filtra letras, espacios, símbolos

2. **Botón "Acceder a Encuesta"**:
   - ✅ Habilitado solo con cédula válida
   - ✅ Muestra loading durante búsqueda
   - ✅ Muestra mensajes de error apropiados

#### Flujo de Usuario
1. **Usuario no registrado**:
   - Mensaje: "Usuario no registrado"
   - Botón: "Buscar otra cédula"

2. **Usuario con encuesta completada**:
   - Mensaje: "Ya completaste la encuesta"
   - Botón: "Buscar otra cédula"

3. **Usuario con encuesta pendiente**:
   - Redirige a formulario de encuesta
   - Carga datos existentes si los hay

### 6. Datos de Prueba

#### Usuarios de Prueba
```json
{
  "cedula": "12345678",
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567"
}
```

#### Encuesta de Prueba
```json
{
  "surveyId": "test-survey-001",
  "cedula": "12345678",
  "estado": "completed",
  "salasVisitadas": ["sala-1", "sala-2"],
  "salasFavoritas": ["sala-1"],
  "calificacionGeneral": 4
}
```

### 7. Casos Edge

#### Límites y Validaciones
- **Cédula duplicada**: No se puede crear usuario con cédula existente
- **Encuesta duplicada**: No se puede crear encuesta si ya existe una activa
- **Estado inválido**: Solo acepta pending, in_progress, completed
- **Datos faltantes**: Validación de campos requeridos

#### Performance
- **Tiempo de respuesta**: < 2 segundos para operaciones normales
- **Concurrencia**: Múltiples usuarios simultáneos
- **Rate limiting**: Configurado en API Gateway

## 🔧 Herramientas de Testing

### Postman Collection
```json
{
  "info": {
    "name": "Parque Explora API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://your-api.amazonaws.com/dev"
    },
    {
      "key": "apiKey",
      "value": "REPLACE_WITH_API_KEY"
    }
  ]
}
```

### Scripts de Testing
```bash
# Test completo del sistema
npm run test:full

# Test de API endpoints
npm run test:api

# Test de frontend
npm run test:frontend
```

## 📊 Métricas de Calidad

### Cobertura de Testing
- **Backend**: 95%+ cobertura de funciones
- **Frontend**: 90%+ cobertura de componentes
- **API**: 100% endpoints probados

### Performance
- **Tiempo de carga**: < 3 segundos
- **Disponibilidad**: 99.9% uptime
- **Escalabilidad**: 1000+ usuarios concurrentes

