# 🏗️ **GUÍA COMPLETA: AWS SAM - Construir Proyectos Serverless**

## 📚 **¿Qué es AWS SAM?**

**AWS Serverless Application Model (SAM)** es un framework que simplifica el desarrollo y despliegue de aplicaciones serverless usando CloudFormation.

---

## 🎯 **PARTE 1: Conceptos Fundamentales**

### **1.1 ¿Qué es un template.yaml?**
```yaml
# Es la "receta" de tu infraestructura
AWSTemplateFormatVersion: '2010-09-09'      # Versión de CloudFormation
Transform: AWS::Serverless-2016-10-31       # Convierte SAM → CloudFormation
Description: "Mi aplicación serverless"     # Descripción del proyecto
```

### **1.2 ¿Qué es samconfig.toml?**
```toml
# Es la "configuración" de cómo desplegar
[default.deploy.parameters]
stack_name = "mi-proyecto-dev"              # Nombre único del stack
region = "us-east-1"                        # Región de AWS
parameter_overrides = "Environment=dev"     # Variables personalizadas
```

---

## 🚀 **PARTE 2: Estructura de un Proyecto SAM**

### **2.1 Estructura de carpetas:**
```
mi-proyecto/
├── template.yaml              # ← Template principal
├── samconfig.toml             # ← Configuración de despliegue
├── samconfig.toml.backup      # ← Backup (opcional)
├── backend/                   # ← Código backend
│   └── functions/            # ← Lambda functions
│       ├── function1/
│       │   ├── index.js
│       │   └── package.json
│       └── function2/
│           ├── index.js
│           └── package.json
└── frontend/                  # ← Frontend (opcional)
    ├── src/
    ├── package.json
    └── next.config.js
```

### **2.2 Archivos esenciales:**
- ✅ **`template.yaml`** - OBLIGATORIO
- ✅ **`samconfig.toml`** - OBLIGATORIO para `sam deploy`
- ✅ **Código de funciones** - En `backend/functions/`

---

## 📝 **PARTE 3: Construir template.yaml Paso a Paso**

### **3.1 Encabezado del template:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: "Descripción de tu proyecto"

# Metadatos opcionales
Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: "Configuración del Proyecto"
        Parameters:
          - Environment
```

### **3.2 Parámetros (Parameters):**
```yaml
Parameters:
  # Ambiente (dev/staging/prod)
  Environment:
    Type: String
    Default: dev
    AllowedValues:
      - dev
      - staging
      - prod
    Description: "Ambiente de despliegue"
  
  # API Key personalizable
  ApiKeyValue:
    Type: String
    Default: "mi-api-key-2024"
    Description: "API Key para autenticación"
  
  # Base de datos
  DatabaseName:
    Type: String
    Default: "mi-base-datos"
    Description: "Nombre de la base de datos"
```

### **3.3 Configuración Global (Globals):**
```yaml
Globals:
  Function:
    Timeout: 30                              # Timeout para todas las Lambda
    Runtime: nodejs18.x                      # Runtime para todas las Lambda
    Environment:
      Variables:
        ENVIRONMENT: !Ref Environment        # Variable de ambiente
        API_KEY: !Ref ApiKeyValue           # API Key
        LOG_LEVEL: "INFO"                   # Nivel de logging
  
  Api:
    Cors:                                    # CORS para todas las APIs
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
      AllowOrigin: "'*'"
      MaxAge: "'600'"
```

### **3.4 Recursos (Resources) - Base de Datos:**
```yaml
Resources:
  # DynamoDB Table
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${Environment}-${AWS::StackName}-users'
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true

  # RDS Database (opcional)
  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub '${Environment}-mi-db'
      DBInstanceClass: db.t3.micro
      Engine: mysql
      MasterUsername: admin
      MasterUserPassword: !Ref DatabasePassword
      AllocatedStorage: 20
      PubliclyAccessible: false
```

### **3.5 Lambda Functions:**
```yaml
  # Función básica
  GetUsersFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${Environment}-get-users'
      CodeUri: backend/functions/getUsers/
      Handler: index.handler
      Environment:
        Variables:
          USERS_TABLE: !Ref UsersTable
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref UsersTable
      Events:
        GetUsers:
          Type: Api
          Properties:
            RestApiId: !Ref MyApi
            Path: /users
            Method: get
            Auth:
              ApiKeyRequired: true

  # Función con capas (layers)
  ProcessDataFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${Environment}-process-data'
      CodeUri: backend/functions/processData/
      Handler: index.handler
      Layers:
        - !Ref CommonLayer
      Environment:
        Variables:
          BUCKET_NAME: !Ref DataBucket
      Policies:
        - S3ReadPolicy:
            BucketName: !Ref DataBucket
      Events:
        S3Event:
          Type: S3
          Properties:
            Bucket: !Ref DataBucket
            Events: s3:ObjectCreated:*
            Filter:
              S3Key:
                Rules:
                  - Name: prefix
                    Value: uploads/

  # Función con VPC
  DatabaseFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${Environment}-database-access'
      CodeUri: backend/functions/database/
      Handler: index.handler
      VpcConfig:
        SecurityGroupIds:
          - !Ref LambdaSecurityGroup
        SubnetIds:
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2
      Environment:
        Variables:
          DB_HOST: !GetAtt Database.Endpoint.Address
          DB_NAME: !Ref DatabaseName
```

### **3.6 API Gateway:**
```yaml
  # API Gateway REST
  MyApi:
    Type: AWS::Serverless::Api
    Properties:
      Name: !Sub '${Environment}-mi-api'
      StageName: !Ref Environment
      Cors:
        AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
        AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
        AllowOrigin: "'*'"
        MaxAge: "'600'"
      GatewayResponses:
        DEFAULT_4XX:
          ResponseParameters:
            Headers:
              Access-Control-Allow-Origin: "'*'"
        DEFAULT_5XX:
          ResponseParameters:
            Headers:
              Access-Control-Allow-Origin: "'*'"

  # API Key
  ApiKey:
    Type: AWS::ApiGateway::ApiKey
    Properties:
      Name: !Sub '${Environment}-mi-api-key'
      Description: "API Key para ${Environment}"
      Enabled: true

  # Usage Plan
  UsagePlan:
    Type: AWS::ApiGateway::UsagePlan
    Properties:
      UsagePlanName: !Sub '${Environment}-usage-plan'
      Description: "Plan de uso para ${Environment}"
      ApiStages:
        - ApiId: !Ref MyApi
          Stage: !Ref Environment
      Throttle:
        BurstLimit: 100
        RateLimit: 50
      Quota:
        Limit: 10000
        Period: DAY
```

### **3.7 S3 Buckets:**
```yaml
  # Bucket para archivos
  DataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${Environment}-mi-datos-${AWS::AccountId}'
      VersioningConfiguration:
        Status: Enabled
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      LifecycleConfiguration:
        Rules:
          - Id: DeleteOldVersions
            Status: Enabled
            NoncurrentVersionExpirationInDays: 30

  # Bucket para frontend
  FrontendBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${Environment}-mi-frontend-${AWS::AccountId}'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: error.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false
```

### **3.8 Outputs (Valores de salida):**
```yaml
Outputs:
  # URL de la API
  ApiUrl:
    Description: "URL de la API Gateway"
    Value: !Sub "https://${MyApi}.execute-api.${AWS::Region}.amazonaws.com/${Environment}/"
    Export:
      Name: !Sub "${Environment}-ApiUrl"
  
  # API Key
  ApiKey:
    Description: "API Key para acceder a la API"
    Value: !Ref ApiKey
    Export:
      Name: !Sub "${Environment}-ApiKey"
  
  # URL del frontend
  FrontendUrl:
    Description: "URL del sitio web frontend"
    Value: !Sub "https://${FrontendBucket}.s3-website-${AWS::Region}.amazonaws.com"
    Export:
      Name: !Sub "${Environment}-FrontendUrl"
  
  # Bucket de datos
  DataBucketName:
    Description: "Nombre del bucket de datos"
    Value: !Ref DataBucket
    Export:
      Name: !Sub "${Environment}-DataBucket"
```

---

## ⚙️ **PARTE 4: Construir samconfig.toml**

### **4.1 Estructura básica:**
```toml
# SAM Configuration File
version = 0.1

[default]
[default.global]
[default.global.parameters]
stack_name = "mi-proyecto-dev"                    # Nombre del stack
s3_prefix = "mi-proyecto"                        # Prefijo para archivos S3
region = "us-east-1"                             # Región de AWS
confirm_changeset = true                         # Pedir confirmación
capabilities = "CAPABILITY_IAM"                  # Permisos IAM
parameter_overrides = "Environment=dev ApiKeyValue=mi-api-key-2024"
image_repositories = []

[default.build]
[default.build.parameters]
cached = true                                    # Usar cache
parallel = true                                  # Build en paralelo

[default.deploy.parameters]
resolve_s3 = true                                # Crear bucket S3 automáticamente
s3_prefix = "mi-proyecto-dev"                    # Prefijo específico para deploy
parameter_overrides = "Environment=\"dev\" ApiKeyValue=\"mi-api-key-2024\""
image_repositories = []
```

### **4.2 Configuraciones por ambiente:**
```toml
# Configuración para desarrollo
[default.deploy.parameters]
stack_name = "mi-proyecto-dev"
parameter_overrides = "Environment=\"dev\" ApiKeyValue=\"dev-key-123\""

# Configuración para staging
[staging.deploy.parameters]
stack_name = "mi-proyecto-staging"
parameter_overrides = "Environment=\"staging\" ApiKeyValue=\"staging-key-456\""

# Configuración para producción
[production.deploy.parameters]
stack_name = "mi-proyecto-prod"
parameter_overrides = "Environment=\"prod\" ApiKeyValue=\"prod-key-789\""
```

---

## 🛠️ **PARTE 5: Comandos SAM Esenciales**

### **5.1 Comandos básicos:**
```bash
# Inicializar proyecto
sam init --name mi-proyecto --runtime nodejs18.x --app-template hello-world

# Construir proyecto
sam build

# Construir con debug
sam build --debug

# Desplegar (primera vez)
sam deploy --guided

# Desplegar (después)
sam deploy

# Desplegar ambiente específico
sam deploy --config-env staging

# Ver logs en tiempo real
sam logs -n MiFunction --stack-name mi-proyecto-dev --tail

# Invocar función localmente
sam local invoke MiFunction --event events/event.json

# Iniciar API localmente
sam local start-api

# Validar template
sam validate

# Generar documentación
sam docs
```

### **5.2 Comandos avanzados:**
```bash
# Desplegar solo una función
sam deploy --function MyFunction

# Desplegar con parámetros específicos
sam deploy --parameter-overrides Environment=prod ApiKeyValue=nueva-key

# Desplegar sin confirmación
sam deploy --no-confirm-changeset

# Desplegar con rollback automático
sam deploy --fail-on-empty-changeset

# Ver diferencias antes de desplegar
sam deploy --no-execute-changeset
```

---

## 📋 **PARTE 6: Mejores Prácticas**

### **6.1 Organización de código:**
```
backend/
└── functions/
    ├── common/                    # Código compartido
    │   ├── utils.js
    │   └── constants.js
    ├── users/                     # Función específica
    │   ├── index.js
    │   ├── package.json
    │   └── tests/
    └── orders/
        ├── index.js
        ├── package.json
        └── tests/
```

### **6.2 Variables de entorno:**
```yaml
# En template.yaml
Environment:
  Variables:
    NODE_ENV: !Ref Environment
    LOG_LEVEL: !If [IsProd, "ERROR", "DEBUG"]
    API_VERSION: "v1"
```

### **6.3 Seguridad:**
```yaml
# Políticas mínimas
Policies:
  - DynamoDBReadPolicy:
      TableName: !Ref UsersTable
  - S3ReadPolicy:
      BucketName: !Ref DataBucket
  - Version: '2012-10-17'
    Statement:
      - Effect: Allow
        Action:
          - logs:CreateLogGroup
          - logs:CreateLogStream
          - logs:PutLogEvents
        Resource: !Sub 'arn:aws:logs:${AWS::Region}:${AWS::AccountId}:*'
```

### **6.4 Monitoreo:**
```yaml
# CloudWatch Alarms
ErrorAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: !Sub '${Environment}-function-errors'
    MetricName: Errors
    Namespace: AWS/Lambda
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 5
    ComparisonOperator: GreaterThanThreshold
    Dimensions:
      - Name: FunctionName
        Value: !Ref MyFunction
```

---

## 🎯 **PARTE 7: Flujo de Trabajo Completo**

### **7.1 Desarrollo local:**
```bash
# 1. Crear proyecto
sam init --name mi-proyecto

# 2. Configurar template.yaml
# 3. Configurar samconfig.toml
# 4. Desarrollar funciones

# 5. Probar localmente
sam local start-api
curl http://localhost:3000/users

# 6. Construir y desplegar
sam build
sam deploy --guided  # Primera vez
sam deploy          # Siguientes veces
```

### **7.2 CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy SAM
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install -g @aws-cli aws-sam-cli
      - run: sam build
      - run: sam deploy --no-confirm-changeset
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## 🚀 **PARTE 8: Templates para Diferentes Casos de Uso**

### **8.1 API REST Simple:**
```yaml
# Para APIs básicas con CRUD
Resources:
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: functions/api/
      Handler: index.handler
      Events:
        Api:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY
```

### **8.2 Microservicios:**
```yaml
# Para arquitectura de microservicios
Resources:
  UsersService:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${Environment}-users-service'
      CodeUri: services/users/
      
  OrdersService:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub '${Environment}-orders-service'
      CodeUri: services/orders/
```

### **8.3 Event-Driven:**
```yaml
# Para procesamiento de eventos
Resources:
  EventProcessor:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: functions/processor/
      Events:
        SQSEvent:
          Type: SQS
          Properties:
            Queue: !GetAtt EventQueue.Arn
```

---

## 📚 **PARTE 9: Recursos de Aprendizaje**

### **9.1 Documentación oficial:**
- [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/)
- [SAM CLI Reference](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)

### **9.2 Ejemplos y templates:**
- [SAM Examples](https://github.com/aws/serverless-application-model/tree/master/examples)
- [AWS Samples](https://github.com/aws-samples)

### **9.3 Herramientas útiles:**
- **SAM CLI**: `npm install -g @aws-cli aws-sam-cli`
- **AWS Toolkit for VS Code**: Extensión para IDE
- **AWS CloudFormation Designer**: Editor visual

---

## ✅ **CHECKLIST: Proyecto SAM Completo**

### **Antes de empezar:**
- [ ] AWS CLI configurado
- [ ] SAM CLI instalado
- [ ] Permisos IAM adecuados
- [ ] Región AWS seleccionada

### **Durante el desarrollo:**
- [ ] Template.yaml estructurado correctamente
- [ ] samconfig.toml configurado
- [ ] Funciones Lambda desarrolladas
- [ ] Pruebas locales realizadas
- [ ] Variables de entorno configuradas

### **Antes del despliegue:**
- [ ] `sam validate` ejecutado
- [ ] `sam build` exitoso
- [ ] Parámetros verificados
- [ ] Políticas IAM revisadas

### **Después del despliegue:**
- [ ] API funcionando
- [ ] Logs monitoreados
- [ ] Métricas configuradas
- [ ] Documentación actualizada

---

**¡Con esta guía puedes construir cualquier aplicación serverless con AWS SAM! 🚀**
