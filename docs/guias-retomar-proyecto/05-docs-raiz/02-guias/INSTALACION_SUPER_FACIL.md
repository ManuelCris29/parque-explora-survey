# 🚀 INSTALACIÓN SÚPER FÁCIL - Sistema de Encuestas Parque Explora

## 📋 ¿Qué vas a instalar?
Un sistema web completo donde:
- Los visitantes llenan encuestas sobre el parque
- Los administradores ven todas las respuestas
- Todo funciona en internet (AWS)

## ⏱️ Tiempo estimado: 30-45 minutos

---

## 📥 PASO 1: Descargar Programas

### 1.1 Node.js (Para hacer funcionar la página web)
1. Ve a: **https://nodejs.org/**
2. Haz clic en el botón verde **"LTS"**
3. Descarga e instala como cualquier programa
4. ✅ **Verifica**: Abre PowerShell y escribe `node --version`

### 1.2 Git (Para descargar el código)
1. Ve a: **https://git-scm.com/downloads**
2. Descarga para Windows
3. Instala con todas las opciones por defecto
4. ✅ **Verifica**: En PowerShell escribe `git --version`

### 1.3 Crear cuenta AWS (Para subir a internet)
1. Ve a: **https://aws.amazon.com/**
2. Haz clic en "Create an AWS Account"
3. Sigue el proceso (necesitas tarjeta de crédito, pero no te cobran nada)
4. ✅ **Verifica**: Puedes iniciar sesión en AWS

---

## 🔧 PASO 2: Instalar Herramientas AWS

### 2.1 Abrir PowerShell como Administrador
1. Presiona **Windows + X**
2. Selecciona **"Windows PowerShell (Admin)"**

### 2.2 Instalar AWS CLI
```powershell
winget install Amazon.AWSCLI
```

### 2.3 Instalar SAM CLI
```powershell
winget install Amazon.SAM-CLI
```

### 2.4 Reiniciar PowerShell
1. Cierra PowerShell
2. Abre PowerShell de nuevo (como administrador)

---

## 📁 PASO 3: Descargar el Proyecto

### 3.1 Descargar código
```powershell
git clone https://github.com/ManuelCris29/parque-explora-survey.git
cd parque-explora-survey

```

### 3.2 Verificar que se descargó
Deberías ver varias carpetas: `backend`, `frontend`, `scripts`

---

## 🔑 PASO 4: Configurar AWS

### 4.1 Obtener credenciales AWS
1. Ve a **https://aws.amazon.com/** e inicia sesión
2. Haz clic en tu nombre (esquina superior derecha)
3. Selecciona **"My Security Credentials"**
4. Haz clic en **"Create access key"**
5. Selecciona **"Command Line Interface (CLI)"**
6. Copia la **Access Key ID** y **Secret Access Key**

### 4.2 Configurar en tu computadora
```powershell
aws configure
```

**Cuando te pregunte, pega:**
- AWS Access Key ID: [Tu Access Key]
- AWS Secret Access Key: [Tu Secret Key]
- Default region name: `us-east-1`
- Default output format: `json`

---

## 🌐 PASO 5: Subir a Internet (AWS)

### 5.1 Construir el proyecto
```powershell
sam build
```
*Esto puede tomar 2-3 minutos*

### 5.2 Subir a AWS
```powershell
sam deploy --guided
```

**Responde así a cada pregunta:**
- Stack Name: `parque-explora-survey-dev`
- AWS Region: `us-east-1`
- Parameter Environment: `dev`
- Parameter ApiKeyValue: `parque-explora-api-key-2024`
- Allow SAM CLI IAM role creation: `Y`
- Disable rollback: `N`
- Save parameters to configuration file: `Y`

### 5.3 ¡IMPORTANTE! Copiar la URL
Al final verás algo como:
```
ApiUrl = https://abc123def456.execute-api.us-east-1.amazonaws.com/dev/
```
**¡COPIA ESA URL COMPLETA!**

---

## 💻 PASO 6: Instalar la Página Web

### 6.1 Ir a la carpeta del frontend
```powershell
cd frontend
```

### 6.2 Instalar dependencias
```powershell
npm install
```
*Esto puede tomar 1-2 minutos*

### 6.3 Configurar la conexión
```powershell
# Usar la URL real del proyecto:
echo "NEXT_PUBLIC_API_URL=https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/" > .env.local
echo "NEXT_PUBLIC_API_KEY=REPLACE_WITH_API_KEY" >> .env.local
```

**Tu configuración real:**
```powershell
echo "NEXT_PUBLIC_API_URL=https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/" > .env.local
echo "NEXT_PUBLIC_API_KEY=REPLACE_WITH_API_KEY" >> .env.local
```

---

## 🚀 PASO 7: ¡Ejecutar el Sistema!

### 7.1 Iniciar el servidor
```powershell
npm run dev
```

### 7.2 Abrir en el navegador
1. Ve a: **http://localhost:3000**
2. ¡Deberías ver la página del Parque Explora!

---

## 🧪 PASO 8: Crear Datos de Prueba

### 8.1 Abrir otra ventana de PowerShell
1. Abre PowerShell de nuevo
2. Ve a la carpeta del proyecto:
```powershell
cd parque-explora-survey
```

### 8.2 Ejecutar script de datos
```powershell
.\scripts\populate-test-data.ps1
```

### 8.3 Probar el sistema
1. Ve a **http://localhost:3000**
2. Busca por cédula: `12345678`
3. ¡Deberías ver una encuesta completa!

---

## 🎉 ¡FELICIDADES! Tu sistema está funcionando

### ¿Qué puedes hacer ahora?

**👥 Para visitantes:**
- Ve a http://localhost:3000
- Busca por cualquier cédula
- Llena la encuesta

**👨‍💼 Para administradores:**
- Ve a http://localhost:3000/admin
- Ve todas las encuestas
- Edita, ve y borra datos

---

## 🆘 ¿Algo salió mal?

### Error: "No se reconoce como comando"
**Significa que no instalaste algo bien**

**Soluciones:**
```powershell
# Para AWS CLI:
winget install Amazon.AWSCLI

# Para SAM CLI:
winget install Amazon.SAM-CLI

# Para Git: Ve a https://git-scm.com/downloads
```

### Error: "aws configure"
**Significa que no tienes credenciales AWS**

**Solución:**
1. Ve a https://aws.amazon.com/
2. Inicia sesión → Tu nombre → My Security Credentials
3. Create access key → Command Line Interface
4. Copia Access Key y Secret Key
5. Úsalas en `aws configure`

### Error: "sam deploy failed"
**Significa que falló al subir a AWS**

**Solución:**
```powershell
# Borra todo y empieza de nuevo:
aws cloudformation delete-stack --stack-name parque-explora-survey-dev --region us-east-1

# Espera 5 minutos y vuelve a intentar:
sam deploy --guided
```

### Error: "npm install failed"
**Significa que Node.js no está bien**

**Solución:**
1. Ve a https://nodejs.org/
2. Descarga LTS e instala de nuevo
3. Reinicia PowerShell
4. `npm install` de nuevo

### Error: "No se puede conectar a localhost:3000"
**Significa que el servidor no está corriendo**

**Solución:**
```powershell
cd parque-explora-survey\frontend
npm run dev
```

### Error: "CORS policy"
**Significa que la URL de la API está mal**

**Solución:**
1. Verifica que copiaste bien la URL del paso 5
2. Edita `.env.local`
3. Asegúrate que empiece con `https://` y termine con `/dev/`

---

## 📞 ¿Necesitas ayuda?

Si sigues teniendo problemas:
1. ✅ Revisa que instalaste todo correctamente
2. ✅ Asegúrate de tener cuenta AWS
3. ✅ Verifica que copiaste bien la URL de la API
4. ✅ Prueba reiniciar PowerShell y empezar de nuevo

---

## 🎯 ¿Qué sigue?

Una vez que todo funcione:
1. **Personaliza**: Cambia colores, textos, etc.
2. **Agrega datos**: Crea más usuarios de prueba
3. **Despliega**: Sube el frontend a Vercel o Netlify
4. **Comparte**: Otros pueden usar tu sistema

**¡Disfruta tu nuevo sistema de encuestas!** 🎡
