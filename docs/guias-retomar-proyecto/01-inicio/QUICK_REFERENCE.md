# 🎯 QUICK REFERENCE - HOJA DE CONSULTA RÁPIDA

Guarda este archivo como favorito. Es tu referencia rápida de 30 segundos.

---

## 🏗️ ARQUITECTURA EN UNA LÍNEA

```
Usuario → Next.js → API Gateway → Lambda → DynamoDB → Respuesta JSON
```

---

## 🔑 5 SERVICIOS AWS

| Servicio | Qué es | Ubicación |
|----------|--------|-----------|
| **DynamoDB** | Base de datos | AWS |
| **API Gateway** | Puerta HTTP | AWS |
| **Lambda** | Funciones JS | `backend/functions/` |
| **IAM** | Permisos | AWS |
| **CloudWatch** | Logs | AWS |

---

## 📁 ARCHIVOS CLAVE

| Archivo | Qué contiene |
|---------|------------|
| `template.yaml` | Infraestructura AWS |
| `backend/functions/userService/` | CRUD Usuarios |
| `backend/functions/surveyService/` | CRUD Encuestas |
| `frontend/app/survey/` | Página de encuesta |
| `frontend/app/admin/` | Panel de admin |

---

## 🎯 ENDPOINTS

```
GET    /users/{cedula}              # Obtener usuario
POST   /users                       # Crear usuario
PUT    /users/{cedula}              # Actualizar usuario
DELETE /users/{cedula}              # Eliminar usuario

GET    /surveys/{surveyId}          # Obtener encuesta
POST   /surveys                     # Crear encuesta
PUT    /surveys/{surveyId}          # Actualizar encuesta
DELETE /surveys/{surveyId}          # Eliminar encuesta

GET    /rooms                       # Obtener salas
POST   /admin/users                 # Ver todos usuarios
```

---

## 📊 TABLAS DYNAMODB

```
Users:
  cedula (PK) | nombre | email | telefono | ...

Surveys:
  surveyId (PK) | cedula (SK) | calificacion | comentarios | ...

Rooms:
  roomId (PK) | nombre | descripcion | ...
```

---

## 🔐 AUTENTICACIÓN

**Header requerido en CADA solicitud:**
```
X-Api-Key: parque-explora-api-key-2024
```

---

## 💻 COMANDOS RÁPIDOS

```powershell
# Desplegar
sam build; sam deploy

# Ver logs
aws logs tail /aws/lambda/parque-explora-survey-dev-UserServiceFunction --follow

# Test API
curl -H "X-Api-Key: parque-explora-api-key-2024" https://api/rooms
```

---

## 🚀 CÓMO HACER UN CAMBIO

1. Edita archivo (Lambda o Frontend)
2. `sam build`
3. `sam deploy`
4. Tesea

---

## ⚠️ ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "Invalid API Key" | Verifica header X-Api-Key |
| "Table does not exist" | Revisa nombre tabla en template.yaml |
| "Access Denied" | Revisa IAM permisos en template.yaml |
| "CORS error" | Verifica CORS en template.yaml |

---

## 📞 DOCUMENTOS POR NECESIDAD

| Necesito | Leo |
|----------|-----|
| Entender todo | EXPLICACION_SERVICIOS_AWS.md |
| Ver código | EJEMPLOS_PRACTICOS.md |
| Hacer cambios | GUIA_CONTINUAR_DESARROLLO.md |
| Ver flujos | DIAGRAMAS_VISUALES.md |
| Encontrar código | UBICACION_CODIGO.md |
| Verificar conocimiento | CHECKLIST_DOMINIO.md |
| Resumen rápido | RESUMEN_UNA_PAGINA.md |

---

## 🔄 FLUJO TÍPICO (5 pasos)

```
1. Usuario ingresa cédula
   ↓
2. Frontend: GET /users/{cedula}
   ↓
3. Lambda busca en DynamoDB
   ↓
4. DynamoDB retorna datos
   ↓
5. Frontend muestra: "Hola Juan"
```

---

## 💡 TIPS RÁPIDOS

✅ Siempre incluye API Key en headers  
✅ Usa `sam local start-api` para probar local  
✅ Revisa CloudWatch logs si algo falla  
✅ DynamoDB es flexible (no necesita migration)  
✅ Desplegar toma 5-10 minutos  
✅ Primer año de AWS es gratis  

---

## 🎯 MI SIGUIENTE PASO

**Elige uno:**

- [ ] Entender: Lee EXPLICACION_SERVICIOS_AWS.md
- [ ] Ver código: Abre EJEMPLOS_PRACTICOS.md
- [ ] Hacer cambios: Sigue GUIA_CONTINUAR_DESARROLLO.md
- [ ] Verificar: Completa CHECKLIST_DOMINIO.md

---

**Guardé este archivo como favorito. Es mi referencia rápida.** ⭐
