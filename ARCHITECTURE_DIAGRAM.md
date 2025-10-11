# 🏗️ Diagrama de Arquitectura - Parque Explora Survey

## 📐 Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PARQUE EXPLORA SURVEY SYSTEM                      │
│                            Sistema de Encuestas de Satisfacción                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND                                      │
│                              (Next.js 14 + TypeScript)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Home      │  │  Survey     │  │    Admin    │  │   Assets    │          │
│  │   Page      │  │   Page      │  │   Panel     │  │   (CSS,     │          │
│  │             │  │             │  │             │  │   Images)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      COMPONENTS & HOOKS                               │   │
│  │  • UserSearch    • SurveyForm    • AdminTable    • Dashboard         │   │
│  │  • UserCard      • RoomSelector  • UserModal     • Statistics        │   │
│  │  • Validation    • State Mgmt    • CRUD Ops      • Navigation        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS/REST API
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               API GATEWAY                                      │
│                           (AWS API Gateway)                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           REST ENDPOINTS                              │   │
│  │                                                                         │   │
│  │  Users API:                    Surveys API:                           │   │
│  │  • POST   /users               • POST   /surveys                      │   │
│  │  • GET    /users/{cedula}      • GET    /surveys/user/{cedula}       │   │
│  │  • PUT    /surveys/{id}        • GET    /rooms                        │   │
│  │                                                                         │   │
│  │  Admin API:                    CRUD API:                              │   │
│  │  • GET    /admin/users         • GET    /admin/users/{cedula}        │   │
│  │  • GET    /admin/surveys       • PUT    /admin/users/{cedula}        │   │
│  │  • DELETE /admin/users/{cedula} • DELETE /admin/surveys/{id}         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        SECURITY & AUTH                                │   │
│  │  • API Key Authentication    • CORS Configuration                      │   │
│  │  • Request Validation        • Rate Limiting                          │   │
│  │  • HTTPS/TLS Encryption      • Usage Plans                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Invoke
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LAMBDA FUNCTIONS                                  │
│                           (AWS Lambda - Node.js 18.x)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   User Mgmt     │  │  Survey Mgmt    │  │   Room Mgmt     │                │
│  │                 │  │                 │  │                 │                │
│  │ • createUser    │  │ • createSurvey  │  │ • getRooms      │                │
│  │ • getUser       │  │ • getSurvey     │  │                 │                │
│  │ • updateUser    │  │ • updateSurvey  │  │                 │                │
│  │ • deleteUser    │  │ • deleteSurvey  │  │                 │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Admin Ops     │  │  Data Access    │  │   Utilities     │                │
│  │                 │  │                 │  │                 │                │
│  │ • getAllUsers   │  │ • getUserById   │  │ • Validation    │                │
│  │ • getAllSurveys │  │ • getSurveyById │  │ • Error Handle  │                │
│  │                 │  │ • updateUser    │  │ • Response      │                │
│  │                 │  │ • updateSurvey  │  │ • Logging       │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        SHARED FEATURES                                │   │
│  │  • CORS Headers         • Error Handling        • Logging             │   │
│  │  • Input Validation     • Response Formatting   • Monitoring          │   │
│  │  • Environment Config   • Database Connection   • Security            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ DynamoDB Operations
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               DATABASE LAYER                                   │
│                            (AWS DynamoDB - NoSQL)                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           DYNAMODB TABLES                             │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   │   │
│  │  │   USERS TABLE   │    │  SURVEYS TABLE  │    │   ROOMS TABLE   │   │   │
│  │  │                 │    │                 │    │                 │   │   │
│  │  │ PK: cedula      │    │ PK: surveyId    │    │ PK: roomId      │   │   │
│  │  │ • nombre        │    │ FK: cedula      │    │ • nombre        │   │   │
│  │  │ • email         │    │ • estado        │    │ • descripcion   │   │   │
│  │  │ • telefono      │    │ • calificacion  │    │ • categoria     │   │   │
│  │  │ • boletaId      │    │ • salasVisitas  │    │ • activo        │   │   │
│  │  │ • timestamps    │    │ • salasFav      │    │ • timestamps    │   │   │
│  │  │                 │    │ • salasRenovar  │    │                 │   │   │
│  │  │                 │    │ • comentarios   │    │                 │   │   │
│  │  │                 │    │ • timestamps    │    │                 │   │   │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘   │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    DATABASE FEATURES                          │   │   │
│  │  │  • Auto-scaling        • Global Secondary Indexes             │   │   │
│  │  │  • Point-in-time Recovery • On-demand Backup                  │   │   │
│  │  │  • Encryption at Rest  • Multi-AZ Deployment                  │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ CloudWatch Integration
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MONITORING & LOGS                                 │
│                            (AWS CloudWatch)                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Logs          │  │   Metrics       │  │   Alarms        │                │
│  │                 │  │                 │  │                 │                │
│  │ • Lambda Logs   │  │ • Invocations   │  │ • Error Rate    │                │
│  │ • API Gateway   │  │ • Duration      │  │ • Latency       │                │
│  │ • Application   │  │ • Errors        │  │ • Throttling    │                │
│  │ • System        │  │ • Throttles     │  │ • Custom        │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        OBSERVABILITY FEATURES                         │   │
│  │  • Real-time Monitoring    • Performance Metrics      • Error Tracking │   │
│  │  • Custom Dashboards       • Automated Alerts         • Cost Tracking  │   │
│  │  • Log Aggregation         • Distributed Tracing      • Health Checks  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### **Flujo de Usuario Completo**
```
1. Usuario accede al frontend (Next.js)
   ↓
2. Busca por cédula → API Gateway → Lambda (getUser)
   ↓
3. Si no existe → Lambda (createUser) → DynamoDB (Users Table)
   ↓
4. Crea encuesta → Lambda (createSurvey) → DynamoDB (Surveys Table)
   ↓
5. Carga salas → Lambda (getRooms) → DynamoDB (Rooms Table)
   ↓
6. Usuario completa encuesta → Lambda (updateSurvey) → DynamoDB
   ↓
7. Confirmación → Frontend
```

### **Flujo de Administración**
```
1. Admin accede al panel → API Gateway → Lambda (getAllUsers, getAllSurveys)
   ↓
2. Visualiza datos → Frontend renderiza tablas
   ↓
3. CRUD Operations → API Gateway → Lambda Functions → DynamoDB
   ↓
4. Actualización en tiempo real → Frontend
```

## 🔐 Seguridad y Autenticación

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Transport     │  │   API Gateway   │  │   Lambda        │                │
│  │   Security      │  │   Security      │  │   Security      │                │
│  │                 │  │                 │  │                 │                │
│  │ • HTTPS/TLS     │  │ • API Key Auth  │  │ • IAM Roles     │                │
│  │ • Certificate   │  │ • Rate Limiting │  │ • VPC (Optional)│                │
│  │ • Encryption    │  │ • CORS Policy   │  │ • Environment   │                │
│  │ • Secure Headers│  │ • Usage Plans   │  │ • Secrets Mgmt  │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Database      │  │   Application   │  │   Monitoring    │                │
│  │   Security      │  │   Security      │  │   Security      │                │
│  │                 │  │                 │  │                 │                │
│  │ • Encryption    │  │ • Input Valid   │  │ • Access Logs   │                │
│  │ • IAM Policies  │  │ • Output Sanit  │  │ • Audit Trails  │                │
│  │ • VPC Endpoints │  │ • Error Handling│  │ • Alert System  │                │
│  │ • Backup Encryp │  │ • CORS Headers  │  │ • Compliance    │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 Escalabilidad y Performance

### **Auto-scaling Components**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SCALING FEATURES                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   API Gateway   │  │   Lambda        │  │   DynamoDB      │                │
│  │   Scaling       │  │   Scaling       │  │   Scaling       │                │
│  │                 │  │                 │  │                 │                │
│  │ • Auto-scaling  │  │ • Concurrency   │  │ • On-demand     │                │
│  │ • Throttling    │  │ • Memory Config │  │ • Auto-scaling  │                │
│  │ • Caching       │  │ • Cold Start    │  │ • Provisioned   │                │
│  │ • CDN (Optional)│  │ • Optimization  │  │ • Global Tables │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        PERFORMANCE OPTIMIZATIONS                      │   │
│  │  • Connection Pooling     • Response Caching        • Code Splitting   │   │
│  │  • Lazy Loading          • Image Optimization       • Bundle Analysis  │   │
│  │  • Database Indexing     • Compression              • Minification     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Development   │  │   Staging       │  │   Production    │                │
│  │                 │  │                 │  │                 │                │
│  │ • Local Dev     │  │ • Test Env      │  │ • Live System   │                │
│  │ • Hot Reload    │  │ • Integration   │  │ • High Avail    │                │
│  │ • Mock Data     │  │ • Testing       │  │ • Monitoring    │                │
│  │ • Debug Mode    │  │ • Performance   │  │ • Backup        │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│           │                     │                     │                        │
│           ▼                     ▼                     ▼                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   SAM Build     │  │   SAM Deploy    │  │   CloudFormation│                │
│  │                 │  │                 │  │                 │                │
│  │ • Package       │  │ • Deploy Stack  │  │ • Infrastructure│                │
│  │ • Validate      │  │ • Update Config │  │ • Resources     │                │
│  │ • Test          │  │ • Rollback      │  │ • Dependencies  │                │
│  │ • Optimize      │  │ • Monitor       │  │ • Outputs       │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📈 Métricas y KPIs

### **Business Metrics**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BUSINESS INTELLIGENCE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   User Metrics  │  │   Survey Metrics│  │   System Metrics│                │
│  │                 │  │                 │  │                 │                │
│  │ • Total Users   │  │ • Completion    │  │ • Response Time │                │
│  │ • New Users/Day │  │ • Avg Rating    │  │ • Error Rate    │                │
│  │ • User Activity │  │ • Popular Rooms │  │ • Availability  │                │
│  │ • Demographics  │  │ • Feedback      │  │ • Cost per User │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Notas de Arquitectura

### **Decisiones Técnicas**
- **Serverless**: Para escalabilidad automática y costo-efectividad
- **NoSQL**: Para flexibilidad en el esquema de datos
- **API Gateway**: Para gestión centralizada de APIs y seguridad
- **TypeScript**: Para type safety y mejor mantenibilidad
- **Tailwind CSS**: Para desarrollo rápido y consistencia

### **Consideraciones de Diseño**
- **Stateless**: Las funciones Lambda son stateless para mejor escalabilidad
- **Event-Driven**: Arquitectura basada en eventos para desacoplamiento
- **Microservices**: Cada función tiene una responsabilidad específica
- **Cloud-Native**: Diseñado específicamente para AWS

### **Limitaciones Conocidas**
- **Cold Starts**: Latencia inicial en Lambda functions
- **Payload Size**: Limitación de 6MB para Lambda
- **Timeout**: Máximo 15 minutos por ejecución
- **Concurrency**: Límites de concurrencia por región

---

*Diagrama de arquitectura para el Sistema de Encuestas de Satisfacción - Parque Explora*
