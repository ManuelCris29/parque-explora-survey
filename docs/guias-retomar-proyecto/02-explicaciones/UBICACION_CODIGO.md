# 🗂️ UBICACIÓN DEL CÓDIGO - DÓNDE ESTÁ TODO

Guía para encontrar rápidamente dónde está cada cosa en tu proyecto.

---

## 📍 TABLA RÁPIDA DE UBICACIONES

| Qué quiero | Ubicación | Tipo |
|-----------|-----------|------|
| Ver UI del usuario | `frontend/app/survey/page.tsx` | React/Next.js |
| Ver UI del admin | `frontend/app/admin/page.tsx` | React/Next.js |
| Gestionar usuarios | `backend/functions/userService/index.js` | Lambda |
| Gestionar encuestas | `backend/functions/surveyService/index.js` | Lambda |
| Obtener salas | `backend/functions/roomService/index.js` | Lambda |
| Definir tablas DB | `template.yaml` línea 20-70 | YAML |
| Definir endpoints API | `template.yaml` línea 80-150 | YAML |
| Estilos | `frontend/app/globals.css` | CSS |
| Estilos Tailwind | `frontend/tailwind.config.js` | JS |
| Variables de entorno | `frontend/.env.example` | .env |
| Configuración AWS | `samconfig.toml` | TOML |

---

## 🎯 FUNCIONALIDAD 1: BUSCAR USUARIO

### Paso 1: Usuario ingresa cédula (Frontend)
📁 **Archivo:** `frontend/app/survey/page.tsx`
```typescript
// Línea ~50-100 (aproximadamente)
// Función que busca usuario

const handleSearch = async () => {
  const response = await fetch(`${apiUrl}/users/${cedula}`, {
    headers: { 'X-Api-Key': apiKey }
  });
  // ...
};
```

### Paso 2: API Gateway recibe solicitud
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~150-200 (aproximadamente)
# Definición del endpoint GET /users/{cedula}

/users:
  get:
    x-amazon-apigateway-integration:
      httpMethod: POST
      type: aws_proxy
      uri: !Sub 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${UserServiceFunction.Arn}/invocations'
```

### Paso 3: Lambda procesa (Backend)
📁 **Archivo:** `backend/functions/userService/index.js`
```javascript
// Línea ~100-150 (aproximadamente)
// Función getUser

const getUser = async (event) => {
  const cedula = event.pathParameters.cedula;
  const command = new GetCommand({
    TableName: process.env.USERS_TABLE,
    Key: { cedula }
  });
  // ...
};
```

### Paso 4: DynamoDB retorna datos
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~20-40 (aproximadamente)
# Definición de tabla Users

Resources:
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Environment}-parque-explora-users'
      AttributeDefinitions:
        - AttributeName: cedula
          AttributeType: S
      KeySchema:
        - AttributeName: cedula
          KeyType: HASH
```

---

## 🎯 FUNCIONALIDAD 2: CREAR USUARIO

### Paso 1: Frontend envía formulario
📁 **Archivo:** `frontend/app/survey/page.tsx`
```typescript
// Línea ~200-250 (aproximadamente)
// Función que crea usuario

const handleRegister = async (formData) => {
  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: JSON.stringify(formData)
  });
  // ...
};
```

### Paso 2: Lambda valida y crea
📁 **Archivo:** `backend/functions/userService/index.js`
```javascript
// Línea ~45-85 (aproximadamente)
// Función createUser

const createUser = async (event) => {
  const body = JSON.parse(event.body);
  
  // Validaciones
  if (!body.cedula || !body.nombre || !body.email) {
    return { statusCode: 400, body: 'Datos requeridos' };
  }
  
  // Guardar
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.USERS_TABLE,
      Item: userData
    })
  );
};
```

### Paso 3: DynamoDB guarda
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~20-40
# Tabla Users (misma tabla anterior)
```

---

## 🎯 FUNCIONALIDAD 3: COMPLETAR ENCUESTA

### Paso 1: Usuario completa formulario (Frontend)
📁 **Archivo:** `frontend/app/survey/page.tsx`
```typescript
// Línea ~300-400 (aproximadamente)
// Componente del formulario de encuesta

const SurveyForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const handleSubmit = async () => {
    // Envía encuesta
  };
};
```

### Paso 2: API Gateway redirige a Lambda
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~170-190 (aproximadamente)
# Endpoint POST /surveys

/surveys:
  post:
    x-amazon-apigateway-integration:
      httpMethod: POST
      type: aws_proxy
      uri: !Sub 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${SurveyServiceFunction.Arn}/invocations'
```

### Paso 3: Lambda crea encuesta
📁 **Archivo:** `backend/functions/surveyService/index.js`
```javascript
// Línea ~25-100 (aproximadamente)
// Función createSurvey

const createSurvey = async (event) => {
  const { cedula, calificacionGeneral, comentarios } = JSON.parse(event.body);
  
  // Verificar que usuario existe
  const user = await dynamodb.send(
    new GetCommand({
      TableName: process.env.USERS_TABLE,
      Key: { cedula }
    })
  );
  
  // Crear encuesta
  const surveyId = uuidv4();
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.SURVEYS_TABLE,
      Item: {
        surveyId,
        cedula,
        calificacionGeneral,
        estado: 'completed',
        // ...
      }
    })
  );
};
```

### Paso 4: DynamoDB guarda encuesta
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~40-70 (aproximadamente)
# Tabla Surveys

Resources:
  SurveysTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Environment}-parque-explora-surveys'
      AttributeDefinitions:
        - AttributeName: surveyId
          AttributeType: S
        - AttributeName: cedula
          AttributeType: S
      KeySchema:
        - AttributeName: surveyId
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: CedulaIndex
          KeySchema:
            - AttributeName: cedula
              KeyType: HASH
```

---

## 🎯 FUNCIONALIDAD 4: VER ENCUESTAS EN ADMIN

### Paso 1: Admin abre panel
📁 **Archivo:** `frontend/app/admin/page.tsx`
```typescript
// Línea ~1-50 (aproximadamente)
// Componente Admin Panel

const AdminPanel = () => {
  const [surveys, setSurveys] = useState([]);
  
  useEffect(() => {
    fetchAllSurveys();
  }, []);
  
  const fetchAllSurveys = async () => {
    // Obtiene todas las encuestas
  };
};
```

### Paso 2: Lambda obtiene todas las encuestas
📁 **Archivo:** `backend/functions/surveyService/index.js`
```javascript
// Línea ~200-250 (aproximadamente)
// Función getAllSurveys

const getAllSurveys = async (event) => {
  const command = new ScanCommand({
    TableName: process.env.SURVEYS_TABLE
  });
  
  const result = await dynamodb.send(command);
  return result.Items;  // Todas las encuestas
};
```

### Paso 3: DynamoDB retorna datos
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~40-70
# Tabla Surveys (misma tabla anterior)
```

---

## 🏗️ INFRAESTRUCTURA - DÓNDE SE DEFINE

### Variables de entorno
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~8-20
# Todas las funciones Lambda reciben estas variables

Globals:
  Function:
    Timeout: 30
    Runtime: nodejs22.x
    Environment:
      Variables:
        USERS_TABLE: !Ref UsersTable
        SURVEYS_TABLE: !Ref SurveysTable
        ROOMS_TABLE: !Ref RoomsTable
        API_KEY: !Ref ApiKeyValue
```

### Permisos IAM
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~300+ (aproximadamente)
# Permisos para cada Lambda

UserServiceFunction:
  Type: AWS::Serverless::Function
  Properties:
    ...
    Policies:
      - DynamoDBCrudPolicy:
          TableName: !Ref UsersTable
```

### API Gateway CORS
📁 **Archivo:** `template.yaml`
```yaml
# Línea ~80-100 (aproximadamente)
# Configuración de CORS

ParqueExploraApi:
  Type: AWS::Serverless::Api
  Properties:
    Cors:
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
      AllowOrigin: "'*'"
```

---

## 🎨 FRONTEND - ESTRUCTURA DE COMPONENTES

```
frontend/
├── app/
│   ├── layout.tsx                    # Layout principal (navbar, estructura)
│   │
│   ├── page.tsx                      # Página de inicio
│   │   └── Componentes:
│   │       - Hero
│   │       - BusquedaUsuario
│   │       - UserCard
│   │
│   ├── survey/
│   │   └── page.tsx                  # Página de encuesta
│   │       └── Componentes:
│   │           - SurveyForm
│   │           - RatingSelector
│   │           - RoomSelector
│   │           - TextArea
│   │           - Submit Button
│   │
│   ├── admin/
│   │   └── page.tsx                  # Panel de administración
│   │       └── Componentes:
│   │           - AdminTable
│   │           - UserSearch
│   │           - Filters
│   │           - DeleteButton
│   │           - EditModal
│   │
│   └── globals.css                   # Estilos globales
│
├── lib/
│   ├── api.ts (si existe)            # Funciones de API
│   └── utils.ts (si existe)          # Funciones de utilidad
│
├── public/
│   └── ...                           # Logos, imágenes
│
├── package.json                      # Dependencias
├── tsconfig.json                     # Configuración TypeScript
├── tailwind.config.js                # Configuración Tailwind CSS
└── next.config.js                    # Configuración Next.js
```

---

## ⚙️ BACKEND - ESTRUCTURA DE FUNCIONES

### userService
```
backend/functions/userService/
├── index.js                          # ARCHIVO PRINCIPAL
│   ├── createUser()                  # POST /users
│   ├── getUser()                     # GET /users/{cedula}
│   ├── updateUser()                  # PUT /users/{cedula}
│   ├── deleteUser()                  # DELETE /users/{cedula}
│   └── getAllUsers()                 # GET /admin/users
│
└── package.json                      # Dependencias
    └── "dependencies": {
        "@aws-sdk/client-dynamodb": "^3.500.0",
        "@aws-sdk/lib-dynamodb": "^3.500.0",
        "uuid": "^9.0.0"
      }
```

### surveyService
```
backend/functions/surveyService/
├── index.js                          # ARCHIVO PRINCIPAL
│   ├── createSurvey()                # POST /surveys
│   ├── getSurvey()                   # GET /surveys/{surveyId}
│   ├── updateSurvey()                # PUT /surveys/{surveyId}
│   ├── deleteSurvey()                # DELETE /surveys/{surveyId}
│   ├── getSurveysByUser()            # GET /surveys/user/{cedula}
│   └── getAllSurveys()               # GET /admin/surveys
│
└── package.json
```

### roomService
```
backend/functions/roomService/
├── index.js                          # ARCHIVO PRINCIPAL
│   ├── getRooms()                    # GET /rooms
│   ├── createRoom()                  # POST /rooms
│   ├── updateRoom()                  # PUT /rooms/{roomId}
│   └── deleteRoom()                  # DELETE /rooms/{roomId}
│
└── package.json
```

---

## 🔧 CONFIGURACIÓN

### Variables de entorno (Frontend)
📁 **Archivo:** `frontend/.env.example`
```
NEXT_PUBLIC_API_URL=https://tu-api.com
NEXT_PUBLIC_API_KEY=parque-explora-api-key-2024
```

### Configuración SAM
📁 **Archivo:** `samconfig.toml`
```toml
version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "parque-explora-survey-dev"
s3_bucket = "..."
region = "us-east-1"
```

### Configuración TypeScript
📁 **Archivo:** `frontend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

---

## 📊 SCRIPTS DE AYUDA

### Poblar datos de prueba
📁 **Archivo:** `scripts/populate-test-data.ps1` (PowerShell) o `scripts/populate-test-data.js` (Node)
```powershell
# Ejecutar:
.\scripts\populate-test-data.ps1

# Hace:
# 1. Crea 10 usuarios de prueba
# 2. Crea 5 encuestas de prueba
# 3. Crea 3 salas de prueba
```

### Setup inicial
📁 **Archivo:** `scripts/setup.ps1` (PowerShell) o `scripts/setup.sh` (Linux/Mac)
```powershell
# Ejecutar:
.\scripts\setup.ps1

# Hace:
# 1. Instala dependencias Node
# 2. Configura AWS CLI
# 3. Instala SAM CLI
```

---

## 🔍 BUSCAR ALGO ESPECÍFICO

### "¿Dónde está la validación de email?"
→ `backend/functions/userService/index.js` línea ~55-70

### "¿Dónde se define la calificación?"
→ `backend/functions/surveyService/index.js` línea ~30-50

### "¿Dónde está el botón de eliminar?"
→ `frontend/app/admin/page.tsx` línea ~150-200

### "¿Dónde se configura CORS?"
→ `template.yaml` línea ~85-100

### "¿Dónde está el índice de encuestas por usuario?"
→ `template.yaml` línea ~55-65 (GlobalSecondaryIndexes)

### "¿Dónde se inicializa el cliente DynamoDB?"
→ `backend/functions/*/index.js` línea ~1-10

---

## 🎯 MODIFICAR ALGO - GUÍA RÁPIDA

### Quiero agregar un nuevo campo a usuarios
**Archivos a modificar:**
1. `backend/functions/userService/index.js` - Agregar en `createUser()`
2. `template.yaml` - Sin cambios (DynamoDB es flexible)
3. `frontend/app/survey/page.tsx` - Agregar input en formulario

### Quiero cambiar la estructura de una respuesta
**Archivo:**
- `backend/functions/{service}/index.js` - Modificar el JSON retornado

### Quiero agregar un nuevo endpoint
**Archivos a modificar:**
1. `backend/functions/{service}/index.js` - Agregar función
2. `template.yaml` - Agregar evento en el Path
3. `frontend/app/*.tsx` - Llamar al nuevo endpoint

### Quiero cambiar el style de la página
**Archivo:**
- `frontend/app/globals.css` - Modificar estilos CSS

---

## 🧪 TESTING - DÓNDE TESTEAR CADA COSA

### Testear Lambda en local
```powershell
sam local start-api
# Luego: curl http://localhost:3000/rooms
```

### Testear Frontend en local
```powershell
cd frontend
npm run dev
# Abre: http://localhost:3000
```

### Testear con Postman
```
1. Descargar Postman
2. Importar colección (si existe)
3. Cambiar {{api-url}} a tu URL
4. Cambiar {{api-key}} a tu API Key
5. Hacer click "Send"
```

---

## 📞 RESUMEN VISUAL

```
┌─────────────────────────────────────────┐
│   FRONTEND                              │
│   frontend/app/survey/page.tsx          │
│   frontend/app/admin/page.tsx           │
└────────────────┬────────────────────────┘
                 │ HTTP/HTTPS
                 ▼
┌─────────────────────────────────────────┐
│   API GATEWAY                           │
│   template.yaml (línea 80-150)          │
└────────────────┬────────────────────────┘
                 │ Invoke
                 ▼
┌─────────────────────────────────────────┐
│   LAMBDA FUNCTIONS                      │
│   backend/functions/*/index.js          │
│   - userService                         │
│   - surveyService                       │
│   - roomService                         │
└────────────────┬────────────────────────┘
                 │ Query/Put/Update/Delete
                 ▼
┌─────────────────────────────────────────┐
│   DYNAMODB                              │
│   template.yaml (línea 20-70)           │
│   - UsersTable                          │
│   - SurveysTable                        │
│   - RoomsTable                          │
└─────────────────────────────────────────┘
```

¡Ahora sabes exactamente dónde está todo! 🎉
