# Parque Explora Survey

Sistema de encuestas (Frontend `Next.js` + Backend Serverless en AWS con `API Gateway`, `Lambda` y `DynamoDB`).

## Estado del repo
- Backend e infraestructura definidos en `template.yaml`.
- Frontend en `frontend/`.
- Documentación completa organizada en `docs/guias-retomar-proyecto/`.

## Automatización de insights (OpenAI + Heurística)
El proyecto tiene automatización dual para el módulo de insights:

- **Proveedor principal: OpenAI** (`gpt-4o-mini`) para generar recomendaciones y análisis enriquecido.
- **Fallback automático: Heurística local** cuando OpenAI no está disponible (por cuota, rate limit, credenciales o error temporal).

Esto garantiza continuidad operativa: siempre hay respuesta de insights, incluso si el proveedor externo falla.

## Inicio rápido (solo frontend, usando AWS ya desplegado)
Si la API ya existe en AWS (como en tu otro equipo), **no necesitas desplegar AWS de nuevo**.

1. Instala dependencias del frontend.
2. Crea `frontend/.env.local` desde `frontend/env.example`.
3. Solicita al administrador del proyecto los valores de `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_API_KEY`.
4. Ejecuta en local.

```powershell
npm --prefix "frontend" install
Copy-Item "frontend\env.example" "frontend\.env.local" -Force
npm --prefix "frontend" run dev
```

Luego abre: `http://localhost:3000`

> Seguridad: este repositorio usa placeholders en archivos versionados. Las credenciales reales deben compartirse por canal seguro y no deben subirse a Git.

## 🔑 Obtener Credenciales de Acceso

Este proyecto requiere credenciales para ejecutar el frontend. **No están incluidas en el repositorio por seguridad.**

### 📁 Dónde Configurar las Credenciales

Cuando recibas las credenciales del administrador, **edita este archivo:**

```
frontend/.env.local
```

Y reemplaza los placeholders con tus valores reales:

```env
NEXT_PUBLIC_API_URL=<credencial-recibida>
NEXT_PUBLIC_API_KEY=<credencial-recibida>
```

**Ejemplo:**
```env
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/
NEXT_PUBLIC_API_KEY=tu_clave_api_real_aqui
```

> ⚠️ **Importante:** El archivo `frontend/.env.local` está protegido por `.gitignore` y **nunca** debe subirse a Git.

👉 **[Ver: CREDENTIAL_REQUEST.md](./CREDENTIAL_REQUEST.md)** para:
- Solicitar credenciales al administrador
- Pasos completos de configuración
- Checklist de validación

## ¿Cuándo sí necesitas AWS CLI/SAM?
Solo si vas a:
- Desplegar backend/infrastructura (`sam build`, `sam deploy`).
- Crear/editar recursos AWS (API Gateway, Lambda, DynamoDB).
- Ejecutar backend local con SAM.

## Estructura principal
- `frontend/`: aplicación web Next.js.
- `backend/functions/`: lambdas (`userService`, `surveyService`, `roomService`).
- `template.yaml`: infraestructura serverless.
- `docs/guias-retomar-proyecto/`: documentación completa organizada.

## Documentación
### Punto de entrada recomendado
- `docs/guias-retomar-proyecto/01-inicio/00_COMIENZA_AQUI.md`

### Referencias clave
- `docs/guias-retomar-proyecto/01-inicio/RESUMEN_UNA_PAGINA.md`
- `docs/guias-retomar-proyecto/01-inicio/QUICK_REFERENCE.md`
- `docs/guias-retomar-proyecto/02-explicaciones/EXPLICACION_SERVICIOS_AWS.md`
- `docs/guias-retomar-proyecto/03-practica/GUIA_CONTINUAR_DESARROLLO.md`
- `docs/guias-retomar-proyecto/04-indices/INDICE_DOCUMENTACION.md`

## Nota
El contenido largo del README original quedó en:
- `docs/guias-retomar-proyecto/05-docs-raiz/04-inicio/README.md`
