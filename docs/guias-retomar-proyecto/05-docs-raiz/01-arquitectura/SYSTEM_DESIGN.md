# 🏗️ Diseño del Sistema - Parque Explora Survey

## 📋 Resumen Ejecutivo

El **Sistema de Encuestas de Satisfacción - Parque Explora** es una aplicación full-stack serverless que permite a los visitantes del parque completar encuestas de satisfacción sobre su experiencia, con un panel de administración para gestionar usuarios y encuestas.

## 🎯 Objetivos del Sistema

- **Recopilar feedback** de visitantes sobre su experiencia en el parque
- **Gestionar usuarios** y sus datos de manera eficiente
- **Administrar encuestas** y analizar resultados
- **Proporcionar insights** sobre la satisfacción del cliente
- **Escalabilidad** y **disponibilidad** garantizadas con AWS

## 🏛️ Arquitectura del Sistema

### **Arquitectura Serverless**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Lambda        │
│   (Next.js)     │◄──►│   (REST API)    │◄──►│   Functions     │
│   Port: 3000    │    │   + Auth        │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   DynamoDB      │    │   CloudWatch    │
                       │   (NoSQL)       │    │   (Logs)        │
                       └─────────────────┘    └─────────────────┘
```

### **Componentes Principales**

#### **1. Frontend (Next.js 14)**
- **Framework**: Next.js con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: React Hooks (useState, useEffect)
- **Navegación**: next/navigation

#### **2. Backend (AWS Serverless)**
- **API Gateway**: REST API con autenticación por API Key
- **Lambda Functions**: 14 funciones serverless
- **DynamoDB**: Base de datos NoSQL
- **IAM**: Gestión de permisos y seguridad

#### **3. Base de Datos (DynamoDB)**
- **Users Table**: Información de usuarios/visitantes
- **Surveys Table**: Encuestas de satisfacción
- **Rooms Table**: Catálogo de salas del parque

## 🔄 Flujo de Datos

### **Flujo Principal de Usuario**
```
1. Usuario accede al frontend
2. Busca su encuesta por cédula
3. Sistema verifica existencia del usuario
4. Crea/recupera encuesta
5. Usuario completa encuesta
6. Datos se almacenan en DynamoDB
```

### **Flujo de Administración**
```
1. Admin accede al panel
2. Visualiza estadísticas generales
3. Gestiona usuarios (CRUD)
4. Gestiona encuestas (CRUD)
5. Analiza resultados
```

## 🔐 Seguridad

### **Autenticación y Autorización**
- **API Key**: Autenticación para todas las APIs
- **IAM Roles**: Permisos granulares para Lambda functions
- **CORS**: Configuración segura para requests cross-origin
- **HTTPS**: Comunicación encriptada

### **Validación de Datos**
- **Frontend**: Validación de formularios
- **Backend**: Validación de entrada en Lambda functions
- **Base de Datos**: Constraints y validaciones

## 📊 Modelo de Datos

### **Tabla Users**
```json
{
  "cedula": "string (PK)",
  "nombre": "string",
  "email": "string",
  "telefono": "string",
  "boletaId": "string (UUID)",
  "fechaCompra": "ISO 8601",
  "fechaCreacion": "ISO 8601",
  "fechaActualizacion": "ISO 8601"
}
```

### **Tabla Surveys**
```json
{
  "surveyId": "string (PK)",
  "cedula": "string (FK)",
  "estado": "pending | completed",
  "calificacionGeneral": "number (1-5)",
  "salasVisitadas": ["string"],
  "salasFavoritas": ["string"],
  "salasParaRenovar": ["string"],
  "comentarios": "string",
  "fechaCreacion": "ISO 8601",
  "fechaActualizacion": "ISO 8601"
}
```

### **Tabla Rooms**
```json
{
  "roomId": "string (PK)",
  "nombre": "string",
  "descripcion": "string",
  "categoria": "string",
  "activo": "boolean"
}
```

## 🚀 Características Técnicas

### **Escalabilidad**
- **Serverless**: Escalado automático
- **DynamoDB**: Escalado horizontal automático
- **API Gateway**: Manejo de tráfico variable

### **Disponibilidad**
- **Multi-AZ**: Disponibilidad en múltiples zonas
- **Backup**: Respaldos automáticos de DynamoDB
- **Monitoring**: CloudWatch para monitoreo

### **Performance**
- **CDN**: Distribución de contenido estático
- **Caching**: Cache de respuestas API
- **Optimización**: Código optimizado y minificado

## 🔧 Tecnologías Utilizadas

### **Frontend**
- Next.js 14
- TypeScript
- Tailwind CSS
- React 18
- Lucide React (iconos)

### **Backend**
- AWS Lambda (Node.js 18.x)
- AWS API Gateway
- AWS DynamoDB
- AWS SAM
- AWS CloudFormation

### **DevOps**
- AWS CLI
- SAM CLI
- Git/GitHub
- PowerShell

### **Monitoreo**
- AWS CloudWatch
- CloudWatch Logs
- X-Ray (opcional)

## 📈 Métricas y Monitoreo

### **Métricas de Negocio**
- Número de encuestas completadas
- Tiempo promedio de completado
- Satisfacción general del cliente
- Salas más populares
- Comentarios y feedback

### **Métricas Técnicas**
- Latencia de API
- Errores por endpoint
- Uso de recursos Lambda
- Consumo de DynamoDB
- Disponibilidad del sistema

## 🎯 Casos de Uso Principales

1. **Registro de Usuario**: Crear nuevo visitante
2. **Completar Encuesta**: Evaluar experiencia
3. **Administrar Usuarios**: CRUD de visitantes
4. **Administrar Encuestas**: CRUD de encuestas
5. **Analizar Resultados**: Dashboard con estadísticas
6. **Buscar y Filtrar**: Funcionalidades de búsqueda

## 🔮 Consideraciones Futuras

### **Mejoras Potenciales**
- **Autenticación OAuth**: Login con redes sociales
- **Notificaciones**: Email/SMS automático
- **Analytics**: Dashboard avanzado con gráficos
- **Mobile App**: Aplicación móvil nativa
- **Machine Learning**: Análisis predictivo
- **Multi-idioma**: Soporte internacional

### **Escalabilidad**
- **Microservicios**: Separación en servicios independientes
- **Event Sourcing**: Manejo de eventos
- **CQRS**: Separación de comandos y consultas
- **Kubernetes**: Orquestación de contenedores

---

## 📝 Notas de Implementación

- **Despliegue**: Automatizado con SAM CLI
- **Configuración**: Variables de entorno para diferentes ambientes
- **Testing**: Pruebas unitarias y de integración
- **Documentación**: API documentada con ejemplos
- **Versionado**: Control de versiones con Git

---

*Documento generado para el Sistema de Encuestas de Satisfacción - Parque Explora*
