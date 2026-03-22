# 📖 ÍNDICE COMPLETO - TODO LO QUE NECESITAS SABER

## 🚀 COMIENZA AQUÍ (Elige tu nivel)

### ⚡ Quiero entender RÁPIDO (5 minutos)
Copia y pega en PowerShell:

```powershell
# Ver el resumen visual
(Get-Content DIAGRAMAS_VISUALES.md -First 50) | Write-Host
```

**Lectura recomendada:**
1. Lee: **EXPLICACION_SERVICIOS_AWS.md** - Primera sección "VISIÓN GENERAL"
2. Ve: **DIAGRAMAS_VISUALES.md** - Sección "FLUJO COMPLETO"

---

### 📚 Quiero entender EN PROFUNDIDAD (30 minutos)
**Orden de lectura recomendado:**

1. ✅ **EXPLICACION_SERVICIOS_AWS.md**
   - Qué es cada servicio AWS
   - Cómo se conectan
   - Flujo de datos completo

2. ✅ **EJEMPLOS_PRACTICOS.md**
   - Cómo hacer solicitudes desde el Frontend
   - Estructura de respuestas
   - Manejo de errores

3. ✅ **DIAGRAMAS_VISUALES.md**
   - Visualización de flujos
   - Casos de error
   - Cálculo de costos

---

### 💻 Quiero EMPEZAR A CODIFICAR (1 hora)

**Orden de lectura:**
1. **GUIA_CONTINUAR_DESARROLLO.md** (TODO)
2. **EJEMPLOS_PRACTICOS.md** - Sección "Testing Manual"

**Pasos iniciales:**
```powershell
# 1. Actualiza los datos de prueba
.\scripts\populate-test-data.ps1

# 2. Construye localmente
sam build

# 3. Prueba en local (opcional)
sam local start-api

# 4. Desplega en AWS
sam deploy
```

---

## 📋 ARQUITECTURA DE ARCHIVOS

```
parque-explora-survey/
│
├── 📁 backend/                    ← CÓDIGO DE LAS FUNCIONES LAMBDA
│   └── 📁 functions/
│       ├── 📁 userService/        ← Gestión de usuarios
│       │   ├── index.js           ← Código principal
│       │   └── package.json
│       │
│       ├── 📁 surveyService/      ← Gestión de encuestas
│       │   ├── index.js
│       │   └── package.json
│       │
│       └── 📁 roomService/        ← Gestión de salas
│           ├── index.js
│           └── package.json
│
├── 📁 frontend/                   ← CÓDIGO DE LA APLICACIÓN WEB
│   ├── 📁 app/
│   │   ├── layout.tsx             ← Layout principal
│   │   ├── page.tsx               ← Página de inicio
│   │   ├── 📁 survey/
│   │   │   └── page.tsx           ← Página de encuesta
│   │   └── 📁 admin/
│   │       └── page.tsx           ← Panel de administración
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── 📁 public/                 ← Archivos estáticos
│
├── 📁 scripts/                    ← SCRIPTS DE AYUDA
│   ├── populate-test-data.ps1     ← Poblar datos de prueba
│   ├── populate-test-data.js
│   ├── setup.ps1                  ← Configurar ambiente
│   └── setup.sh
│
├── template.yaml                  ← 🔑 CONFIGURACIÓN DE INFRAESTRUCTURA
├── samconfig.toml                 ← Configuración de SAM
│
└── 📄 DOCUMENTACIÓN (Este proyecto)
    ├── EXPLICACION_SERVICIOS_AWS.md      ← Explicación de servicios
    ├── EJEMPLOS_PRACTICOS.md             ← Ejemplos de código
    ├── GUIA_CONTINUAR_DESARROLLO.md      ← Cómo continuar
    ├── DIAGRAMAS_VISUALES.md             ← Diagramas y flujos
    ├── README.md                         ← Introducción
    ├── ARCHITECTURE_DIAGRAM.md           ← Diagrama de arquitectura
    ├── SYSTEM_DESIGN.md                  ← Diseño del sistema
    ├── CLASS_DIAGRAM.md                  ← Diagrama de clases
    └── ... más documentación
```

---

## 🎯 SERVICIOS AWS - RÁPIDO

| Servicio | Función | Ubicación |
|----------|---------|-----------|
| **DynamoDB** | 🗄️ Base de datos (almacena datos) | AWS Console |
| **API Gateway** | 🚪 Puerta de entrada HTTP | AWS Console |
| **Lambda** | ⚙️ Lógica de negocio (funciones) | `backend/functions/` |
| **IAM** | 🔐 Permisos y seguridad | AWS Console |
| **CloudWatch** | 📊 Logs y monitoreo | AWS Console |
| **SAM CLI** | 📦 Desplegar todo | Línea de comandos |

---

## 💡 CONCEPTOS CLAVE

### **Frontend (Next.js)**
- **Ubicación:** `frontend/app/`
- **Puerto:** 3000
- **Páginas:**
  - `/` - Inicio (buscar usuario)
  - `/survey` - Completar encuesta
  - `/admin` - Panel de administración

### **Backend (Lambda Functions)**
- **Ubicación:** `backend/functions/`
- **Lenguaje:** Node.js 22.x
- **3 Servicios:**
  1. **userService** - CRUD de usuarios
  2. **surveyService** - CRUD de encuestas
  3. **roomService** - Obtener salas disponibles

### **Base de Datos (DynamoDB)**
- **3 Tablas:**
  1. **Users** - Información de visitantes
  2. **Surveys** - Encuestas completadas
  3. **Rooms** - Salas del parque

### **API (API Gateway)**
- **Endpoints:** 10+ rutas REST
- **Autenticación:** API Key
- **Protocolo:** HTTPS REST

---

## 🔄 FLUJO TÍPICO

```
1️⃣ Usuario abre https://mi-app.com
   ↓
2️⃣ Ingresa su cédula y hace clic en "Buscar"
   ↓
3️⃣ Frontend llama: GET /users/{cedula}
   ↓
4️⃣ API Gateway valida y redirige a Lambda
   ↓
5️⃣ Lambda consulta DynamoDB
   ↓
6️⃣ DynamoDB retorna datos del usuario
   ↓
7️⃣ Lambda retorna respuesta
   ↓
8️⃣ Frontend muestra datos al usuario
   ↓
9️⃣ Usuario completa encuesta y hace clic en "Enviar"
   ↓
🔟 Frontend llama: POST /surveys
   ↓
1️⃣1️⃣ Lambda crea encuesta en DynamoDB
   ↓
1️⃣2️⃣ Frontend muestra "¡Gracias!"
```

---

## 📱 ENDPOINTS API

### **Usuarios**
```
GET    /users/{cedula}              # Obtener usuario
POST   /users                       # Crear usuario
PUT    /users/{cedula}              # Actualizar usuario
DELETE /users/{cedula}              # Eliminar usuario
```

### **Encuestas**
```
GET    /surveys/{surveyId}          # Obtener encuesta
GET    /surveys/user/{cedula}       # Encuestas de un usuario
POST   /surveys                     # Crear encuesta
PUT    /surveys/{surveyId}          # Actualizar encuesta
DELETE /surveys/{surveyId}          # Eliminar encuesta
```

### **Salas**
```
GET    /rooms                       # Obtener todas las salas
POST   /rooms                       # Crear sala
PUT    /rooms/{roomId}              # Actualizar sala
DELETE /rooms/{roomId}              # Eliminar sala
```

### **Admin**
```
GET    /admin/users                 # Todos los usuarios
GET    /admin/surveys               # Todas las encuestas
DELETE /admin/users/{cedula}        # Eliminar usuario + encuestas
```

---

## 🚀 COMANDOS COMUNES

### **Desarrollo Local**
```powershell
# Instalar dependencias
npm install

# Iniciar frontend en puerto 3000
cd frontend; npm run dev

# Iniciar Lambda local
cd ..
sam build
sam local start-api
```

### **Desplegar en AWS**
```powershell
# Compilar
sam build

# Desplegar a desarrollo
sam deploy --no-confirm-changeset

# Desplegar a producción
sam deploy --guided
```

### **Ver Logs**
```powershell
# Logs en tiempo real
aws logs tail /aws/lambda/parque-explora-survey-dev-UserServiceFunction --follow

# Logs de un período específico
aws logs filter-log-events `
  --log-group-name "/aws/lambda/parque-explora-survey-dev-UserServiceFunction" `
  --start-time (Get-Date).AddMinutes(-60).Ticks
```

### **Testing Manual**
```powershell
# Test GET
curl.exe -X GET "https://tu-api.com/rooms" `
  -H "X-Api-Key: parque-explora-api-key-2024"

# Test POST
$body = @{ cedula = "123"; nombre = "Juan" } | ConvertTo-Json
curl.exe -X POST "https://tu-api.com/users" `
  -H "Content-Type: application/json" `
  -H "X-Api-Key: parque-explora-api-key-2024" `
  -d $body
```

---

## 🔐 SEGURIDAD

**Protecciones actuales:**
- ✅ HTTPS/TLS (encriptación)
- ✅ API Key (autenticación básica)
- ✅ CORS (control de origen)
- ✅ Validación de datos
- ✅ IAM Roles (permisos granulares)

**Mejoras recomendadas (futuro):**
- 🔜 Cognito (autenticación de usuarios)
- 🔜 JWT Tokens (autenticación mejorada)
- 🔜 Rate Limiting (limitar solicitudes)
- 🔜 Encriptación de datos en reposo
- 🔜 WAF (Web Application Firewall)

---

## 💰 COSTOS (Estimado)

| Servicio | Gratuito | Después |
|----------|----------|---------|
| Lambda | 1M invocaciones | $0.0000002/inv. |
| DynamoDB | 25 GB | $0.25/GB + ops |
| API Gateway | 1M llamadas | $3.50/1M |
| **TOTAL** | ✅ $0 Año 1 | ~$1-5/mes (bajo uso) |

---

## 📚 DOCUMENTACIÓN ADICIONAL

### Dentro del proyecto:
- 📄 `README.md` - Guía de instalación
- 📄 `QUICKSTART.md` - Inicio rápido
- 📄 `ARCHITECTURE_DIAGRAM.md` - Arquitectura detallada
- 📄 `SYSTEM_DESIGN.md` - Diseño del sistema
- 📄 `TESTING.md` - Guía de testing

### Externo:
- 🔗 [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- 🔗 [DynamoDB Docs](https://docs.aws.amazon.com/dynamodb/)
- 🔗 [API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- 🔗 [SAM CLI Docs](https://docs.aws.amazon.com/serverless-application-model/)
- 🔗 [Next.js Docs](https://nextjs.org/docs)

---

## ❓ PREGUNTAS FRECUENTES

### **¿Cómo agrego un nuevo endpoint?**
→ Ver: **GUIA_CONTINUAR_DESARROLLO.md** - Sección "2. Agregar nuevo endpoint"

### **¿Cómo modifico una función Lambda?**
→ Ver: **GUIA_CONTINUAR_DESARROLLO.md** - Sección "1. Modificar función existente"

### **¿Cómo agrego una nueva tabla DynamoDB?**
→ Ver: **GUIA_CONTINUAR_DESARROLLO.md** - Sección "3. Agregar nueva tabla"

### **¿Cómo teseo mi API?**
→ Ver: **EJEMPLOS_PRACTICOS.md** - Sección "4. Testing manual"

### **¿Cómo veo los errores?**
→ Ver: **EJEMPLOS_PRACTICOS.md** - Sección "5. Debugging"

### **¿Cuánto cuesta correr esto?**
→ Ver: **DIAGRAMAS_VISUALES.md** - Sección "Costos"

### **¿Cómo despliego cambios?**
→ Ver: **GUIA_CONTINUAR_DESARROLLO.md** - Sección "4. Desplegar cambios"

---

## 🎯 ROADMAP - PRÓXIMAS FUNCIONALIDADES

**Corto plazo (1-2 semanas):**
- [ ] Agregar validación de emails
- [ ] Mejorar interfaz del admin
- [ ] Exportar datos a Excel
- [ ] Agregar filtros por fecha

**Mediano plazo (1-2 meses):**
- [ ] Autenticación con Cognito
- [ ] Notificaciones por email
- [ ] Gráficos de estadísticas
- [ ] Dashboard en tiempo real

**Largo plazo (3+ meses):**
- [ ] App móvil (React Native)
- [ ] Analytics avanzado
- [ ] Integración con CRM
- [ ] Automatizaciones (Lambda Triggers)

---

## 👥 ESTRUCTURA DE EQUIPOS

Si trabajas en equipo:

**Frontend Developer:**
→ Enfocarse en `frontend/` y conectar con endpoints API

**Backend Developer:**
→ Enfocarse en `backend/functions/` y template.yaml

**DevOps/Cloud Engineer:**
→ Gestionar AWS, despliegues, monitoreo

**QA:**
→ Usar guía de testing (`TESTING.md`, `EJEMPLOS_PRACTICOS.md`)

---

## 🆘 SOPORTE

### Si algo no funciona:

1. **Revisar logs:**
   ```powershell
   aws logs tail /aws/lambda/parque-explora-survey-dev-UserServiceFunction --follow
   ```

2. **Revisar template.yaml:**
   ```
   ¿Las tablas están definidas?
   ¿Los endpoints están mapeados?
   ¿Los permisos IAM son correctos?
   ```

3. **Revisar documentación:**
   - `GUIA_CONTINUAR_DESARROLLO.md` - Sección "Troubleshooting"

4. **Revisar ejemplos:**
   - `EJEMPLOS_PRACTICOS.md` - Sección "Manejo de errores"

---

## 📞 RESUMEN RÁPIDO DE ARCHIVOS NUEVOS

Creé 4 nuevos documentos para ti:

1. **EXPLICACION_SERVICIOS_AWS.md** (10 min lectura)
   - Explicación completa de cada servicio
   - Cómo se conectan
   - Flujo de datos

2. **EJEMPLOS_PRACTICOS.md** (15 min lectura)
   - Ejemplos de código real
   - Cómo hacer solicitudes HTTP
   - Testing y debugging

3. **GUIA_CONTINUAR_DESARROLLO.md** (20 min lectura)
   - Cómo modificar funciones existentes
   - Cómo agregar nuevos endpoints
   - Cómo desplegar cambios

4. **DIAGRAMAS_VISUALES.md** (10 min lectura)
   - Diagramas ASCII de flujos
   - Casos de error
   - Cálculo de costos

---

## ✅ CHECKLIST INICIAL

- [ ] Leí EXPLICACION_SERVICIOS_AWS.md
- [ ] Entiendo cómo funcionan los 5 servicios
- [ ] Vi los diagramas en DIAGRAMAS_VISUALES.md
- [ ] Estoy listo para empezar a codificar
- [ ] Tengo claro cómo desplegar cambios

---

**¡Listo! Ahora tienes el conocimiento completo para trabajar con tu proyecto.** 🚀

¿Necesitas ayuda con algo específico? Dime qué quieres hacer y te guío paso a paso.
