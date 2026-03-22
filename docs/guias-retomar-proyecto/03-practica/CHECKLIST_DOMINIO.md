# ✅ CHECKLIST INTERACTIVO - DOMINA TU PROYECTO

Usa este checklist para ir paso a paso y verificar que entiendes cada cosa.

---

## 📖 FASE 1: ENTENDER LA ARQUITECTURA (30 minutos)

### Nivel 1: Conceptos básicos
- [ ] Entiendo qué es DynamoDB (base de datos NoSQL)
- [ ] Entiendo qué es Lambda (funciones sin servidor)
- [ ] Entiendo qué es API Gateway (puerta de entrada HTTP)
- [ ] Entiendo qué es IAM (control de acceso)
- [ ] Entiendo qué es AWS SAM (forma de desplegar)

**Si no entiendes algo:** Lee EXPLICACION_SERVICIOS_AWS.md sección "LOS 5 SERVICIOS"

### Nivel 2: Cómo se conectan
- [ ] Entiendo el flujo: Frontend → API Gateway → Lambda → DynamoDB
- [ ] Entiendo cómo se envía una solicitud HTTP con API Key
- [ ] Entiendo cómo Lambda consulta DynamoDB
- [ ] Entiendo cómo se retorna la respuesta al Frontend

**Si no entiendes algo:** Lee DIAGRAMAS_VISUALES.md sección "FLUJO COMPLETO"

### Nivel 3: Tu proyecto específicamente
- [ ] Sé qué hace cada tabla DynamoDB (Users, Surveys, Rooms)
- [ ] Sé qué hace cada función Lambda (userService, surveyService, roomService)
- [ ] Sé qué endpoints API tienes disponibles
- [ ] Sé dónde está cada archivo en el proyecto

**Si no entiendes algo:** Lee UBICACION_CODIGO.md

---

## 💻 FASE 2: ENCONTRAR EL CÓDIGO (20 minutos)

### Encontrar Frontend
- [ ] Abro `frontend/app/survey/page.tsx` y encuentro el formulario de encuesta
- [ ] Abro `frontend/app/admin/page.tsx` y encuentro el panel de admin
- [ ] Entiendo que está hecho con Next.js + React + TypeScript
- [ ] Veo donde se hacen las llamadas a la API (fetch)

### Encontrar Backend
- [ ] Abro `backend/functions/userService/index.js` y encuentro `createUser()`
- [ ] Entiendo que usa AWS SDK para conectar a DynamoDB
- [ ] Veo la estructura de una función Lambda
- [ ] Encuentro los headers CORS

### Encontrar Infraestructura
- [ ] Abro `template.yaml` y encuentro la tabla `UsersTable`
- [ ] Encuentro la definición de `ParqueExploraApi`
- [ ] Veo dónde se definen los endpoints
- [ ] Veo dónde se definen los permisos IAM

**Si necesitas ayuda:** Consulta UBICACION_CODIGO.md para ubicaciones exactas

---

## 🧪 FASE 3: ENTENDER EL FLUJO DE DATOS (25 minutos)

### Flujo 1: Buscar un usuario
- [ ] Entiendo que usuario ingresa cédula en el Frontend
- [ ] Entiendo que Frontend hace GET /users/1234567890
- [ ] Entiendo que API Gateway valida la API Key
- [ ] Entiendo que Lambda busca en DynamoDB
- [ ] Entiendo que DynamoDB retorna el usuario
- [ ] Entiendo que Frontend muestra los datos

### Flujo 2: Crear un usuario
- [ ] Entiendo que Frontend hace POST /users con datos
- [ ] Entiendo que Lambda valida los datos (cedula, nombre, email)
- [ ] Entiendo que Lambda crea objeto userData
- [ ] Entiendo que Lambda guarda en DynamoDB con PutCommand
- [ ] Entiendo que DynamoDB guarda con cedula como clave primaria

### Flujo 3: Crear una encuesta
- [ ] Entiendo que usuario completa formulario en Frontend
- [ ] Entiendo que Frontend hace POST /surveys
- [ ] Entiendo que Lambda verifica que el usuario exista
- [ ] Entiendo que Lambda crea UUID único para encuesta
- [ ] Entiendo que Lambda guarda en tabla Surveys
- [ ] Entiendo que se usa índice CedulaIndex para búsquedas rápidas

**Si necesitas visualizar:** Ve DIAGRAMAS_VISUALES.md

---

## 🔐 FASE 4: ENTENDER LA SEGURIDAD (15 minutos)

### Seguridad básica
- [ ] Entiendo que toda comunicación es HTTPS (encriptada)
- [ ] Entiendo que se valida API Key en cada solicitud
- [ ] Entiendo que Lambda solo puede acceder a sus tablas (IAM)
- [ ] Entiendo que se validan los datos antes de guardar

### Protecciones en el código
- [ ] Encuentro validación de email en userService
- [ ] Encuentro validación de campos requeridos
- [ ] Encuentro try/catch para manejo de errores
- [ ] Encuentro headers CORS en respuestas

### Próximos pasos de seguridad
- [ ] Sé que podrían agregar Cognito para autenticación real
- [ ] Sé que podrían agregar rate limiting
- [ ] Sé que podrían restringir el CORS a solo ciertos orígenes

---

## 🚀 FASE 5: DESPLEGAR Y TESTEAR (30 minutos)

### Testear localmente
- [ ] Ejecuto `npm install` en frontend y backend
- [ ] Ejecuto `sam build` sin errores
- [ ] Ejecuto `sam local start-api` para probar en local
- [ ] Pruebo GET /rooms desde Postman o PowerShell

### Desplegar en AWS
- [ ] Ejecuto `sam build` sin errores
- [ ] Ejecuto `sam deploy` o `sam deploy --guided`
- [ ] Espero a que termine (puede tardar 5-10 minutos)
- [ ] Copio la URL de API que devuelve

### Testear en AWS
- [ ] Pruebo GET /rooms en la URL de AWS
- [ ] Pruebo crear usuario con POST /users
- [ ] Pruebo crear encuesta con POST /surveys
- [ ] Pruebo que los datos se guardaron en DynamoDB

---

## 💡 FASE 6: ENTENDER LOS EJEMPLOS DE CÓDIGO (20 minutos)

### Ejemplo 1: Hacer solicitud GET
- [ ] Entiendo que hay que incluir header 'X-Api-Key'
- [ ] Entiendo que hay que incluir header 'Content-Type'
- [ ] Entiendo que método es GET
- [ ] Entiendo que se parsea response como JSON

### Ejemplo 2: Hacer solicitud POST
- [ ] Entiendo que método es POST
- [ ] Entiendo que body va en JSON.stringify()
- [ ] Entiendo que se valida response.ok
- [ ] Entiendo que se maneja error si falla

### Ejemplo 3: Manejar errores
- [ ] Entiendo que hay respuestas 200 (éxito)
- [ ] Entiendo que hay respuestas 400 (datos inválidos)
- [ ] Entiendo que hay respuestas 404 (no encontrado)
- [ ] Entiendo que hay respuestas 500 (error interno)

**Si necesitas ejemplos:** Ve EJEMPLOS_PRACTICOS.md

---

## 🎯 FASE 7: MODIFICAR CÓDIGO (45 minutos)

### Modificación 1: Agregar un campo a usuarios
- [ ] Abro `backend/functions/userService/index.js`
- [ ] Encuentro la función `createUser()`
- [ ] Agrego el nuevo campo en la desestructuración
- [ ] Agrego validación si es requerido
- [ ] Agrego el campo a `userData`
- [ ] Ejecuto `sam build && sam deploy`

### Modificación 2: Cambiar un mensaje de error
- [ ] Encuentro dónde está el mensaje en Lambda
- [ ] Lo cambio
- [ ] Ejecuto `sam build && sam deploy`
- [ ] Teseo y verifico que el mensaje cambió

### Modificación 3: Agregar console.log para debugging
- [ ] Agrego console.log al inicio de la función
- [ ] Agrego console.log antes de guardar en DynamoDB
- [ ] Ejecuto `sam build && sam deploy`
- [ ] Veo los logs: `aws logs tail /aws/lambda/... --follow`

**Si necesitas guía completa:** Ve GUIA_CONTINUAR_DESARROLLO.md

---

## 🔧 FASE 8: AGREGAR NUEVA FUNCIONALIDAD (1 hora)

### Agregar nuevo endpoint (paso a paso)
- [ ] Creo función en `backend/functions/{service}/index.js`
- [ ] Agrego event handler para el nuevo path
- [ ] Pruebo localmente con `sam local start-api`
- [ ] Modifico `template.yaml` para agregar el evento
- [ ] Despliego con `sam build && sam deploy`
- [ ] Teseo el nuevo endpoint

### Opción: Agregar nueva tabla DynamoDB
- [ ] Agrego tabla en `template.yaml` sección Resources
- [ ] Agrego variable de entorno en Globals
- [ ] Agrego permiso IAM en la función Lambda
- [ ] Despliego y teseo

**Si necesitas pasos detallados:** Ve GUIA_CONTINUAR_DESARROLLO.md sección "Agregar endpoint"

---

## 📊 FASE 9: MONITOREO Y LOGS (20 minutos)

### Ver logs de Lambda
- [ ] Ejecuto comando de AWS CLI para ver logs
- [ ] Entiendo que los logs aparecen en CloudWatch
- [ ] Filtro logs por fecha/hora
- [ ] Encuentro mensajes de error

### Entender métricas
- [ ] Veo cuántas invocaciones tuvo una función
- [ ] Veo cuántos errores hubo
- [ ] Veo duración promedio
- [ ] Veo throttling (si hubo)

### Debuggear problemas
- [ ] Reviso logs cuando algo falla
- [ ] Agrego más console.log si necesito más detalles
- [ ] Reviso que la tabla existe en DynamoDB
- [ ] Reviso que los permisos IAM son correctos

**Si necesitas ayuda:** Ve EJEMPLOS_PRACTICOS.md sección "Debugging"

---

## 🎓 FASE 10: DOMINIO TOTAL (30 minutos)

### Puedo hacer cambios sin ayuda
- [ ] Sé cómo modificar una función Lambda
- [ ] Sé cómo agregar un nuevo endpoint
- [ ] Sé cómo desplegar cambios
- [ ] Sé cómo testear y debuggear

### Puedo explicar el proyecto
- [ ] Puedo explicar qué es cada servicio AWS
- [ ] Puedo dibujar el flujo de datos
- [ ] Puedo explicar cómo se guardan los datos
- [ ] Puedo explicar la seguridad

### Puedo planificar nuevas features
- [ ] Puedo identificar qué necesito cambiar
- [ ] Puedo planificar qué archivos toco
- [ ] Puedo estimar el esfuerzo
- [ ] Puedo ejecutar los cambios

### Puedo troubleshootear problemas
- [ ] Veo un error y sé dónde revisar
- [ ] Reviso logs y puedo interpretar qué pasó
- [ ] Sé qué verificar en template.yaml
- [ ] Sé qué verificar en permisos IAM

---

## 🏆 BONUS: PRUEBA FINAL

### Prueba 1: Entender la arquitectura (sin documentación)
**Pregunta:** ¿Cuál es el flujo completo desde que usuario ingresa cédula hasta que ve sus encuestas?

**Respuesta correcta incluye:**
- [ ] Frontend hace solicitud HTTP
- [ ] API Gateway valida
- [ ] Lambda busca en DynamoDB
- [ ] Datos se retornan al Frontend
- [ ] Frontend muestra datos

### Prueba 2: Hacer un cambio simple
**Tarea:** Agregar un console.log en userService y verlo en CloudWatch

**Pasos:**
- [ ] Edito archivo
- [ ] Ejecuto sam build && sam deploy
- [ ] Hago una solicitud
- [ ] Veo el log en CloudWatch

### Prueba 3: Agregar un nuevo endpoint
**Tarea:** Crear endpoint GET /admin/stats que retorne cantidad de usuarios

**Pasos:**
- [ ] Escribo código en Lambda
- [ ] Actualizo template.yaml
- [ ] Despliego
- [ ] Teseo el nuevo endpoint

---

## 📈 PROGRESO

Cuenta cuántos ✅ tienes:

- **0-20:** Necesitas leer EXPLICACION_SERVICIOS_AWS.md
- **20-40:** Lee DIAGRAMAS_VISUALES.md y UBICACION_CODIGO.md
- **40-60:** Empieza con EJEMPLOS_PRACTICOS.md
- **60-80:** Usa GUIA_CONTINUAR_DESARROLLO.md para hacer cambios
- **80-100:** ¡Eres experto! Puedes hacer cambios sin ayuda

---

## 🎯 SIGUIENTE PASO

**Basado en dónde estés:**

**Si tienes 0-20 ✅:**
→ Abre RESUMEN_UNA_PAGINA.md y lee primero

**Si tienes 20-40 ✅:**
→ Lee EXPLICACION_SERVICIOS_AWS.md completamente

**Si tienes 40-60 ✅:**
→ Abre tu IDE, empieza a explorar el código con UBICACION_CODIGO.md

**Si tienes 60-80 ✅:**
→ Haz tu primer cambio: Agrega un console.log y desplega

**Si tienes 80-100 ✅:**
→ Crea una nueva funcionalidad: Nuevo endpoint o nueva tabla

---

## 💬 PREGUNTAS DE AUTO-EVALUACIÓN

Responde SÍ o NO:

1. **¿Entiendo qué es cada servicio AWS (DynamoDB, Lambda, API Gateway, IAM)?**
   - Sí ✅ / No ❌

2. **¿Puedo explicar cómo va un dato desde Frontend a DynamoDB?**
   - Sí ✅ / No ❌

3. **¿Encuentro rápidamente dónde está cada parte del código?**
   - Sí ✅ / No ❌

4. **¿Puedo hacer cambios simples sin miedo a romper algo?**
   - Sí ✅ / No ❌

5. **¿Sé cómo desplegar cambios en AWS?**
   - Sí ✅ / No ❌

6. **¿Sé cómo debuggear si algo no funciona?**
   - Sí ✅ / No ❌

7. **¿Podría agregar un nuevo campo a usuarios?**
   - Sí ✅ / No ❌

8. **¿Podría agregar un nuevo endpoint?**
   - Sí ✅ / No ❌

**Resultado:**
- **8/8:** Dominas el proyecto ✨
- **6-7/8:** Casi listo, necesitas práctica
- **4-5/8:** Tienes los conceptos, practica más
- **0-3/8:** Vuelve a leer la documentación

---

## 🚀 ¡FELICIDADES!

Si completaste este checklist, ahora:

✅ Entiendes la arquitectura
✅ Conoces el código
✅ Puedes hacer cambios
✅ Sabes cómo desplegar
✅ Puedes debuggear problemas
✅ Estás listo para continuar desarrollando

**¿Cuál es tu siguiente objetivo?**

1. Entender más a fondo → Lee todos los documentos nuevos
2. Hacer cambios reales → Sigue GUIA_CONTINUAR_DESARROLLO.md
3. Agregar funcionalidad → Ve ejemplos en EJEMPLOS_PRACTICOS.md
4. Optimizar → Revisa DIAGRAMAS_VISUALES.md para costos

¡Adelante! 🎉
