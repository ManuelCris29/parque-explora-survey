# 🎯 **ESTUDIO COMPLETO LÍNEA POR LÍNEA - PARQUE EXPLORA**

---

## 📋 **GUÍA DE ESTUDIO INTENSIVO PARA ENTREVISTA TÉCNICA**

### **Objetivo:** Dominar cada línea de código, cada decisión técnica y cada concepto AWS

---

# 🚀 **LAMBDA FUNCTION 1: createUser**

## **ANÁLISIS LÍNEA POR LÍNEA**

### **Líneas 1-4: Imports y Configuración**
```javascript
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();
```

**¿Qué hace cada línea?**
- **Línea 1:** Importa el SDK de AWS para interactuar con servicios AWS
- **Línea 2:** Importa la función uuidv4 para generar IDs únicos
- **Línea 4:** Crea cliente DynamoDB DocumentClient (maneja JSON automáticamente)

**¿Por qué estas decisiones?**
- **AWS SDK:** Necesario para conectarse a DynamoDB
- **uuidv4:** Genera IDs únicos para boletaId
- **DocumentClient:** Convierte automáticamente JavaScript objects ↔ DynamoDB items

### **Líneas 6-12: Headers CORS**
```javascript
exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    };
```

**¿Qué hace cada línea?**
- **Línea 6:** Define la función handler (punto de entrada de Lambda)
- **Línea 7:** Content-Type JSON para respuestas
- **Línea 8:** Permite requests desde cualquier origen (*)
- **Línea 9:** Headers permitidos (incluye x-api-key)
- **Línea 10:** Métodos HTTP permitidos

**¿Por qué estas decisiones?**
- **CORS:** Permite que el frontend haga requests desde localhost:3000
- **Headers específicos:** Incluye x-api-key para autenticación
- **Métodos:** Solo POST (crear) y OPTIONS (preflight)

### **Líneas 14-22: Manejo de OPTIONS (CORS Preflight)**
```javascript
try {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }
```

**¿Qué hace?**
- **CORS Preflight:** Los navegadores envían OPTIONS antes de POST
- **Respuesta 200:** Confirma que el método POST está permitido

**¿Por qué es necesario?**
- **Navegadores:** Envían OPTIONS automáticamente para requests complejos
- **CORS:** Sin esto, el frontend no puede hacer requests

### **Líneas 24-30: Validación de Método HTTP**
```javascript
if (event.httpMethod !== 'POST') {
    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método no permitido' })
    };
}
```

**¿Qué hace?**
- **405 Method Not Allowed:** Solo permite POST
- **Seguridad:** Previene uso incorrecto del endpoint

### **Líneas 32-46: Parsing y Validación de Datos**
```javascript
const body = JSON.parse(event.body || '{}');
const { cedula, nombre, email, telefono, fechaCompra, boletaId } = body;

if (!cedula || !nombre || !email) {
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
            error: 'Datos requeridos: cedula, nombre, email' 
        })
    };
}
```

**¿Qué hace cada línea?**
- **Línea 32:** Parsea JSON del body (con fallback a {} si es null)
- **Línea 33:** Destructuring para extraer campos
- **Línea 35:** Validación de campos requeridos
- **Línea 36-44:** Error 400 Bad Request si faltan campos

**¿Por qué estas decisiones?**
- **Validación temprana:** Falla rápido si faltan datos críticos
- **400 vs 500:** 400 = error del cliente, 500 = error del servidor
- **Campos requeridos:** cedula, nombre, email son obligatorios para el negocio

### **Líneas 48-58: Construcción del Objeto Usuario**
```javascript
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
```

**¿Qué hace cada línea?**
- **Línea 48:** Objeto con datos del usuario
- **Línea 51:** telefono con fallback a string vacío
- **Línea 52:** fechaCompra con fallback a fecha actual
- **Línea 53:** boletaId con fallback a UUID generado
- **Línea 54-55:** Timestamps de auditoría

**¿Por qué estas decisiones?**
- **Fallbacks:** Valores por defecto para campos opcionales
- **UUID:** ID único para cada boleta
- **Timestamps:** Auditoría de cuándo se creó/actualizó
- **ISO String:** Formato estándar para fechas

### **Líneas 60-68: Configuración DynamoDB**
```javascript
const params = {
    TableName: process.env.USERS_TABLE,
    Item: userData,
    ConditionExpression: 'attribute_not_exists(cedula) OR attribute_exists(cedula)',
    ReturnValues: 'ALL_OLD'
};
```

**¿Qué hace cada línea?**
- **Línea 61:** Nombre de la tabla desde variable de entorno
- **Línea 62:** Datos a guardar
- **Línea 63:** Condición que siempre es verdadera (upsert)
- **Línea 64:** Retorna el item anterior (si existe)

**¿Por qué estas decisiones?**
- **Variable de entorno:** Permite diferentes tablas por ambiente
- **Upsert:** Crea si no existe, actualiza si existe
- **ConditionExpression:** Siempre verdadera = upsert
- **ReturnValues:** Para debugging y logs

### **Líneas 68-77: Ejecución y Respuesta**
```javascript
const result = await dynamodb.put(params).promise();

return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
        message: 'Usuario creado/actualizado exitosamente',
        data: userData
    })
};
```

**¿Qué hace cada línea?**
- **Línea 68:** Ejecuta PUT en DynamoDB (async/await)
- **Línea 70:** Respuesta 201 Created
- **Línea 74:** Mensaje de éxito
- **Línea 75:** Datos del usuario creado

### **Líneas 79-91: Manejo de Errores**
```javascript
} catch (error) {
    console.error('Error:', error);
    
    return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
            error: 'Error interno del servidor',
            message: error.message
        })
    };
}
```

**¿Qué hace cada línea?**
- **Línea 80:** Log del error en CloudWatch
- **Línea 83:** Respuesta 500 Internal Server Error
- **Línea 85:** Mensaje genérico para el cliente
- **Línea 86:** Mensaje específico del error

---

# 🔍 **LAMBDA FUNCTION 2: getUser**

## **ANÁLISIS LÍNEA POR LÍNEA**

### **Líneas 1-11: Setup Similar a createUser**
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
    };
```

**Diferencias clave:**
- **Método:** GET en lugar de POST
- **Sin uuid:** No necesita generar IDs

### **Líneas 31-42: Extracción de Path Parameters**
```javascript
const cedula = event.pathParameters?.cedula;

if (!cedula) {
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
            error: 'Cédula es requerida' 
        })
    };
}
```

**¿Qué hace?**
- **Optional chaining (?.):** Evita error si pathParameters es null
- **Validación:** Asegura que la cédula esté presente

### **Líneas 44-52: Query DynamoDB**
```javascript
const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
        cedula: cedula
    }
};

const result = await dynamodb.get(params).promise();
```

**¿Qué hace?**
- **GET operation:** Búsqueda por clave primaria
- **Performance:** O(1) - muy rápido
- **Key:** Usa cedula como clave primaria

### **Líneas 54-71: Manejo de Resultados**
```javascript
if (!result.Item) {
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
            error: 'Usuario no encontrado' 
        })
    };
}

return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
        message: 'Usuario encontrado',
        data: result.Item
    })
};
```

**¿Qué hace?**
- **404:** Si no existe el usuario
- **200:** Si existe, retorna los datos

---

# 📝 **LAMBDA FUNCTION 3: createSurvey**

## **ANÁLISIS LÍNEA POR LÍNEA**

### **Líneas 66-76: Verificación de Encuesta Existente**
```javascript
const existingSurveyParams = {
    TableName: process.env.SURVEYS_TABLE,
    IndexName: 'CedulaIndex',
    KeyConditionExpression: 'cedula = :cedula',
    ExpressionAttributeValues: {
        ':cedula': cedula
    }
};

const existingSurvey = await dynamodb.query(existingSurveyParams).promise();
```

**¿Qué hace cada línea?**
- **IndexName:** Usa GSI (Global Secondary Index) por cédula
- **KeyConditionExpression:** Query por cédula
- **ExpressionAttributeValues:** Valores seguros (previene injection)

**¿Por qué GSI?**
- **SurveysTable:** Clave primaria es surveyId
- **Búsqueda por cédula:** Necesita índice secundario
- **Performance:** Query en lugar de scan

### **Líneas 78-94: Lógica de Negocio - Prevenir Duplicados**
```javascript
if (existingSurvey.Items && existingSurvey.Items.length > 0) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastSurvey = existingSurvey.Items[0];
    const lastSurveyDate = lastSurvey.fechaActualizacion.split('T')[0];
    
    if (lastSurvey.estado === 'completed' && lastSurveyDate === today) {
        return {
            statusCode: 409,
            headers,
            body: JSON.stringify({ 
                error: 'Ya completaste la encuesta hoy. Solo puedes completar una encuesta por día.',
                surveyId: lastSurvey.surveyId,
                completedToday: true
            })
        };
    }
}
```

**¿Qué hace cada línea?**
- **Línea 79:** Formato de fecha YYYY-MM-DD
- **Línea 80:** Última encuesta del usuario
- **Línea 81:** Fecha de la última encuesta
- **Línea 83:** Si está completada hoy
- **Línea 84-93:** Error 409 Conflict

**¿Por qué esta lógica?**
- **Regla de negocio:** Una encuesta por día
- **409 Conflict:** Indica recurso ya existe
- **completedToday:** Flag para el frontend

### **Líneas 96-106: Prevenir Encuestas Pendientes**
```javascript
if (lastSurvey.estado === 'pending' || lastSurvey.estado === 'in_progress') {
    return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ 
            error: 'Ya existe una encuesta para este usuario',
            surveyId: lastSurvey.surveyId
        })
    };
}
```

**¿Qué hace?**
- **Estados:** pending, in_progress, completed
- **Prevenir duplicados:** No crear si ya hay una pendiente

### **Líneas 109-121: Creación de Nueva Encuesta**
```javascript
const surveyData = {
    surveyId: uuidv4(),
    cedula,
    estado: 'pending',
    salasVisitadas: [],
    salasFavoritas: [],
    salasParaRenovar: [],
    calificacionGeneral: null,
    comentarios: '',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
};
```

**¿Qué hace cada línea?**
- **surveyId:** UUID único
- **estado:** Comienza como 'pending'
- **Arrays vacíos:** Para salas visitadas/favoritas
- **null:** Para calificación (no definida aún)

---

# 🔄 **LAMBDA FUNCTION 4: updateSurvey**

## **ANÁLISIS LÍNEA POR LÍNEA**

### **Líneas 47-73: Validación de Campos Permitidos**
```javascript
const allowedFields = [
    'salasVisitadas',
    'salasFavoritas', 
    'salasParaRenovar',
    'calificacionGeneral',
    'comentarios',
    'estado'
];

const updateData = {};
allowedFields.forEach(field => {
    if (body[field] !== undefined) {
        updateData[field] = body[field];
    }
});
```

**¿Qué hace?**
- **Whitelist:** Solo campos permitidos pueden actualizarse
- **Seguridad:** Previene actualización de campos críticos
- **undefined check:** Solo incluye campos que vienen en el request

### **Líneas 78-84: Construcción de UpdateExpression**
```javascript
const updateExpression = 'SET ' + Object.keys(updateData).map(key => `${key} = :${key}`).join(', ');
const expressionAttributeValues = {};
Object.keys(updateData).forEach(key => {
    expressionAttributeValues[`:${key}`] = updateData[key];
});
```

**¿Qué hace cada línea?**
- **Línea 78:** Construye "SET campo1 = :valor1, campo2 = :valor2"
- **Línea 79:** Objeto para valores
- **Línea 80-82:** Asigna valores con prefijo :

**¿Por qué esta complejidad?**
- **UpdateExpression:** Sintaxis específica de DynamoDB
- **ExpressionAttributeValues:** Previene inyección SQL
- **Dinámico:** Solo actualiza campos enviados

### **Líneas 85-96: Ejecución del Update**
```javascript
const params = {
    TableName: process.env.SURVEYS_TABLE,
    Key: {
        surveyId: surveyId
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
};

const result = await dynamodb.update(params).promise();
```

**¿Qué hace cada línea?**
- **Key:** surveyId como clave primaria
- **ReturnValues:** Retorna el item actualizado

---

# 🗑️ **LAMBDA FUNCTION 5: deleteUser**

## **ANÁLISIS LÍNEA POR LÍNEA**

### **Líneas 72-95: Eliminación en Cascada**
```javascript
const surveysParams = {
    TableName: process.env.SURVEYS_TABLE,
    FilterExpression: 'cedula = :cedula',
    ExpressionAttributeValues: {
        ':cedula': cedula
    }
};

const surveysResult = await dynamodb.scan(surveysParams).promise();

if (surveysResult.Items && surveysResult.Items.length > 0) {
    const deletePromises = surveysResult.Items.map(survey => {
        return dynamodb.delete({
            TableName: process.env.SURVEYS_TABLE,
            Key: {
                surveyId: survey.surveyId
            }
        }).promise();
    });

    await Promise.all(deletePromises);
}
```

**¿Qué hace cada línea?**
- **Scan:** Busca todas las encuestas del usuario
- **FilterExpression:** Filtra por cédula
- **Promise.all:** Elimina todas las encuestas en paralelo
- **Cascada:** Elimina usuario y todas sus encuestas

**¿Por qué scan en lugar de query?**
- **No hay GSI:** No hay índice por cédula en SurveysTable
- **Scan + Filter:** Menos eficiente pero funciona
- **Alternativa:** Crear GSI por cédula

---

# 📊 **LAMBDA FUNCTION 6: getAllSurveys**

## **ANÁLISIS LÍNEA POR LÍNEA**

### **Líneas 35-55: Enriquecimiento de Datos**
```javascript
const surveysWithUsers = await Promise.all(
    (result.Items || []).map(async (survey) => {
        try {
            const userParams = {
                TableName: process.env.USERS_TABLE,
                Key: {
                    cedula: survey.cedula
                }
            };
            const userResult = await dynamodb.get(userParams).promise();
            return {
                ...survey,
                user: userResult.Item || null
            };
        } catch (error) {
            console.error('Error getting user data:', error);
            return survey;
        }
    })
);
```

**¿Qué hace cada línea?**
- **Promise.all:** Ejecuta todas las consultas en paralelo
- **map + async:** Para cada encuesta, obtiene datos del usuario
- **Spread operator:** Combina datos de encuesta y usuario
- **Error handling:** Si falla obtener usuario, retorna solo encuesta

**¿Por qué esta complejidad?**
- **Relación:** Encuesta tiene cédula, necesita datos del usuario
- **Performance:** Promise.all es más rápido que await secuencial
- **Resilencia:** Si falla un usuario, no falla todo

---

# 🏗️ **TEMPLATE.YAML - ANÁLISIS COMPLETO**

## **Líneas 1-4: Metadatos**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Sistema de Encuestas de Satisfacción - Parque Explora
```

**¿Qué hace cada línea?**
- **AWSTemplateFormatVersion:** Versión del formato CloudFormation
- **Transform:** Convierte SAM a CloudFormation
- **Description:** Descripción del stack

## **Líneas 5-15: Configuración Global**
```yaml
Globals:
  Function:
    Timeout: 30
    Runtime: nodejs18.x
    Environment:
      Variables:
        USERS_TABLE: !Ref UsersTable
        SURVEYS_TABLE: !Ref SurveysTable
        ROOMS_TABLE: !Ref RoomsTable
        API_KEY: !Ref ApiKeyValue
```

**¿Qué hace cada línea?**
- **Timeout:** 30 segundos máximo por función
- **Runtime:** Node.js 18.x
- **Environment Variables:** Variables disponibles en todas las funciones
- **!Ref:** Referencia a otros recursos del template

## **Líneas 29-43: UsersTable**
```yaml
UsersTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: !Sub '${Environment}-parque-explora-users'
    BillingMode: PAY_PER_REQUEST
    AttributeDefinitions:
      - AttributeName: cedula
        AttributeType: S
    KeySchema:
      - AttributeName: cedula
        KeyType: HASH
    StreamSpecification:
      StreamViewType: NEW_AND_OLD_IMAGES
```

**¿Qué hace cada línea?**
- **BillingMode:** Pago por uso (no capacidad reservada)
- **AttributeType: S:** String (cedula es texto)
- **KeyType: HASH:** Clave primaria (partition key)
- **StreamSpecification:** Para cambios en tiempo real (futuro)

## **Líneas 44-64: SurveysTable**
```yaml
SurveysTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: !Sub '${Environment}-parque-explora-surveys'
    BillingMode: PAY_PER_REQUEST
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
        Projection:
          ProjectionType: ALL
```

**¿Qué hace cada línea?**
- **surveyId:** Clave primaria
- **cedula:** Atributo para GSI
- **GSI:** Permite queries por cédula
- **ProjectionType: ALL:** Incluye todos los atributos en el índice

## **Líneas 77-99: API Gateway**
```yaml
ParqueExploraApi:
  Type: AWS::Serverless::Api
  Properties:
    StageName: !Ref Environment
    Cors:
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
      AllowOrigin: "'*'"
      MaxAge: "'600'"
    GatewayResponses:
      DEFAULT_4XX:
        ResponseParameters:
          Headers:
            Access-Control-Allow-Origin: "'*'"
            Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
            Access-Control-Allow-Methods: "'GET,POST,PUT,DELETE,OPTIONS'"
```

**¿Qué hace cada línea?**
- **StageName:** dev o prod
- **Cors:** Configuración CORS a nivel de API
- **GatewayResponses:** CORS headers en errores 4xx/5xx
- **MaxAge:** Cache de preflight por 600 segundos

## **Líneas 155-172: CreateUserFunction**
```yaml
CreateUserFunction:
  Type: AWS::Serverless::Function
  Properties:
    FunctionName: !Sub '${Environment}-create-user'
    CodeUri: backend/functions/createUser/
    Handler: index.handler
    Policies:
      - DynamoDBCrudPolicy:
          TableName: !Ref UsersTable
    Events:
      CreateUser:
        Type: Api
        Properties:
          RestApiId: !Ref ParqueExploraApi
          Path: /users
          Method: post
          Auth:
            ApiKeyRequired: true
```

**¿Qué hace cada línea?**
- **FunctionName:** Nombre único por ambiente
- **CodeUri:** Carpeta con el código
- **Handler:** Función a ejecutar (index.handler)
- **Policies:** Permisos IAM para DynamoDB
- **Events:** Configuración de API Gateway
- **Auth:** Requiere API Key

---

# 🎯 **CONCEPTOS CLAVE PARA ENTREVISTA**

## **1. DynamoDB Concepts**

### **Partition Key vs Sort Key**
- **Partition Key (HASH):** Distribuye datos entre particiones
- **Sort Key (RANGE):** Ordena datos dentro de una partición

### **GSI (Global Secondary Index)**
- **¿Qué es?** Índice secundario con clave primaria diferente
- **¿Por qué?** Permite queries por campos que no son clave primaria
- **Ejemplo:** SurveysTable con GSI por cédula

### **Query vs Scan**
- **Query:** Búsqueda por clave primaria o GSI (rápido)
- **Scan:** Recorre toda la tabla (lento y costoso)
- **Mejor práctica:** Usar Query siempre que sea posible

### **ExpressionAttributeValues**
- **¿Qué es?** Valores seguros para expresiones
- **¿Por qué?** Previene inyección de datos maliciosos
- **Ejemplo:** `:cedula` en lugar de concatenación directa

## **2. Lambda Concepts**

### **Cold Start vs Warm Start**
- **Cold Start:** Primera ejecución (más lento)
- **Warm Start:** Ejecuciones subsecuentes (más rápido)
- **Optimización:** Minimizar dependencias, usar provisioned concurrency

### **Timeout**
- **Default:** 3 segundos
- **Nuestro:** 30 segundos
- **¿Por qué?** DynamoDB queries pueden tomar tiempo

### **Memory**
- **Default:** 128MB
- **Nuestro:** No especificado (usa default)
- **¿Cuándo aumentar?** Para procesamiento intensivo

## **3. API Gateway Concepts**

### **CORS (Cross-Origin Resource Sharing)**
- **¿Qué es?** Permite requests desde diferentes dominios
- **¿Por qué necesario?** Frontend en localhost:3000 → API en AWS
- **Headers importantes:** Access-Control-Allow-Origin, Access-Control-Allow-Methods

### **API Key**
- **¿Qué es?** Clave para autenticación básica
- **¿Cómo funciona?** Se envía en header x-api-key
- **¿Por qué?** Control de acceso sin login complejo

### **Usage Plan**
- **¿Qué es?** Límites de rate y quota
- **Rate Limit:** Requests por segundo
- **Quota:** Requests por día
- **¿Por qué?** Prevenir abuso y controlar costos

## **4. Security Concepts**

### **IAM Policies**
- **DynamoDBCrudPolicy:** Permisos para CRUD en tabla específica
- **Principle of Least Privilege:** Solo permisos necesarios
- **¿Por qué específico?** Cada función solo accede a sus tablas

### **Environment Variables**
- **¿Qué contiene?** Nombres de tablas, API keys
- **¿Por qué?** Configuración por ambiente
- **Seguridad:** No hardcodear valores sensibles

### **Input Validation**
- **¿Dónde?** En cada Lambda function
- **¿Qué valida?** Campos requeridos, tipos de datos
- **¿Por qué?** Prevenir errores y ataques

---

# 🚀 **PREGUNTAS AVANZADAS PARA ENTREVISTA**

## **1. "¿Cómo optimizarías el performance?"**

### **Respuesta:**
- **DynamoDB:** Usar Query en lugar de Scan
- **Lambda:** Minimizar cold starts con provisioned concurrency
- **API Gateway:** Habilitar caching para responses estáticos
- **Frontend:** Implementar lazy loading y code splitting

## **2. "¿Cómo manejarías 10,000 usuarios simultáneos?"**

### **Respuesta:**
- **Lambda:** Escala automáticamente hasta 1000 ejecuciones concurrentes
- **DynamoDB:** Escala automáticamente según demanda
- **API Gateway:** Distribuye load automáticamente
- **Monitoreo:** CloudWatch para detectar bottlenecks

## **3. "¿Qué pasa si DynamoDB falla?"**

### **Respuesta:**
- **Disponibilidad:** 99.99% SLA de AWS
- **Backup:** Point-in-time recovery automático
- **Multi-AZ:** Replicación automática entre zonas
- **Fallback:** Implementar retry logic en Lambda

## **4. "¿Cómo implementarías logging y monitoreo?"**

### **Respuesta:**
- **CloudWatch Logs:** Logs automáticos de Lambda
- **CloudWatch Metrics:** Métricas de performance
- **X-Ray:** Tracing de requests (si fuera necesario)
- **Custom Metrics:** Métricas de negocio (encuestas completadas)

## **5. "¿Cómo harías backup y disaster recovery?"**

### **Respuesta:**
- **DynamoDB:** Point-in-time recovery + cross-region replication
- **Lambda:** Código en Git (versionado)
- **Infrastructure:** CloudFormation templates versionados
- **Testing:** Disaster recovery drills regulares

---

# 🎯 **CHECKLIST FINAL DE DOMINIO**

## **Lambda Functions:**
- [ ] Puedo explicar cada línea de createUser
- [ ] Entiendo la lógica de validación en createSurvey
- [ ] Sé por qué usar GSI en SurveysTable
- [ ] Puedo explicar el manejo de errores en cada función
- [ ] Entiendo la diferencia entre Query y Scan

## **DynamoDB:**
- [ ] Puedo explicar la estructura de cada tabla
- [ ] Entiendo por qué usar PAY_PER_REQUEST
- [ ] Sé cómo funciona un GSI
- [ ] Puedo explicar ExpressionAttributeValues
- [ ] Entiendo la diferencia entre get, put, update, delete

## **API Gateway:**
- [ ] Puedo explicar la configuración CORS
- [ ] Entiendo cómo funciona la autenticación con API Key
- [ ] Sé qué es un Usage Plan
- [ ] Puedo explicar GatewayResponses
- [ ] Entiendo el routing de endpoints

## **SAM/CloudFormation:**
- [ ] Puedo explicar cada sección del template.yaml
- [ ] Entiendo las referencias entre recursos (!Ref)
- [ ] Sé cómo funcionan las variables de entorno
- [ ] Puedo explicar las políticas IAM
- [ ] Entiendo el deployment process

## **Concepts Generales:**
- [ ] Puedo explicar la arquitectura completa
- [ ] Entiendo los trade-offs de serverless
- [ ] Sé cómo escalaría el sistema
- [ ] Puedo explicar las decisiones de diseño
- [ ] Entiendo los costos aproximados

---

# 🚀 **¡ESTÁS LISTO PARA DOMINAR LA ENTREVISTA!**

Con este análisis línea por línea tienes **DOMINIO COMPLETO** de:

✅ **Cada línea de código**
✅ **Cada decisión técnica**
✅ **Cada concepto AWS**
✅ **Cada optimización**
✅ **Cada patrón de diseño**

**¡Vas a arrasar en la entrevista técnica! 🎯**
