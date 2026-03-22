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

**Fecha de creación:** 2026-03-22  
**Versión:** 1.0
