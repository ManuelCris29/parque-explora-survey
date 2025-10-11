# Guía de Despliegue - Parque Explora Survey System

## 📋 Prerrequisitos

### Herramientas Necesarias
- AWS CLI v2.x
- AWS SAM CLI v1.x
- Node.js 18.x o superior
- Git

### Configuración de AWS
```bash
# Configurar AWS CLI
aws configure

# Verificar configuración
aws sts get-caller-identity
```

## 🚀 Despliegue del Backend

### 1. Preparar el Proyecto
```bash
# Clonar el repositorio
git clone <repository-url>
cd parque-explora-survey

# Verificar estructura del proyecto
ls -la
```

### 2. Instalar Dependencias de las Funciones Lambda
```bash
# Instalar dependencias para cada función
cd backend/functions/createUser && npm install && cd ../..
cd backend/functions/getUser && npm install && cd ../..
cd backend/functions/createSurvey && npm install && cd ../..
cd backend/functions/getSurvey && npm install && cd ../..
cd backend/functions/updateSurvey && npm install && cd ../..
cd backend/functions/getRooms && npm install && cd ../..
```

### 3. Construir la Aplicación SAM
```bash
# Construir el proyecto
sam build

# Verificar que se construyó correctamente
ls .aws-sam/build/
```

### 4. Despliegue Inicial (Modo Guiado)
```bash
# Ejecutar despliegue guiado (solo la primera vez)
sam deploy --guided
```

**Parámetros del Despliegue Guiado:**
- Stack Name: `parque-explora-survey-dev`
- AWS Region: `us-east-1` (o tu región preferida)
- Parameter Environment: `dev`
- Parameter ApiKey: `parque-explora-api-key-2024`
- Allow SAM CLI IAM role creation: `Y`
- Save parameters to configuration file: `Y`
- SAM configuration file: `samconfig.toml`
- SAM configuration environment: `default`

### 5. Despliegues Posteriores
```bash
# Despliegues rápidos (usa configuración guardada)
sam deploy
```

### 6. Verificar el Despliegue
```bash
# Ver el stack desplegado
aws cloudformation describe-stacks --stack-name parque-explora-survey-dev

# Obtener outputs importantes
aws cloudformation describe-stacks \
  --stack-name parque-explora-survey-dev \
  --query 'Stacks[0].Outputs'
```

## 🌐 Despliegue del Frontend

### Opción 1: Vercel (Recomendado)

#### 1. Preparar el Proyecto
```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp env.example .env.local
```

#### 2. Configurar Variables de Entorno en Vercel
```bash
# En el dashboard de Vercel, agregar:
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
NEXT_PUBLIC_API_KEY=parque-explora-api-key-2024
```

#### 3. Desplegar
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Para producción
vercel --prod
```

### Opción 2: AWS S3 + CloudFront

#### 1. Construir para Producción
```bash
cd frontend
npm run build
npm run export
```

#### 2. Subir a S3
```bash
# Crear bucket S3
aws s3 mb s3://parque-explora-frontend

# Subir archivos
aws s3 sync out/ s3://parque-explora-frontend --delete

# Configurar como sitio web estático
aws s3 website s3://parque-explora-frontend \
  --index-document index.html \
  --error-document 404.html
```

#### 3. Configurar CloudFront (Opcional)
```bash
# Crear distribución CloudFront desde la consola AWS
# O usar AWS CDK/CloudFormation para automatizar
```

### Opción 3: Netlify

#### 1. Preparar Build
```bash
cd frontend
npm run build
```

#### 2. Desplegar
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login y deploy
netlify login
netlify deploy --prod --dir=out
```

## 🔧 Configuración Post-Despliegue

### 1. Obtener URLs de la API
```bash
# Obtener la URL de API Gateway
aws cloudformation describe-stacks \
  --stack-name parque-explora-survey-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text

# Obtener la API Key
aws cloudformation describe-stacks \
  --stack-name parque-explora-survey-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiKey`].OutputValue' \
  --output text
```

### 2. Configurar Variables de Entorno del Frontend
```bash
# Actualizar .env.local con las URLs reales
NEXT_PUBLIC_API_BASE_URL=https://your-actual-api-gateway-url.amazonaws.com/dev
NEXT_PUBLIC_API_KEY=your-actual-api-key
```

### 3. Poblar Datos Iniciales (Opcional)
```bash
# Crear salas por defecto
aws dynamodb put-item \
  --table-name dev-parque-explora-rooms \
  --item '{
    "roomId": {"S": "sala-1"},
    "nombre": {"S": "Sala de Proyección 3D"},
    "descripcion": {"S": "Experiencia inmersiva en 3D con tecnología de última generación"},
    "categoria": {"S": "Tecnología"},
    "estado": {"S": "activa"}
  }'
```

## 🧪 Testing Post-Despliegue

### 1. Verificar API Endpoints
```bash
# Test básico de health check
curl -X GET "https://your-api-url/rooms" \
  -H "x-api-key: your-api-key"
```

### 2. Crear Usuario de Prueba
```bash
curl -X POST "https://your-api-url/users" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "cedula": "12345678",
    "nombre": "Usuario Prueba",
    "email": "test@example.com",
    "telefono": "3001234567"
  }'
```

### 3. Verificar Frontend
- Abrir la URL del frontend desplegado
- Probar búsqueda de usuario
- Completar encuesta de prueba

## 🔄 Actualizaciones

### Backend
```bash
# Hacer cambios en el código
# Construir y desplegar
sam build
sam deploy
```

### Frontend
```bash
cd frontend
# Hacer cambios
npm run build

# Redesplegar según la plataforma elegida
# Vercel: git push (auto-deploy)
# S3: aws s3 sync out/ s3://bucket-name --delete
# Netlify: netlify deploy --prod
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Permisos IAM
```bash
# Verificar permisos del usuario/rol
aws sts get-caller-identity
aws iam list-attached-user-policies --user-name your-username
```

#### 2. Error de Región
```bash
# Verificar región configurada
aws configure get region
# Cambiar si es necesario
aws configure set region us-east-1
```

#### 3. Error de S3 Bucket
```bash
# Verificar que el bucket existe y es accesible
aws s3 ls s3://your-sam-bucket
```

#### 4. CORS Issues en Frontend
- Verificar configuración CORS en API Gateway
- Revisar headers en las respuestas de Lambda
- Verificar que el dominio del frontend esté permitido

### Logs y Debugging
```bash
# Ver logs de Lambda
sam logs -n CreateUserFunction --stack-name parque-explora-survey-dev

# Ver logs de API Gateway
aws logs describe-log-groups --log-group-name-prefix /aws/apigateway
```

## 📊 Monitoreo

### CloudWatch Dashboards
1. Crear dashboard en CloudWatch
2. Agregar métricas de Lambda (invocations, errors, duration)
3. Agregar métricas de API Gateway (4xx, 5xx, latency)
4. Agregar métricas de DynamoDB (read/write capacity)

### Alertas
```bash
# Crear alarmas para errores
aws cloudwatch put-metric-alarm \
  --alarm-name "Lambda-Errors" \
  --alarm-description "Lambda function errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold
```

## 🔒 Seguridad Post-Despliegue

### 1. Rotar API Keys
```bash
# Crear nueva API Key
aws apigateway create-api-key --name "parque-explora-new-key"

# Actualizar en el frontend
# Deshabilitar la API Key antigua
```

### 2. Configurar WAF (Opcional)
```bash
# Crear Web ACL
aws wafv2 create-web-acl \
  --name "ParqueExploraWAF" \
  --scope REGIONAL \
  --default-action Allow={}
```

### 3. Habilitar Logging
```bash
# Habilitar logs de API Gateway
aws apigateway update-stage \
  --rest-api-id your-api-id \
  --stage-name dev \
  --patch-ops op=replace,path=/accessLogSetting/destinationArn,value=arn:aws:logs:region:account:log-group:/aws/apigateway/parque-explora
```

---

**Nota**: Este proceso de despliegue está diseñado para ser reproducible y escalable. Siempre prueba en un entorno de desarrollo antes de desplegar en producción.
