# 🚀 GUÍA PARA CONTINUAR EL DESARROLLO

Ahora que entiendes cómo funciona el proyecto, aquí está la guía para modificar, agregar nuevas funcionalidades y hacer cambios.

---

## 📋 TABLA DE CONTENIDOS

1. [Cómo modificar una función Lambda existente](#1-cómo-modificar-una-función-lambda-existente)
2. [Cómo agregar un nuevo endpoint](#2-cómo-agregar-un-nuevo-endpoint)
3. [Cómo agregar una nueva tabla a DynamoDB](#3-cómo-agregar-una-nueva-tabla-a-dynamodb)
4. [Cómo desplegar cambios](#4-cómo-desplegar-cambios)
5. [Troubleshooting común](#5-troubleshooting-común)

---

## 1️⃣ CÓMO MODIFICAR UNA FUNCIÓN LAMBDA EXISTENTE

### **Paso 1: Identifica qué quieres cambiar**

Digamos que quieres **agregar un campo más al usuario** (ej: "ciudad"):

### **Paso 2: Abre la función Lambda**

```
backend/functions/userService/index.js
```

### **Paso 3: Encuentra la función `createUser`**

```javascript
const createUser = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { cedula, nombre, email, telefono, fechaCompra, boletaId } = body;
    
    // Aquí validamos
    if (!cedula || !nombre || !email) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ 
          error: 'Datos requeridos: cedula, nombre, email' 
        })
      };
    }

    // Aquí creamos el usuario
    const userData = {
      cedula,
      nombre,
      email,
      telefono: telefono || '',
      fechaCompra: fechaCompra || new Date().toISOString(),
      boletaId: boletaId || uuidv4(),
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    // Aquí lo guardamos en DynamoDB
    const command = new PutCommand({
      TableName: process.env.USERS_TABLE,
      Item: userData,
      ConditionExpression: 'attribute_not_exists(cedula)',
      ReturnValues: 'ALL_OLD'
    });

    await dynamodb.send(command);
    
    return {
      statusCode: 201,
      headers: getCorsHeaders(),
      body: JSON.stringify(userData)
    };

  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ error: 'Error interno' })
    };
  }
};
```

### **Paso 4: Modifica la función**

Para agregar el campo "ciudad":

```javascript
const createUser = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    // CAMBIO 1: Agregamos "ciudad" aquí
    const { cedula, nombre, email, telefono, fechaCompra, boletaId, ciudad } = body;
    
    // CAMBIO 2: Validamos que ciudad sea requerida (o no, según necesites)
    if (!cedula || !nombre || !email) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ 
          error: 'Datos requeridos: cedula, nombre, email' 
        })
      };
    }

    // CAMBIO 3: Agregamos ciudad a los datos del usuario
    const userData = {
      cedula,
      nombre,
      email,
      telefono: telefono || '',
      ciudad: ciudad || '',  // NUEVO CAMPO
      fechaCompra: fechaCompra || new Date().toISOString(),
      boletaId: boletaId || uuidv4(),
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: process.env.USERS_TABLE,
      Item: userData,
      ConditionExpression: 'attribute_not_exists(cedula)',
      ReturnValues: 'ALL_OLD'
    });

    await dynamodb.send(command);
    
    return {
      statusCode: 201,
      headers: getCorsHeaders(),
      body: JSON.stringify(userData)
    };

  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ error: 'Error interno' })
    };
  }
};
```

### **Paso 5: Prueba localmente** (opcional)

Si tienes AWS SAM instalado, puedes probar localmente:

```powershell
# En la raíz del proyecto
sam build
sam local start-api
```

### **Paso 6: Desplega**

```powershell
sam deploy
```

---

## 2️⃣ CÓMO AGREGAR UN NUEVO ENDPOINT

Digamos que quieres agregar un endpoint para **obtener el promedio de calificaciones**:

### **Paso 1: Crea una nueva función Lambda**

1. Crea una carpeta:
```
backend/functions/analyticsService/
```

2. Crea el archivo:
```
backend/functions/analyticsService/index.js
```

3. Agrega el código:

```javascript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const getCorsHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
});

// Obtener estadísticas de encuestas
const getSurveyStats = async (event) => {
  try {
    // 1. Obtener todas las encuestas
    const command = new ScanCommand({
      TableName: process.env.SURVEYS_TABLE
    });

    const result = await dynamodb.send(command);
    const surveys = result.Items || [];

    // 2. Calcular estadísticas
    if (surveys.length === 0) {
      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify({
          totalEncuestas: 0,
          promedioCalificacion: 0,
          calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        })
      };
    }

    const stats = {
      totalEncuestas: surveys.length,
      promedioCalificacion: 0,
      calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      encuestasCompletadas: surveys.filter(s => s.estado === 'completed').length,
      encuestasPendientes: surveys.filter(s => s.estado === 'pending').length
    };

    // 3. Sumar calificaciones
    let sumaCalificaciones = 0;
    surveys.forEach(survey => {
      if (survey.calificacionGeneral) {
        sumaCalificaciones += survey.calificacionGeneral;
        stats.calificaciones[survey.calificacionGeneral]++;
      }
    });

    // 4. Calcular promedio
    stats.promedioCalificacion = sumaCalificaciones / surveys.length;

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify(stats)
    };

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ error: 'Error obteniendo estadísticas' })
    };
  }
};

export const handler = async (event) => {
  console.log('Evento recibido:', JSON.stringify(event));

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  if (event.resource === '/admin/stats' && event.httpMethod === 'GET') {
    return getSurveyStats(event);
  }

  return {
    statusCode: 404,
    headers: getCorsHeaders(),
    body: JSON.stringify({ error: 'Endpoint no encontrado' })
  };
};
```

4. Crea `package.json`:

```json
{
  "name": "analytics-service",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.500.0",
    "@aws-sdk/lib-dynamodb": "^3.500.0"
  }
}
```

### **Paso 2: Actualiza `template.yaml`**

1. Abre `template.yaml`

2. Busca la sección `Resources:` y agrega:

```yaml
  # Analytics Service Function
  AnalyticsServiceFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${Environment}-parque-explora-analytics'
      CodeUri: backend/functions/analyticsService/
      Handler: index.handler
      Runtime: nodejs22.x
      Timeout: 30
      Environment:
        Variables:
          SURVEYS_TABLE: !Ref SurveysTable
          API_KEY: !Ref ApiKeyValue
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref SurveysTable
      Events:
        GetStatsEvent:
          Type: Api
          Properties:
            RestApiId: !Ref ParqueExploraApi
            Path: /admin/stats
            Method: GET
```

3. Busca la sección `Outputs:` (al final del archivo) y asegúrate de que tenga:

```yaml
Outputs:
  ApiEndpoint:
    Description: API Gateway endpoint
    Value: !Sub 'https://${ParqueExploraApi}.execute-api.${AWS::Region}.amazonaws.com/${Environment}'
  
  AnalyticsServiceFunctionArn:
    Description: Analytics Service Function ARN
    Value: !GetAtt AnalyticsServiceFunction.Arn
```

### **Paso 3: Desplega**

```powershell
sam build
sam deploy
```

### **Paso 4: Prueba el nuevo endpoint**

```powershell
$apiUrl = "https://tu-api.com"
$apiKey = "parque-explora-api-key-2024"

$response = Invoke-WebRequest `
  -Uri "$apiUrl/admin/stats" `
  -Headers @{ 'X-Api-Key' = $apiKey } `
  -Method GET

$response.Content | ConvertFrom-Json
```

Debería retornar:

```json
{
  "totalEncuestas": 10,
  "promedioCalificacion": 4.5,
  "calificaciones": { "1": 0, "2": 1, "3": 0, "4": 4, "5": 5 },
  "encuestasCompletadas": 10,
  "encuestasPendientes": 0
}
```

---

## 3️⃣ CÓMO AGREGAR UNA NUEVA TABLA A DYNAMODB

Digamos que quieres agregar una tabla para **comentarios adicionales**:

### **Paso 1: Abre `template.yaml`**

### **Paso 2: Busca donde están las tablas existentes**

```yaml
Resources:
  # DynamoDB Tables
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Environment}-parque-explora-users'
      ...
  
  SurveysTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Environment}-parque-explora-surveys'
      ...
```

### **Paso 3: Agrega una nueva tabla**

```yaml
  CommentsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Environment}-parque-explora-comments'
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: commentId
          AttributeType: S
        - AttributeName: surveyId
          AttributeType: S
      KeySchema:
        - AttributeName: commentId
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: SurveyIdIndex
          KeySchema:
            - AttributeName: surveyId
              KeyType: HASH
          Projection:
            ProjectionType: ALL
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES
```

### **Paso 4: Actualiza las variables de entorno**

Busca `Globals:` y agrega:

```yaml
Globals:
  Function:
    Timeout: 30
    Runtime: nodejs22.x
    Environment:
      Variables:
        USERS_TABLE: !Ref UsersTable
        SURVEYS_TABLE: !Ref SurveysTable
        ROOMS_TABLE: !Ref RoomsTable
        COMMENTS_TABLE: !Ref CommentsTable  # NUEVO
        API_KEY: !Ref ApiKeyValue
```

### **Paso 5: Desplega**

```powershell
sam build
sam deploy
```

AWS automáticamente creará la nueva tabla.

---

## 4️⃣ CÓMO DESPLEGAR CAMBIOS

### **Opción 1: Desplegar a desarrollo (recomendado primero)**

```powershell
# Paso 1: Construir
sam build

# Paso 2: Desplegar (sin preguntar)
sam deploy --no-confirm-changeset
```

### **Opción 2: Desplegar a producción**

```powershell
# Paso 1: Construir
sam build

# Paso 2: Desplegar de forma guiada (te pregunta dónde)
sam deploy --guided

# Responde:
# Stack Name: parque-explora-survey-prod
# AWS Region: us-east-1
# Parameter Environment: prod
# ...
```

### **Opción 3: Ver cambios antes de desplegar**

```powershell
sam build
sam deploy --no-execute-changeset

# Esto te muestra qué va a cambiar
# Si ves que está bien, ejecuta:
aws cloudformation execute-change-set --change-set-name ParqueExploraChangeSet
```

---

## 5️⃣ TROUBLESHOOTING COMÚN

### **Problema 1: "Error: Access Denied to DynamoDB"**

**Causa**: La función Lambda no tiene permisos.

**Solución**: Asegúrate de que la función tiene `Policies` en `template.yaml`:

```yaml
MyFunction:
  Type: AWS::Serverless::Function
  Properties:
    ...
    Policies:
      - DynamoDBReadPolicy:
          TableName: !Ref MiTabla
      - DynamoDBCrudPolicy:
          TableName: !Ref MiTabla
```

---

### **Problema 2: "Error: CORS issue"**

**Causa**: El frontend no puede llamar la API.

**Solución**: Verifica que `template.yaml` tenga CORS configurado:

```yaml
ParqueExploraApi:
  Type: AWS::Serverless::Api
  Properties:
    Cors:
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
      AllowOrigin: "'*'"
```

---

### **Problema 3: "Error: Invalid API Key"**

**Causa**: El frontend no está enviando la API Key correctamente.

**Solución**: Verifica el header en tu request:

```javascript
headers: {
  'X-Api-Key': 'parque-explora-api-key-2024'  // Exactamente así
}
```

---

### **Problema 4: "Error: Function not found"**

**Causa**: La función Lambda no está mapeada correctamente.

**Solución**: Verifica que los `Events` estén correctos en `template.yaml`:

```yaml
MyFunction:
  Type: AWS::Serverless::Function
  Properties:
    ...
    Events:
      GetEvent:
        Type: Api
        Properties:
          RestApiId: !Ref ParqueExploraApi
          Path: /mi-endpoint  # Debe ser exacto
          Method: GET          # Debe ser exacto
```

---

### **Problema 5: Cambios no se ven después de desplegar**

**Causa**: Probablemente no ejecutaste `sam build` antes de `sam deploy`.

**Solución**:

```powershell
# SIEMPRE: build primero, deploy después
sam build
sam deploy
```

---

### **Problema 6: "Error: Table does not exist"**

**Causa**: El nombre de la tabla no coincide entre `template.yaml` y el código.

**Solución**: Verifica que sea idéntico:

```yaml
# template.yaml
UsersTable:
  Properties:
    TableName: !Sub '${Environment}-parque-explora-users'
```

```javascript
// Lambda function
const command = new GetCommand({
  TableName: process.env.USERS_TABLE,  // Debe ser: dev-parque-explora-users
  Key: { cedula }
});
```

---

## 📝 CHECKLIST ANTES DE DESPLEGAR

- [ ] ¿Ejecuté `sam build`?
- [ ] ¿Probé localmente con `sam local start-api`?
- [ ] ¿Revisé que no hay errores de sintaxis?
- [ ] ¿Verifiqué que los nombres de tablas coinciden?
- [ ] ¿Agregué permisos IAM si creé funciones nuevas?
- [ ] ¿Actualicé `template.yaml` si hay cambios?
- [ ] ¿Testeé con Postman/PowerShell antes de desplegar?

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Agregar más campos a usuarios**: (ej: "ciudad", "edad")
2. **Crear estadísticas avanzadas**: Gráficos de ratings por sala
3. **Agregar notificaciones por email**: Cuando se completa una encuesta
4. **Mejorar el panel de admin**: Exportar a Excel, filtros avanzados
5. **Agregar autenticación real**: En lugar de solo validar cédula

¡Ahora estás listo para continuar! 🚀
