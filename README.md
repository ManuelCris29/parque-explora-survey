# Parque Explora Survey

Sistema de encuestas (Frontend `Next.js` + Backend Serverless en AWS con `API Gateway`, `Lambda` y `DynamoDB`).

## Estado del repo
- Backend e infraestructura definidos en `template.yaml`.
- Frontend en `frontend/`.
- Documentación completa organizada en `docs/guias-retomar-proyecto/`.

## Inicio rápido (solo frontend, usando AWS ya desplegado)
Si la API ya existe en AWS (como en tu otro equipo), **no necesitas desplegar AWS de nuevo**.

1. Instala dependencias del frontend.
2. Crea `frontend/.env.local` desde `frontend/env.example`.
3. Ejecuta en local.

```powershell
npm --prefix "frontend" install
Copy-Item "frontend\env.example" "frontend\.env.local" -Force
npm --prefix "frontend" run dev
```

Luego abre: `http://localhost:3000`

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
