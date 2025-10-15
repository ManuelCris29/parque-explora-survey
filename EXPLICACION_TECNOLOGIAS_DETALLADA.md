# 🔍 **EXPLICACIÓN DETALLADA: Tecnologías del Proyecto Parque Explora**

---

## 📋 **PROYECTO: Sistema de Encuestas de Satisfacción - Parque Explora**

**OBJETIVO:** Crear un sistema web donde los visitantes del Parque Explora puedan completar encuestas de satisfacción sobre su experiencia en las diferentes salas del museo.

---

# 🎯 **REQUERIMIENTO 1: Backend - API REST con Lambda Functions**

## **¿Qué es una API REST?**
**API REST** = **A**pplication **P**rogramming **I**nterface **REST**ful

### **Definición:**
- Es una **interfaz** que permite que diferentes aplicaciones se comuniquen
- **REST** significa "Representational State Transfer"
- Usa protocolo **HTTP** (GET, POST, PUT, DELETE)
- Intercambia datos en formato **JSON**

### **Ejemplo práctico:**
```bash
# GET: Obtener datos
GET https://api.ejemplo.com/users/12345678
Response: {"cedula":"12345678","nombre":"Juan Pérez"}

# POST: Crear datos
POST https://api.ejemplo.com/users
Body: {"cedula":"87654321","nombre":"María García"}
Response: {"message":"Usuario creado"}

# PUT: Actualizar datos
PUT https://api.ejemplo.com/users/12345678
Body: {"nombre":"Juan Carlos Pérez"}
Response: {"message":"Usuario actualizado"}

# DELETE: Eliminar datos
DELETE https://api.ejemplo.com/users/12345678
Response: {"message":"Usuario eliminado"}
```

## **¿Qué son Lambda Functions?**
**AWS Lambda** = Funciones que se ejecutan **sin servidor**

### **Definición:**
- **Código que se ejecuta** cuando se necesita
- **Sin servidor** = No tienes que administrar servidores
- **Pago por uso** = Solo pagas cuando se ejecuta
- **Escalado automático** = Se adapta a la demanda

### **Comparación:**

#### **Servidor tradicional:**
```
Servidor físico/virtual
├── Siempre corriendo (24/7)
├── Pagas aunque no se use
├── Tienes que administrarlo
└── Capacidad fija
```

#### **Lambda Functions:**
```
Función Lambda
├── Solo corre cuando se necesita
├── Pagas solo por ejecución
├── AWS lo administra
└── Escala automáticamente
```

## **¿Por qué API REST + Lambda para Parque Explora?**

### **Necesidades del proyecto:**
1. **Encuestas por cédula** → `GET /users/{cedula}`
2. **Crear usuarios** → `POST /users`
3. **Crear encuestas** → `POST /surveys`
4. **Obtener encuestas** → `GET /surveys/user/{cedula}`

### **Ventajas para este proyecto:**
- ✅ **Escalabilidad:** Miles de visitantes pueden usar la app simultáneamente
- ✅ **Costo:** Solo pagas cuando alguien completa una encuesta
- ✅ **Simplicidad:** No necesitas administrar servidores
- ✅ **Integración:** Fácil conectar con frontend Next.js

### **Implementación real en Parque Explora:**
```javascript
// Lambda Function: createUser
exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { cedula, nombre, email } = body;
    
    // Guardar en DynamoDB
    await dynamodb.put({
        TableName: 'users',
        Item: { cedula, nombre, email }
    }).promise();
    
    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Usuario creado' })
    };
};
```

---

# 🌐 **REQUERIMIENTO 2: Frontend - Aplicación Web Next.js**

## **¿Qué es Next.js?**
**Next.js** = Framework de **React** para aplicaciones web

### **Definición:**
- Basado en **React** (biblioteca de JavaScript para interfaces)
- **Framework completo** con herramientas incluidas
- **Renderizado del lado del servidor** (SSR)
- **Optimización automática** de performance

### **Características principales:**
- ✅ **Routing automático** (navegación entre páginas)
- ✅ **Optimización de imágenes**
- ✅ **Code splitting** (carga solo el código necesario)
- ✅ **SEO friendly** (bueno para motores de búsqueda)

## **¿Por qué Next.js para Parque Explora?**

### **Necesidades del proyecto:**
1. **Página principal** para buscar por cédula
2. **Formulario de encuesta** interactivo
3. **Panel de administración** para ver datos
4. **Responsive design** (funciona en móviles)

### **Ventajas para este proyecto:**
- ✅ **Rápido desarrollo:** Componentes reutilizables
- ✅ **Excelente UX:** Navegación fluida
- ✅ **Mobile first:** Funciona perfecto en tablets del museo
- ✅ **Fácil mantenimiento:** Código organizado

### **Implementación real en Parque Explora:**
```typescript
// Página principal: app/page.tsx
export default function Home() {
  const [cedula, setCedula] = useState('');
  
  const handleSearch = async () => {
    const response = await fetch(`/api/users/${cedula}`, {
      headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
    });
    const user = await response.json();
    // Mostrar formulario de encuesta
  };
  
  return (
    <div>
      <input 
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        placeholder="Ingresa tu cédula"
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}
```

---

# 🗄️ **REQUERIMIENTO 3: Base de Datos - DynamoDB**

## **¿Qué es DynamoDB?**
**DynamoDB** = Base de datos **NoSQL** de AWS

### **Definición:**
- **NoSQL** = No usa tablas relacionales tradicionales
- **Servicio administrado** = AWS lo mantiene
- **Escalabilidad automática** = Se adapta a la demanda
- **Alta disponibilidad** = Siempre disponible

### **Comparación:**

#### **Base de datos tradicional (MySQL/PostgreSQL):**
```
Servidor de base de datos
├── Tablas con filas y columnas
├── Relaciones entre tablas
├── SQL para consultas
└── Necesitas administrarlo
```

#### **DynamoDB:**
```
Servicio AWS
├── Documentos JSON
├── Sin relaciones complejas
├── Consultas simples y rápidas
└── AWS lo administra
```

## **¿Por qué DynamoDB para Parque Explora?**

### **Necesidades del proyecto:**
1. **Usuarios:** Almacenar datos de visitantes
2. **Encuestas:** Guardar respuestas de satisfacción
3. **Salas:** Lista de salas disponibles
4. **Búsquedas rápidas:** Por cédula, por fecha

### **Ventajas para este proyecto:**
- ✅ **Performance:** Búsquedas por cédula en milisegundos
- ✅ **Escalabilidad:** Miles de encuestas sin problemas
- ✅ **Costo:** Pago por uso, no por capacidad fija
- ✅ **Simplicidad:** No necesitas configurar servidores

### **Estructura de datos en Parque Explora:**

#### **Tabla Users:**
```json
{
  "cedula": "12345678",
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "fechaCreacion": "2024-01-15T10:30:00Z"
}
```

#### **Tabla Surveys:**
```json
{
  "surveyId": "uuid-123",
  "cedula": "12345678",
  "fecha": "2024-01-15",
  "salasVisitadas": ["sala-1", "sala-2"],
  "calificacionGeneral": 4,
  "comentarios": "Excelente experiencia",
  "estado": "completed"
}
```

#### **Tabla Rooms:**
```json
{
  "roomId": "sala-1",
  "nombre": "Sala del Agua",
  "descripcion": "Exploración del mundo acuático",
  "activa": true
}
```

---

# 🔐 **REQUERIMIENTO 4: Autenticación - API Key**

## **¿Qué es API Key?**
**API Key** = Clave de acceso para usar una API

### **Definición:**
- **Token único** que identifica tu aplicación
- **Se envía en headers** HTTP
- **Controla el acceso** a los endpoints
- **Puede tener límites** de uso

### **Ejemplo de uso:**
```bash
curl -X GET https://api.ejemplo.com/users/123 \
  -H "x-api-key: tu-api-key-aqui"
```

## **¿Por qué API Key para Parque Explora?**

### **Necesidades del proyecto:**
1. **Acceso controlado:** Solo aplicaciones autorizadas
2. **Simplicidad:** No necesitas login complejo
3. **Monitoreo:** Saber quién usa la API
4. **Límites:** Controlar uso excesivo

### **Ventajas para este proyecto:**
- ✅ **Seguridad básica:** Evita uso no autorizado
- ✅ **Simplicidad:** No requiere autenticación de usuarios
- ✅ **Monitoreo:** AWS CloudWatch registra el uso
- ✅ **Límites:** Puedes configurar throttling

### **Implementación en Parque Explora:**
```yaml
# En template.yaml
ApiKey:
  Type: AWS::ApiGateway::ApiKey
  Properties:
    Name: parque-explora-api-key
    Enabled: true

UsagePlan:
  Type: AWS::ApiGateway::UsagePlan
  Properties:
    Throttle:
      BurstLimit: 100    # Máximo 100 requests por segundo
      RateLimit: 50      # Promedio 50 requests por segundo
    Quota:
      Limit: 10000       # Máximo 10,000 requests por día
```

---

# ☁️ **REQUERIMIENTO 5: Despliegue - AWS Serverless**

## **¿Qué es AWS Serverless?**
**Serverless** = Ejecutar código **sin administrar servidores**

### **Definición:**
- **No hay servidores** que administrar
- **Escalado automático** según demanda
- **Pago por uso** real
- **Alta disponibilidad** automática

### **Arquitectura Serverless:**
```
Usuario
   ↓
API Gateway (entrada)
   ↓
Lambda Functions (lógica)
   ↓
DynamoDB (datos)
```

## **¿Por qué AWS Serverless para Parque Explora?**

### **Necesidades del proyecto:**
1. **Disponibilidad:** Museo abierto todos los días
2. **Escalabilidad:** Picos de visitantes en fines de semana
3. **Costo:** Solo pagar por uso real
4. **Mantenimiento:** Mínimo mantenimiento técnico

### **Ventajas para este proyecto:**
- ✅ **Disponibilidad:** 99.99% uptime garantizado
- ✅ **Escalabilidad:** Se adapta a 10 o 10,000 visitantes
- ✅ **Costo:** Solo pagas cuando alguien usa la app
- ✅ **Simplicidad:** AWS maneja la infraestructura

### **Componentes Serverless en Parque Explora:**

#### **1. API Gateway:**
- **Función:** Punto de entrada HTTP
- **Beneficio:** Maneja routing y autenticación
- **Costo:** $3.50 por millón de requests

#### **2. Lambda Functions:**
- **Función:** Ejecuta lógica de negocio
- **Beneficio:** Escala automáticamente
- **Costo:** $0.20 por millón de requests + tiempo de ejecución

#### **3. DynamoDB:**
- **Función:** Almacena datos
- **Beneficio:** Performance consistente
- **Costo:** $0.25 por GB almacenado + $1.25 por millón de reads

---

# 🔄 **FLUJO COMPLETO DEL SISTEMA**

## **Escenario: Visitante completa encuesta**

### **1. Usuario ingresa cédula:**
```
Frontend (Next.js) → API Gateway → Lambda (getUser)
```

### **2. Sistema busca usuario:**
```
Lambda → DynamoDB (Users Table) → Respuesta
```

### **3. Si usuario existe, mostrar encuesta:**
```
Frontend → Formulario interactivo
```

### **4. Usuario completa encuesta:**
```
Frontend → API Gateway → Lambda (createSurvey)
```

### **5. Guardar encuesta:**
```
Lambda → DynamoDB (Surveys Table) → Confirmación
```

---

# 💰 **ANÁLISIS DE COSTOS**

## **Ejemplo: 1000 encuestas por mes**

### **API Gateway:**
- 1000 requests = $0.0035

### **Lambda:**
- 1000 ejecuciones × 100ms = $0.0002

### **DynamoDB:**
- 1000 reads + 1000 writes = $0.00025
- Almacenamiento (1GB) = $0.25

### **Total mensual: ~$0.25**

**¡Increíblemente económico para un museo!**

---

# 🎯 **RESUMEN: ¿Por qué esta arquitectura?**

## **Para Parque Explora específicamente:**

1. **API REST + Lambda:**
   - ✅ Escalable para miles de visitantes
   - ✅ Costo eficiente
   - ✅ Fácil de mantener

2. **Next.js Frontend:**
   - ✅ Excelente experiencia de usuario
   - ✅ Funciona en tablets del museo
   - ✅ Desarrollo rápido

3. **DynamoDB:**
   - ✅ Búsquedas rápidas por cédula
   - ✅ Sin administración de servidores
   - ✅ Escalabilidad automática

4. **API Key:**
   - ✅ Seguridad simple pero efectiva
   - ✅ Control de acceso
   - ✅ Monitoreo de uso

5. **AWS Serverless:**
   - ✅ Disponibilidad 24/7
   - ✅ Costo por uso real
   - ✅ Escalado automático

**¡Esta arquitectura es perfecta para un sistema de encuestas de museo! 🚀**

---

# 📚 **APRENDIZAJES PARA FUTUROS PROYECTOS**

## **Cuándo usar cada tecnología:**

### **API REST + Lambda:**
- ✅ APIs simples con pocas operaciones
- ✅ Proyectos que necesitan escalar
- ✅ Aplicaciones con tráfico variable

### **Next.js:**
- ✅ Aplicaciones web interactivas
- ✅ Proyectos que necesitan SEO
- ✅ Aplicaciones con múltiples páginas

### **DynamoDB:**
- ✅ Aplicaciones con consultas simples
- ✅ Proyectos que necesitan alta performance
- ✅ Datos que no requieren relaciones complejas

### **API Key:**
- ✅ APIs públicas con acceso controlado
- ✅ Aplicaciones que no requieren login de usuarios
- ✅ Prototipos y MVPs

### **AWS Serverless:**
- ✅ Aplicaciones con tráfico variable
- ✅ Proyectos que necesitan alta disponibilidad
- ✅ Startups y empresas que quieren minimizar costos

**¡Con este conocimiento puedes elegir la tecnología correcta para cualquier proyecto! 🎯**

