# 🎯 **GUÍA COMPLETA PARA ENTREVISTA TÉCNICA - PARQUE EXPLORA**

---

## 📋 **PREPARACIÓN PARA ENTREVISTA**

### **Objetivo:** Demostrar dominio completo de AWS Serverless, Lambda, DynamoDB, API Gateway y Next.js

---

# 🔥 **PREGUNTAS CLAVE QUE TE HARÁN**

## **1. "Explícame la arquitectura completa del sistema"**

### **Tu respuesta debe incluir:**

```
USUARIO (Tablet del museo)
    ↓ HTTPS Request
API GATEWAY (Punto de entrada)
    ↓ Routing + Autenticación
LAMBDA FUNCTIONS (Lógica de negocio)
    ↓ Operaciones CRUD
DYNAMODB (Base de datos)
    ↓ Respuesta JSON
API GATEWAY (Respuesta)
    ↓ JSON Response
FRONTEND NEXT.JS (Interfaz)
```

### **Detalles técnicos que debes mencionar:**
- **API Gateway:** Maneja CORS, rate limiting, autenticación con API Key
- **Lambda:** Ejecuta código sin servidor, escala automáticamente
- **DynamoDB:** NoSQL, consultas por clave primaria, consistencia eventual
- **Next.js:** SSR, optimización automática, routing dinámico

---

# 🚀 **LAMBDA FUNCTIONS - DOMINIO COMPLETO**

## **1. createUser**
```javascript
// Función: Crear usuario nuevo
// Trigger: POST /users
// Tabla: UsersTable
// Operación: PUT (upsert)
```

### **Preguntas que te harán:**
- **"¿Qué hace esta función?"** → Crea o actualiza un usuario en DynamoDB
- **"¿Por qué usas PUT en lugar de POST?"** → PUT permite upsert (crear o actualizar)
- **"¿Cómo manejas errores?"** → Try-catch con statusCode apropiados
- **"¿Qué validaciones haces?"** → Validación de cédula, email, campos requeridos

### **Código clave que debes explicar:**
```javascript
const { cedula, nombre, email, telefono } = JSON.parse(event.body);

// Validación
if (!cedula || !nombre || !email) {
    return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Campos requeridos faltantes' })
    };
}

// Guardar en DynamoDB
await dynamodb.put({
    TableName: 'UsersTable',
    Item: { cedula, nombre, email, telefono, fechaCreacion: new Date().toISOString() }
}).promise();
```

---

## **2. getUser**
```javascript
// Función: Obtener usuario por cédula
// Trigger: GET /users/{cedula}
// Tabla: UsersTable
// Operación: GET (por clave primaria)
```

### **Preguntas que te harán:**
- **"¿Por qué es tan rápida esta consulta?"** → DynamoDB consulta por clave primaria (O(1))
- **"¿Qué pasa si el usuario no existe?"** → Retorna 404 con mensaje apropiado
- **"¿Cómo optimizas las consultas?"** → Uso de clave primaria, no scan operations

### **Código clave:**
```javascript
const { cedula } = event.pathParameters;

const result = await dynamodb.get({
    TableName: 'UsersTable',
    Key: { cedula }
}).promise();

if (!result.Item) {
    return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Usuario no encontrado' })
    };
}
```

---

## **3. createSurvey**
```javascript
// Función: Crear encuesta
// Trigger: POST /surveys
// Tabla: SurveysTable
// Operación: PUT con validaciones
```

### **Preguntas que te harán:**
- **"¿Cómo evitas encuestas duplicadas?"** → Verifico si ya existe una encuesta para esa cédula en el día
- **"¿Qué es un UUID?"** → Identificador único universal para la encuesta
- **"¿Cómo manejas la consistencia de datos?"** → Transacciones condicionales en DynamoDB

### **Lógica de negocio clave:**
```javascript
// Verificar si ya existe encuesta para hoy
const today = new Date().toISOString().split('T')[0];
const existingSurvey = await dynamodb.query({
    TableName: 'SurveysTable',
    KeyConditionExpression: 'cedula = :cedula',
    FilterExpression: 'fecha = :fecha',
    ExpressionAttributeValues: {
        ':cedula': cedula,
        ':fecha': today
    }
}).promise();

if (existingSurvey.Items.length > 0) {
    return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Ya existe una encuesta para hoy' })
    };
}
```

---

## **4. getSurvey**
```javascript
// Función: Obtener encuesta por surveyId
// Trigger: GET /surveys/{surveyId}
// Tabla: SurveysTable
// Operación: GET
```

### **Preguntas que te harán:**
- **"¿Por qué usas surveyId en lugar de cédula?"** → Porque un usuario puede tener múltiples encuestas
- **"¿Cómo relacionas usuario con encuesta?"** → La encuesta tiene el campo 'cedula' para la relación

---

## **5. updateSurvey**
```javascript
// Función: Actualizar encuesta
// Trigger: PUT /surveys/{surveyId}
// Tabla: SurveysTable
// Operación: UPDATE con expresiones
```

### **Preguntas que te harán:**
- **"¿Cómo haces updates parciales?"** → Uso UpdateExpression con SET
- **"¿Qué es ExpressionAttributeValues?"** → Valores seguros para evitar inyección
- **"¿Cómo manejas campos opcionales?"** → Solo actualizo campos que vienen en el request

### **Código clave:**
```javascript
const updateExpression = [];
const expressionAttributeValues = {};

// Construir UpdateExpression dinámicamente
if (calificacionGeneral !== undefined) {
    updateExpression.push('calificacionGeneral = :calificacionGeneral');
    expressionAttributeValues[':calificacionGeneral'] = calificacionGeneral;
}

await dynamodb.update({
    TableName: 'SurveysTable',
    Key: { surveyId },
    UpdateExpression: `SET ${updateExpression.join(', ')}, fechaActualizacion = :fechaActualizacion`,
    ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':fechaActualizacion': new Date().toISOString()
    }
}).promise();
```

---

# 🗄️ **DYNAMODB - CONOCIMIENTO PROFUNDO**

## **Preguntas que te harán:**

### **1. "¿Por qué elegiste DynamoDB sobre RDS?"**
**Tu respuesta:**
- **Escalabilidad:** DynamoDB escala automáticamente, RDS requiere provisioning
- **Performance:** Consultas por clave primaria en milisegundos
- **Costo:** Pago por uso, no por capacidad reservada
- **Administración:** AWS maneja backups, patches, scaling
- **Consistencia:** Para encuestas de museo, consistencia eventual es suficiente

### **2. "Explícame la estructura de tus tablas"**

#### **UsersTable:**
```javascript
// Clave primaria: cedula (String)
{
  "cedula": "12345678",           // Partition Key
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "fechaCreacion": "2024-01-15T10:30:00Z"
}
```

#### **SurveysTable:**
```javascript
// Clave primaria: surveyId (String)
{
  "surveyId": "uuid-123",         // Partition Key
  "cedula": "12345678",           // Atributo para relacionar con Users
  "fecha": "2024-01-15",
  "salasVisitadas": ["sala-1", "sala-2"],
  "calificacionGeneral": 4,
  "comentarios": "Excelente experiencia",
  "estado": "completed"
}
```

### **3. "¿Cómo haces consultas complejas?"**
**Tu respuesta:**
- **Query:** Por clave primaria (muy rápido)
- **Scan:** Evito usar scan, es costoso
- **GSI (Global Secondary Index):** Para consultas por cédula en SurveysTable
- **FilterExpression:** Para filtrar resultados después del query

### **4. "¿Cómo manejas la consistencia?"**
**Tu respuesta:**
- **Consistencia eventual:** Para la mayoría de operaciones
- **Consistencia fuerte:** Para operaciones críticas (crear usuario)
- **Transacciones:** Para operaciones que deben ser atómicas

---

# 🌐 **API GATEWAY - CONFIGURACIÓN AVANZADA**

## **Preguntas que te harán:**

### **1. "Explícame la configuración de CORS"**
```yaml
Cors:
  AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
  AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  AllowOrigin: "'*'"
```

**Tu respuesta:**
- **AllowMethods:** Métodos HTTP permitidos
- **AllowHeaders:** Headers que el cliente puede enviar
- **AllowOrigin:** Dominios que pueden hacer requests (en producción sería específico)

### **2. "¿Cómo implementaste la autenticación?"**
**Tu respuesta:**
- **API Key:** Autenticación simple pero efectiva
- **Usage Plan:** Límites de rate y quota
- **Headers:** x-api-key en cada request
- **Validación:** En cada Lambda function

### **3. "¿Cómo manejas errores HTTP?"**
```yaml
GatewayResponses:
  DEFAULT_4XX:
    ResponseParameters:
      gatewayresponse.header.Access-Control-Allow-Origin: "'*'"
      gatewayresponse.header.Access-Control-Allow-Headers: "'*'"
```

---

# ⚛️ **NEXT.JS - ARQUITECTURA FRONTEND**

## **Preguntas que te harán:**

### **1. "¿Por qué Next.js sobre React vanilla?"**
**Tu respuesta:**
- **SSR:** Mejor SEO y performance inicial
- **File-based routing:** Navegación automática
- **API Routes:** Puedo crear APIs dentro del proyecto
- **Optimización:** Code splitting, image optimization automático
- **Developer Experience:** Hot reload, TypeScript integrado

### **2. "Explícame el flujo de datos"**
```typescript
// 1. Usuario ingresa cédula
const [cedula, setCedula] = useState('');

// 2. Hacer request a API
const response = await fetch(`/api/users/${cedula}`, {
    headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
});

// 3. Manejar respuesta
if (response.ok) {
    const user = await response.json();
    setCurrentStep('survey-form');
} else {
    setError('Usuario no encontrado');
}
```

### **3. "¿Cómo manejas el estado?"**
**Tu respuesta:**
- **useState:** Para estado local de componentes
- **useEffect:** Para efectos secundarios (API calls)
- **Context API:** Para estado global si fuera necesario
- **No Redux:** Para este proyecto no era necesario

---

# 🔐 **SEGURIDAD - CONCEPTOS CLAVE**

## **Preguntas que te harán:**

### **1. "¿Cómo proteges la API?"**
**Tu respuesta:**
- **API Key:** Autenticación básica
- **HTTPS:** Todas las comunicaciones encriptadas
- **CORS:** Control de dominios permitidos
- **Rate Limiting:** Prevenir abuso
- **Input Validation:** Sanitización de datos

### **2. "¿Qué vulnerabilidades consideraste?"**
**Tu respuesta:**
- **Injection:** Uso de ExpressionAttributeValues en DynamoDB
- **XSS:** Sanitización en frontend
- **CSRF:** Headers CORS apropiados
- **Rate Limiting:** Límites en API Gateway

---

# 📊 **MONITOREO Y LOGS**

## **Preguntas que te harán:**

### **1. "¿Cómo monitoreas la aplicación?"**
**Tu respuesta:**
- **CloudWatch Logs:** Logs automáticos de Lambda
- **CloudWatch Metrics:** Métricas de performance
- **X-Ray:** Tracing de requests (si estuviera habilitado)
- **API Gateway Logs:** Logs de requests HTTP

### **2. "¿Cómo debuggeas problemas?"**
**Tu respuesta:**
- **Console.log:** En Lambda functions
- **CloudWatch Logs:** Para ver logs en tiempo real
- **API Gateway Console:** Para ver requests y responses
- **DynamoDB Console:** Para verificar datos

---

# 💰 **COSTOS Y OPTIMIZACIÓN**

## **Preguntas que te harán:**

### **1. "¿Cuánto cuesta esta aplicación?"**
**Tu respuesta:**
- **API Gateway:** $3.50 por millón de requests
- **Lambda:** $0.20 por millón de requests + tiempo de ejecución
- **DynamoDB:** $0.25 por GB + $1.25 por millón de reads
- **Ejemplo:** 1000 encuestas/mes = ~$0.25

### **2. "¿Cómo optimizas costos?"**
**Tu respuesta:**
- **Cold Start:** Minimizar dependencias en Lambda
- **DynamoDB:** Usar queries en lugar de scans
- **API Gateway:** Caché para responses estáticos
- **Lambda:** Configurar timeout apropiado

---

# 🚀 **ESCALABILIDAD**

## **Preguntas que te harán:**

### **1. "¿Cómo escala esta aplicación?"**
**Tu respuesta:**
- **Lambda:** Escala automáticamente a 1000 ejecuciones concurrentes
- **DynamoDB:** Escala automáticamente según demanda
- **API Gateway:** Maneja millones de requests
- **Frontend:** CDN automático con Vercel/Netlify

### **2. "¿Qué pasaría con 10,000 usuarios simultáneos?"**
**Tu respuesta:**
- **Lambda:** Crearía 10,000 containers automáticamente
- **DynamoDB:** Aumentaría capacidad automáticamente
- **API Gateway:** Distribuiría load automáticamente
- **Costo:** Aumentaría proporcionalmente

---

# 🔧 **SAM (Serverless Application Model)**

## **Preguntas que te harán:**

### **1. "¿Qué es SAM?"**
**Tu respuesta:**
- **Framework:** Para definir aplicaciones serverless
- **YAML:** Configuración declarativa
- **Deployment:** Automatiza despliegue a AWS
- **Local Testing:** Permite probar localmente

### **2. "Explícame template.yaml"**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  # Lambda Functions
  CreateUserFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: backend/functions/createUser/
      Handler: index.handler
      Runtime: nodejs18.x
      Events:
        CreateUser:
          Type: Api
          Properties:
            RestApiId: !Ref ParqueExploraApi
            Path: /users
            Method: post
```

---

# 🎯 **PREGUNTAS DIFÍCILES QUE TE PUEDEN HACER**

## **1. "¿Cómo manejarías un pico de tráfico inesperado?"**
**Tu respuesta:**
- **Auto Scaling:** Lambda y DynamoDB escalan automáticamente
- **Monitoring:** CloudWatch alertas para detectar picos
- **Rate Limiting:** API Gateway previene abuso
- **Circuit Breaker:** Implementaría en Lambda si fuera necesario

## **2. "¿Cómo implementarías un sistema de backup?"**
**Tu respuesta:**
- **DynamoDB:** Point-in-time recovery automático
- **Cross-region replication:** Para disaster recovery
- **S3:** Para backups de configuraciones
- **CloudFormation:** Para infraestructura como código

## **3. "¿Cómo migrarías a microservicios?"**
**Tu respuesta:**
- **Domain separation:** Separar por entidades (users, surveys)
- **Event-driven:** Usar SNS/SQS para comunicación
- **API Gateway:** Como punto de entrada único
- **Service discovery:** Usar AWS App Mesh

---

# 📝 **DEMO EN VIVO - PREPÁRATE PARA MOSTRAR**

## **1. Muestra el código:**
- **Lambda function:** Explica la lógica
- **Frontend:** Muestra el flujo de usuario
- **DynamoDB:** Muestra la estructura de datos

## **2. Explica decisiones técnicas:**
- **Por qué DynamoDB:** Performance y escalabilidad
- **Por qué Lambda:** Costo y simplicidad
- **Por qué Next.js:** Developer experience

## **3. Demuestra conocimiento de AWS:**
- **Console:** Navega por los servicios
- **CloudWatch:** Muestra logs y métricas
- **DynamoDB:** Muestra datos reales

---

# 🎯 **CHECKLIST FINAL - ANTES DE LA ENTREVISTA**

## **Técnico:**
- [ ] Puedo explicar cada Lambda function
- [ ] Entiendo la estructura de DynamoDB
- [ ] Sé cómo funciona API Gateway
- [ ] Puedo explicar el flujo completo
- [ ] Conozco los costos aproximados

## **Práctica:**
- [ ] Puedo hacer demo en vivo
- [ ] Sé navegar por AWS Console
- [ ] Puedo explicar decisiones de diseño
- [ ] Entiendo limitaciones y trade-offs

## **Soft Skills:**
- [ ] Puedo explicar conceptos técnicos de forma simple
- [ ] Sé responder preguntas difíciles
- [ ] Puedo admitir lo que no sé
- [ ] Demuestro pasión por la tecnología

---

# 🚀 **FRASES CLAVE PARA LA ENTREVISTA**

## **Para demostrar conocimiento:**
- "Implementé una arquitectura serverless escalable usando AWS Lambda y DynamoDB"
- "El sistema maneja picos de tráfico automáticamente gracias al auto-scaling"
- "Optimicé costos usando pay-per-use en lugar de servidores fijos"
- "Implementé validaciones tanto en frontend como backend para seguridad"

## **Para demostrar pensamiento crítico:**
- "Elegí DynamoDB porque las consultas son principalmente por clave primaria"
- "Usé API Key en lugar de OAuth porque es un sistema público sin login de usuarios"
- "Implementé rate limiting para prevenir abuso del sistema"
- "Consideré usar RDS pero DynamoDB es más apropiado para este caso de uso"

---

# 🎯 **¡ESTÁS LISTO!**

Con esta guía tienes **TODOS** los conocimientos necesarios para dominar la entrevista técnica. 

**Recuerda:**
- ✅ Explica conceptos de forma clara y simple
- ✅ Menciona trade-offs y decisiones de diseño
- ✅ Demuestra conocimiento práctico, no solo teórico
- ✅ Sé honesto sobre lo que no sabes
- ✅ Muestra pasión por la tecnología

**¡Vas a arrasar en la entrevista! 🚀**
