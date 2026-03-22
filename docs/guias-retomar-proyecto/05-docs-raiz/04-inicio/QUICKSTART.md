# 🚀 Quick Start - Parque Explora Survey System

## ⚡ Inicio Rápido (5 minutos)

### 1. Configuración Automática
```bash
# Windows (PowerShell)
.\scripts\setup.ps1

# Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configurar Variables de Entorno
Edita `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
NEXT_PUBLIC_API_KEY=parque-explora-api-key-2024
```

### 3. Ejecutar en Desarrollo
```bash
cd frontend
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Despliegue Completo

### Backend (AWS)
```bash
# Construir
sam build

# Desplegar (primera vez)
sam deploy --guided

# Despliegues posteriores
sam deploy
```

### Frontend (Vercel)
```bash
cd frontend
npm i -g vercel
vercel
```

## 🧪 Testing Rápido

### Crear Usuario de Prueba
```bash
# Después de desplegar el backend, crear usuario con PowerShell:
Invoke-WebRequest -Uri "https://your-api-url/users" -Method POST -Headers @{"Content-Type"="application/json"; "x-api-key"="parque-explora-api-key-2024"} -Body '{"cedula": "12345678", "nombre": "Usuario Prueba", "email": "test@example.com"}'

# O poblar datos de prueba:
.\scripts\populate-test-data.ps1
```

### Probar Frontend
1. Ve a [http://localhost:3000](http://localhost:3000)
2. Ingresa cédula: `12345678`
3. Completa la encuesta

## 📱 Flujo de Usuario

1. **Compra Boleta** → Usuario se registra en sistema
2. **Visita Parque** → Usuario visita salas
3. **Accede Encuesta** → Ingresa cédula en frontend
4. **Completa Encuesta** → Evalúa salas y experiencia
5. **Envía Resultados** → Datos guardados para análisis

## 🔧 Estructura del Proyecto

```
parque-explora-survey/
├── backend/
│   └── functions/          # Lambda functions
├── frontend/               # Next.js app
├── docs/                   # Documentación
├── scripts/                # Scripts de utilidad
├── template.yaml           # SAM template
└── README.md              # Documentación completa
```

## 🆘 Problemas Comunes

### Error: "Module not found"
```bash
cd backend/functions/[function-name]
npm install
```

### Error: "API Key invalid"
- Verifica que `NEXT_PUBLIC_API_KEY` esté correcto
- Confirma que la API Key esté habilitada en AWS

### Error: "CORS"
- Verifica configuración CORS en API Gateway
- Confirma que el dominio esté permitido

## 📞 Soporte

- 📚 **Documentación completa**: [README.md](README.md)
- 🚀 **Guía de despliegue**: [docs/deployment.md](docs/deployment.md)
- 🐛 **Issues**: Abre un issue en GitHub

---

**¡Listo para usar!** 🎉
