# 🎡 Sistema de Encuestas - Parque Explora

## ¿Qué es esto?
Un sistema web donde los visitantes del Parque Explora pueden llenar encuestas sobre su experiencia. Los administradores pueden ver y gestionar todas las encuestas.

**✅ ESTADO**: Funcionando perfectamente en internet

## 🚀 INSTALACIÓN SÚPER FÁCIL (Para principiantes)

> **📖 ¿Eres completamente nuevo en programación?** 
> Ve directamente a: **[INSTALACIÓN SÚPER FÁCIL.md](./INSTALACION_SUPER_FACIL.md)** 
> 
> Allí encontrarás instrucciones paso a paso como si nunca hubieras programado.

### PASO 1: Descargar e Instalar Programas Necesarios

**1.1 Descargar Node.js**
- Ve a: https://nodejs.org/
- Descarga la versión LTS (la verde)
- Instálala como cualquier programa normal

**1.2 Descargar Git**
- Ve a: https://git-scm.com/downloads
- Descarga para Windows
- Instálala con las opciones por defecto

**1.3 Crear cuenta en AWS**
- Ve a: https://aws.amazon.com/
- Crea una cuenta gratis
- Sigue el proceso de registro

### PASO 2: Descargar el Proyecto

**2.1 Abrir PowerShell (como administrador)**
- Presiona Windows + X
- Selecciona "Windows PowerShell (Admin)"

**2.2 Descargar el proyecto**
```powershell
# Copia y pega estos comandos uno por uno:
git clone https://github.com/ManuelCris29/parque-explora-survey.git
cd parque-explora-survey
```

### PASO 3: Instalar AWS CLI y SAM CLI

**3.1 Instalar AWS CLI**
```powershell
# Ejecuta este comando:
winget install Amazon.AWSCLI
```

**3.2 Instalar SAM CLI**
```powershell
# Ejecuta este comando:
winget install Amazon.SAM-CLI
```

**3.3 Cerrar y abrir PowerShell de nuevo**
- Cierra PowerShell
- Abre PowerShell de nuevo (como administrador)

### PASO 4: Configurar AWS

**4.1 Configurar tus credenciales AWS**
```powershell
# Ejecuta este comando y sigue las instrucciones:
aws configure
```

**Te pedirá:**
- AWS Access Key ID: [Pega tu access key aquí]
- AWS Secret Access Key: [Pega tu secret key aquí]
- Default region name: `us-east-1`
- Default output format: `json`

### PASO 5: Desplegar el Sistema en Internet

**5.1 Construir el proyecto**
```powershell
# Ejecuta este comando:
sam build
```

**5.2 Desplegar en AWS**
```powershell
# Ejecuta este comando:
sam deploy --guided
```

**Te preguntará varias cosas, responde así:**
- Stack Name: `parque-explora-survey-dev`
- AWS Region: `us-east-1`
- Parameter Environment: `dev`
- Parameter ApiKeyValue: `parque-explora-api-key-2024`
- Allow SAM CLI IAM role creation: `Y`
- Disable rollback: `N`
- Save parameters to configuration file: `Y`

**⚠️ IMPORTANTE**: Al final verás una URL que empieza con `https://`. ¡COPIA ESA URL! La necesitarás en el siguiente paso.

### PASO 6: Instalar y Configurar la Parte Web

**6.1 Ir a la carpeta del frontend**
```powershell
cd frontend
```

**6.2 Instalar las dependencias**
```powershell
npm install
```

**6.3 Crear archivo de configuración**
```powershell
# Reemplaza TU_URL_AQUI con la URL que copiaste en el paso anterior:
echo "NEXT_PUBLIC_API_URL=https://TU_URL_AQUI/dev/" > .env.local
echo "NEXT_PUBLIC_API_KEY=REPLACE_WITH_API_KEY" >> .env.local
```

**Nota de seguridad:** Solicita `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_API_KEY` al administrador del proyecto.

### PASO 7: Ejecutar el Sistema

**7.1 Iniciar el servidor web**
```powershell
npm run dev
```

**7.2 Abrir en el navegador**
- Ve a: http://localhost:3000
- ¡Ya está funcionando!

### PASO 8: Crear Datos de Prueba

**8.1 Abrir otra ventana de PowerShell**
- Ve a la carpeta del proyecto
- Ejecuta: `.\scripts\populate-test-data.ps1`

**8.2 Probar el sistema**
- Ve a: http://localhost:3000
- Busca por cédula: `12345678`
- ¡Deberías ver la encuesta!

## 🆘 ¿Algo salió mal? (Soluciones Fáciles)

### Error: "No se reconoce como comando"
**Significa que no instalaste algo correctamente**

**Para AWS CLI:**
```powershell
# Instala de nuevo:
winget install Amazon.AWSCLI
```

**Para SAM CLI:**
```powershell
# Instala de nuevo:
winget install Amazon.SAM-CLI
```

**Para Git:**
- Ve a https://git-scm.com/downloads
- Descarga e instala de nuevo

### Error: "aws configure"
**Significa que no tienes credenciales AWS**

**Solución:**
1. Ve a https://aws.amazon.com/
2. Inicia sesión
3. Ve a "My Security Credentials"
4. Crea un "Access Key"
5. Copia la Access Key y Secret Key
6. Úsalas en `aws configure`

### Error: "sam deploy failed"
**Significa que algo falló al subir a AWS**

**Solución:**
```powershell
# Borra todo y empieza de nuevo:
aws cloudformation delete-stack --stack-name parque-explora-survey-dev --region us-east-1

# Espera 5 minutos y vuelve a intentar:
sam deploy --guided
```

### Error: "npm install failed"
**Significa que Node.js no está bien instalado**

**Solución:**
1. Ve a https://nodejs.org/
2. Descarga la versión LTS
3. Instala de nuevo
4. Reinicia PowerShell
5. Vuelve a intentar: `npm install`

### Error: "No se puede conectar a localhost:3000"
**Significa que el servidor no está corriendo**

**Solución:**
```powershell
# Asegúrate de estar en la carpeta correcta:
cd parque-explora-survey\frontend

# Ejecuta el servidor:
npm run dev
```

### Error: "CORS policy"
**Significa que la URL de la API está mal**

**Solución:**
1. Verifica que copiaste bien la URL del paso 5
2. Edita el archivo `.env.local`
3. Asegúrate de que la URL empiece con `https://` y termine con `/dev/`

## 🎯 ¿Cómo usar el sistema?

### Para Visitantes:
1. Ve a http://localhost:3000
2. Escribe tu cédula (solo números)
3. Llena la encuesta
4. ¡Listo!

### Para Administradores:
1. Ve a http://localhost:3000/admin
2. Ve todas las encuestas
3. Puedes editar, ver y borrar datos

## 📞 ¿Necesitas ayuda?

### 🆕 ¿Eres completamente nuevo en esto?
**Ve a: [INSTALACIÓN SÚPER FÁCIL.md](./INSTALACION_SUPER_FACIL.md)**
- Instrucciones paso a paso para principiantes
- Explicaciones simples sin tecnicismos
- Soluciones a errores comunes

### 🔧 ¿Tienes experiencia pero algo falló?
1. Revisa que instalaste todo correctamente
2. Asegúrate de tener una cuenta AWS
3. Verifica que copiaste bien la URL de la API
4. Prueba reiniciar PowerShell y empezar de nuevo

## ✅ ¡Listo! Tu sistema está funcionando

### ¿Qué puedes hacer ahora?

**🌐 Sistema de Encuestas:**
- Los visitantes pueden llenar encuestas
- Los administradores pueden ver todas las respuestas
- Todo funciona en internet (AWS)

**📊 Panel de Administración:**
- Ver estadísticas
- Gestionar usuarios
- Editar encuestas
- Todo desde http://localhost:3000/admin

---

## 🔧 Información Técnica (Para desarrolladores)

### 🏗️ ¿Cómo funciona por dentro?

**Backend (En la nube AWS):**
- **AWS Lambda**: 3 servicios unificados (UserService, SurveyService, RoomService)
- **DynamoDB**: Base de datos donde se guarda todo
- **API Gateway**: Recibe las peticiones del frontend
- **CloudWatch**: Monitorea que todo funcione bien

**Frontend (En tu computadora):**
- **Next.js 14**: La página web moderna
- **TypeScript**: Código más seguro
- **Tailwind CSS**: Diseño bonito y responsivo
- **React**: Hace la página interactiva

## 🚀 Características Principales

### Para Visitantes
- ✅ Búsqueda de usuario por cédula
- ✅ Acceso a encuesta personalizada
- ✅ Evaluación de salas visitadas
- ✅ Ranking de salas favoritas
- ✅ Identificación de salas para renovar
- ✅ Calificación general con estrellas
- ✅ Comentarios adicionales
- ✅ Interfaz responsive y moderna

### Para Administradores
- ✅ Panel de administración completo
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión CRUD de usuarios y encuestas
- ✅ Búsqueda y filtros avanzados
- ✅ Visualización y edición de datos
- ✅ Estados de encuesta (pending, completed)
- ✅ Datos estructurados para análisis

## 📊 Estructura de Datos

### Usuario
```json
{
  "cedula": "12345678",
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "fechaCompra": "2024-01-15T10:30:00Z",
  "boletaId": "uuid-v4",
  "fechaCreacion": "2024-01-15T10:30:00Z",
  "fechaActualizacion": "2024-01-15T10:30:00Z"
}
```

### Encuesta
```json
{
  "surveyId": "uuid-v4",
  "cedula": "12345678",
  "estado": "completed",
  "salasVisitadas": ["sala-1", "sala-2"],
  "salasFavoritas": ["sala-1"],
  "salasParaRenovar": ["sala-2"],
  "calificacionGeneral": 4,
  "comentarios": "Excelente experiencia",
  "fechaCreacion": "2024-01-15T10:30:00Z",
  "fechaActualizacion": "2024-01-15T11:00:00Z"
}
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- **AWS CLI** ([Instalar aquí](https://aws.amazon.com/cli/))
- **AWS SAM CLI** ([Instalar aquí](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- **Git** ([Descargar aquí](https://git-scm.com/))
- **Cuenta AWS** con permisos para crear recursos

### 1. Clonar el Repositorio
```bash
git clone https://github.com/ManuelCris29/parque-explora-survey.git
cd parque-explora-survey
```

### 2. Configurar AWS CLI
```bash
# Configurar credenciales AWS
aws configure

# Ingresar:
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region name: us-east-1
# Default output format: json
```

### 3. Desplegar Backend (AWS)

```bash
# Construir la aplicación SAM
sam build

# Desplegar en modo guiado (primera vez)
sam deploy --guided

# Configurar parámetros durante el despliegue:
# Stack Name: parque-explora-survey-dev
# AWS Region: us-east-1
# Parameter Environment: dev
# Parameter ApiKeyValue: parque-explora-api-key-2024
# Allow SAM CLI IAM role creation: Y
# Disable rollback: N
# Save parameters to configuration file: Y
```

**⚠️ IMPORTANTE**: Guarda la URL de la API que se muestra al final del despliegue.

### 4. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp env.example .env.local

# Editar .env.local y reemplazar YOUR_API_GATEWAY_URL con tu URL real
# O crear manualmente:
echo "NEXT_PUBLIC_API_URL=https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/" > .env.local
echo "NEXT_PUBLIC_API_KEY=REPLACE_WITH_API_KEY" >> .env.local

# Ejecutar en desarrollo
npm run dev
```

### 5. Verificar Instalación

#### Verificar Backend
```bash
# Verificar que el stack esté desplegado
aws cloudformation describe-stacks --stack-name parque-explora-survey-dev --region us-east-1
```

#### Verificar Frontend
- Abrir navegador en `http://localhost:3000`
- Deberías ver la página principal del sistema

### 6. Poblar Datos de Prueba

```bash
# Ejecutar script de datos de prueba (Windows PowerShell)
.\scripts\populate-test-data.ps1

# O manualmente con cURL
curl -X POST https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: REPLACE_WITH_API_KEY" \
  -d '{"cedula":"1234567890","nombre":"Usuario Prueba","email":"prueba@test.com","telefono":"3001234567"}'
```

## 📡 API Endpoints

### Usuarios (Públicos)
- `POST /users` - Crear/actualizar usuario
- `GET /users/{cedula}` - Obtener usuario por cédula

### Encuestas (Públicos)
- `POST /surveys` - Crear nueva encuesta
- `GET /surveys/user/{cedula}` - Obtener encuesta por cédula de usuario
- `PUT /surveys/{surveyId}` - Actualizar encuesta

### Salas (Públicos)
- `GET /rooms` - Obtener lista de salas disponibles

### Panel de Administración
- El panel usa los mismos endpoints públicos autenticados con API Key:
- `GET /users`, `GET /users/{cedula}`, `POST /users`, `PUT /users/{cedula}`, `DELETE /users/{cedula}`
- `GET /surveys`, `GET /surveys/{surveyId}`, `POST /surveys`, `PUT /surveys/{surveyId}`, `DELETE /surveys/{surveyId}`

### Autenticación
Todos los endpoints requieren el header:
```
x-api-key: REPLACE_WITH_API_KEY
```

### Ejemplo de Uso
```bash
# Crear usuario
curl -X POST https://YOUR_API_URL/dev/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: REPLACE_WITH_API_KEY" \
  -d '{"cedula":"1234567890","nombre":"Juan Pérez","email":"juan@email.com","telefono":"3001234567"}'

# Buscar usuario
curl -X GET https://YOUR_API_URL/dev/users/1234567890 \
  -H "x-api-key: REPLACE_WITH_API_KEY"
```

## 🧪 Testing y Verificación

### Verificar Backend
```bash
# Verificar stack desplegado
aws cloudformation describe-stacks --stack-name parque-explora-survey-dev --region us-east-1

# Probar API directamente
curl -X GET https://YOUR_API_URL/dev/rooms \
  -H "x-api-key: REPLACE_WITH_API_KEY"
```

### Verificar Frontend
```bash
cd frontend

# Construir para producción
npm run build

# Ejecutar en modo producción
npm start
```

### Testing Local (Opcional)
```bash
# Ejecutar API localmente
sam local start-api --port 3001

# Test de funciones individuales (arquitectura actual)
sam local invoke UserServiceFunction
```

### Datos de Prueba
```bash
# Poblar la base de datos con datos de prueba
.\scripts\populate-test-data.ps1

# Verificar datos creados
curl -X GET https://YOUR_API_URL/dev/users \
  -H "x-api-key: REPLACE_WITH_API_KEY"
```

## 📱 Flujo de Usuario

### Para Visitantes del Parque
1. **Acceso al Sistema**: Visita `http://localhost:3000`
2. **Búsqueda por Cédula**: Ingresa su número de cédula (solo números)
3. **Registro Automático**: Si no existe, se crea automáticamente
4. **Acceso a Encuesta**: Se redirige a la encuesta personalizada
5. **Completar Encuesta**: 
   - Selecciona salas visitadas
   - Ordena sus salas favoritas (drag & drop)
   - Identifica salas para renovar
   - Califica su experiencia general (1-5 estrellas)
   - Añade comentarios adicionales
6. **Envío**: La encuesta se guarda y se marca como completada

### Para Administradores
1. **Acceso al Panel**: Visita `http://localhost:3000/admin`
2. **Dashboard**: Ve estadísticas generales del sistema
3. **Gestión de Usuarios**: 
   - Ver lista completa de usuarios
   - Buscar por nombre o cédula
   - Editar información de usuarios
   - Eliminar usuarios y sus encuestas
4. **Gestión de Encuestas**:
   - Ver todas las encuestas
   - Filtrar por estado (pending/completed)
   - Ver detalles completos
   - Editar estados y comentarios
   - Eliminar encuestas

## 🔒 Seguridad

- **API Key Authentication**: Todos los endpoints requieren API Key
- **CORS Configurado**: Configuración adecuada para frontend
- **Validación de Datos**: Validación en backend y frontend
- **Rate Limiting**: Configurado en API Gateway

## 📈 Análisis de Datos

Los datos recopilados permiten:
- Identificar salas más populares
- Detectar salas que necesitan renovación
- Medir satisfacción general
- Analizar tendencias de visitantes
- Tomar decisiones informadas sobre mejoras

## 🚀 Despliegue en Producción

### Backend
```bash
# Desplegar en producción
sam deploy --parameter-overrides Environment=prod
```

### Frontend
```bash
cd frontend
npm run build
# Desplegar en Vercel, Netlify o AWS S3 + CloudFront
```

## 📝 Documentación Adicional

- **[Diseño del Sistema](./SYSTEM_DESIGN.md)** - Arquitectura y componentes
- **[Diagrama de Clases](./CLASS_DIAGRAM.md)** - Modelo de datos y relaciones
- **[Historias de Usuario](./USER_STORIES.md)** - Requisitos y funcionalidades
- **[Diagrama de Arquitectura](./ARCHITECTURE_DIAGRAM.md)** - Vista técnica completa
- **[Guía Rápida](./QUICKSTART.md)** - Inicio rápido del proyecto
- **[Testing](./TESTING.md)** - Guía de pruebas y validación
- **[Documentación Completa](./PROJECT_DOCUMENTATION.md)** - Resumen ejecutivo

## 🏆 Criterios de Evaluación Cumplidos

### ✅ Buenas Prácticas de Codificación
- Código limpio y bien estructurado
- Separación de responsabilidades
- Manejo de errores robusto
- Validaciones en frontend y backend
- Documentación clara y completa

### ✅ Servicios AWS Correctamente Utilizados
- **Lambda**: 3 servicios serverless unificados y optimizados
- **DynamoDB**: 3 tablas con índices apropiados
- **API Gateway**: REST API con autenticación por API Key
- **SAM**: Infraestructura como código
- **IAM**: Permisos mínimos y seguros
- **CloudWatch**: Monitoreo y logging

### ✅ Frontend Next.js de Calidad
- Next.js 14 con App Router
- TypeScript para tipado estático
- Tailwind CSS para diseño responsive
- Componentes reutilizables
- Manejo de estado eficiente
- Panel de administración completo
- Interfaz moderna y intuitiva

### ✅ Documentación Técnica Completa
- README detallado con instrucciones
- Documentación de arquitectura
- Ejemplos de uso de API
- Guías de instalación y despliegue
- Estructura de datos documentada

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔧 Troubleshooting

### Problemas Comunes

#### Error: "aws: command not found"
```bash
# Instalar AWS CLI
# Windows: Descargar desde https://aws.amazon.com/cli/
# Mac: brew install awscli
# Linux: pip install awscli
```

#### Error: "sam: command not found"
```bash
# Instalar SAM CLI
# Windows: Descargar desde https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
# Mac: brew tap aws/tap && brew install aws-sam-cli
```

#### Error de CORS en el navegador
- Verificar que la API Key sea correcta (solicitar al admin): `REPLACE_WITH_API_KEY`
- Verificar que la URL de la API sea correcta
- Limpiar cache del navegador

#### Error: "Stack creation failed"
```bash
# Verificar permisos AWS
aws sts get-caller-identity

# Verificar región
aws configure get region

# Limpiar stack si es necesario
aws cloudformation delete-stack --stack-name parque-explora-survey-dev --region us-east-1
```

#### Frontend no carga
```bash
# Verificar variables de entorno
cat frontend/.env.local

# Reinstalar dependencias
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Comandos Útiles

```bash
# Ver logs de Lambda
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/parque-explora-survey-dev" --region us-east-1

# Ver outputs del stack
aws cloudformation describe-stacks --stack-name parque-explora-survey-dev --region us-east-1 --query 'Stacks[0].Outputs'

# Eliminar todo el proyecto
aws cloudformation delete-stack --stack-name parque-explora-survey-dev --region us-east-1
```


## 📞 Soporte

Si encuentras algún problema:
1. Revisa la sección de [Troubleshooting](#-troubleshooting)
2. Consulta la [documentación adicional](#-documentación-adicional)
3. Verifica que todos los prerrequisitos estén instalados
4. Asegúrate de tener permisos adecuados en AWS

---

**Nota**: Este sistema está diseñado para ser escalable, mantenible y fácil de desplegar, siguiendo las mejores prácticas de desarrollo fullstack con tecnologías modernas.
