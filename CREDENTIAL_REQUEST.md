# Solicitud de Credenciales - Parque Explora Survey

## ¿Necesitas ejecutar el proyecto localmente?

Este repositorio contiene **placeholders de seguridad** en lugar de credenciales reales.  
Para ejecutar el proyecto, **debes solicitar las credenciales al administrador**.

---

## 📋 Credenciales Necesarias

Completa este formulario y envíalo al administrador del proyecto:

```
Nombre: ____________________________
Email: ____________________________
Rol: ____________________________  (ej: Developer, Tester, Viewer)
Propósito: ____________________________

Fecha solicitada: ____________________________
```

---

## 🔐 Credenciales que Recibirás

El administrador te proporcionará:

1. **`NEXT_PUBLIC_API_URL`**
   - Formato: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/`
   - Ubicación: `frontend/.env.local`

2. **`NEXT_PUBLIC_API_KEY`**
   - Longitud: ~44 caracteres
   - Ubicación: `frontend/.env.local`

---

## 📝 Cómo Usar las Credenciales

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/ManuelCris29/parque-explora-survey.git
cd parque-explora-survey
```

### Paso 2: Crear `.env.local`
```bash
cd frontend
```

### Paso 3: Reemplazar Placeholders
Crea o edita `frontend/.env.local` con los valores recibidos:
```
NEXT_PUBLIC_API_URL=<credencial-recibida>
NEXT_PUBLIC_API_KEY=<credencial-recibida>
```

### Paso 4: Instalar y Ejecutar
```bash
npm install
npm run dev
```

Abre: `http://localhost:3000`

---

## ⚠️ Seguridad

- **Nunca** subas `.env.local` a Git (está en `.gitignore`).
- **Nunca** compartas credenciales por chat o email sin encriptar.
- Si comprometiste una credencial, **notifica de inmediato al admin**.
- Las credenciales expiran y deben rotarse periódicamente.

---

## 📞 Contacto

- **Admin del Proyecto:** [nombre/email]
- **Slack:** [canal]
- **Jira/Ticket:** [enlace]

---

## ✅ Checklist de Validación

Una vez que tengas las credenciales, verifica:

- [ ] `.env.local` creado en `frontend/`
- [ ] `NEXT_PUBLIC_API_URL` configurado correctamente
- [ ] `NEXT_PUBLIC_API_KEY` configurado correctamente
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` inicia sin errores
- [ ] `http://localhost:3000` carga correctamente
- [ ] El endpoint de API responde (ver logs del navegador)

---

## 🔧 Para Administradores: Desplegar Backend en AWS

Si eres el **administrador del proyecto** y necesitas desplegar el backend en AWS:

### ¿Qué es `samconfig.toml`?

`samconfig.toml` es un archivo de configuración **solo para administradores** que despliegan la infraestructura a AWS. **Los usuarios normales NO lo necesitan.**

### 📁 Ubicación y Uso

Archivo: `samconfig.toml` (raíz del proyecto)

Este archivo contiene:
- Stack name, región AWS, configuración de CloudFormation
- **Parámetros de despliegue** como `ApiKeyValue` y `OpenAIApiKey` (con placeholders)

### 🔐 Pasos para Desplegar

**SOLO EL ADMIN HACE ESTO. Los demás NO necesitan tocar este archivo.**

#### Paso 1: Reemplazar Placeholders en `samconfig.toml`

Edita el archivo y busca la sección `[default.deploy.parameters]`:

```toml
[default.deploy.parameters]
parameter_overrides = "Environment=\"dev\" ApiKeyValue=\"REPLACE_WITH_API_GATEWAY_KEY\" OpenAIApiKey=\"REPLACE_WITH_OPENAI_API_KEY\" OpenAIModel=\"gpt-4o-mini\""
```

Reemplaza:
- `REPLACE_WITH_API_GATEWAY_KEY` → tu API Gateway key real
- `REPLACE_WITH_OPENAI_API_KEY` → tu OpenAI API Key real

**Ejemplo real:**
```toml
[default.deploy.parameters]
parameter_overrides = "Environment=\"dev\" ApiKeyValue=\"jq7Ccsu8WCg5cQ4XDxXA8IVNrMIJCOm4eUWUlQYd\" OpenAIApiKey=\"sk-proj-xxxxx...\" OpenAIModel=\"gpt-4o-mini\""
```

#### Paso 2: Desplegar a AWS

```bash
# Construir la aplicación SAM
sam build

# Desplegar (usa valores de samconfig.toml)
sam deploy

# O si es la primera vez:
sam deploy --guided
```

#### Paso 3: Recuperar Credenciales para el Equipo

Una vez desplegado, obtén los valores a compartir:

```bash
# Obtener API Gateway URL
aws cloudformation describe-stacks --stack-name parque-explora-survey-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text

# Obtener API Key
aws apigateway get-api-key --api-key <KEY_ID> --include-value --query "value" --output text
```

#### Paso 4: Compartir con el Equipo

Envía SOLO estos datos por canal seguro:
- ✅ `NEXT_PUBLIC_API_URL` (URL del API Gateway)
- ✅ `NEXT_PUBLIC_API_KEY` (la key generada)

**NO compartas:**
- ❌ `samconfig.toml` completo
- ❌ Credenciales de AWS CLI
- ❌ Access Keys / Secret Keys

### ⚠️ IMPORTANTE

**NUNCA hagas commit de `samconfig.toml` con credenciales reales en Git:**

```bash
# ❌ MALO - Las credenciales quedan en el historio de Git
git add samconfig.toml
git commit -m "add credentials"

# ✅ BIEN - Edita localmente, NO hagas commit
git update-index --assume-unchanged samconfig.toml
```

O simplemente no lo versionas:
```bash
# Revertir a placeholders antes de push
git checkout samconfig.toml
```

---

## ✅ Resumen por Rol

| Rol | ¿Toca `samconfig.toml`? | ¿Toca `frontend/.env.local`? | Acción |
|-----|------------------------|-------------------------------|--------|
| **Admin** | Sí (local, no commit) | No | Deploya con `sam deploy` |
| **Developer** | No | Sí | Configura con credenciales recibidas |
| **Tester** | No | Sí | Configura con credenciales recibidas |

---

**Fecha de creación:** 2026-03-22  
**Versión:** 1.1
