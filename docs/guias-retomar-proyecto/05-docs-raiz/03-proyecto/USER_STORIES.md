# 📖 Historias de Usuario - Parque Explora Survey

## 🎯 Personas

### **👤 Visitante del Parque (Usuario Final)**
- **Perfil**: Persona que visita el Parque Explora
- **Necesidades**: Evaluar su experiencia y proporcionar feedback
- **Objetivos**: Compartir opiniones sobre las salas visitadas

### **👨‍💼 Administrador del Parque**
- **Perfil**: Personal responsable de la gestión del parque
- **Necesidades**: Analizar feedback y gestionar datos
- **Objetivos**: Mejorar la experiencia del visitante

### **👩‍💻 Desarrollador**
- **Perfil**: Desarrollador full-stack responsable del sistema
- **Necesidades**: Mantener y mejorar el sistema
- **Objetivos**: Asegurar funcionalidad y escalabilidad

---

## 📋 Historias de Usuario por Épica

### **🏠 ÉPICA 1: Gestión de Usuarios**

#### **US-001: Registro de Usuario**
**Como** visitante del parque  
**Quiero** registrarme en el sistema  
**Para** poder completar una encuesta de satisfacción  

**Criterios de Aceptación:**
- ✅ Debo poder ingresar mi cédula de ciudadanía
- ✅ Debo poder ingresar mi nombre completo
- ✅ Debo poder ingresar mi correo electrónico
- ✅ Debo poder ingresar mi número de teléfono
- ✅ El sistema debe validar que la cédula sea numérica
- ✅ El sistema debe validar el formato del email
- ✅ El sistema debe generar un ID único para mi boleta
- ✅ El sistema debe almacenar la fecha de registro

**Definición de Terminado:**
- [ ] Formulario de registro funcional
- [ ] Validaciones de entrada implementadas
- [ ] Datos almacenados en base de datos
- [ ] Mensajes de confirmación mostrados
- [ ] Pruebas unitarias completadas

---

#### **US-002: Búsqueda de Usuario**
**Como** visitante del parque  
**Quiero** buscar mi información por cédula  
**Para** acceder a mi encuesta existente  

**Criterios de Aceptación:**
- ✅ Debo poder buscar por número de cédula
- ✅ El sistema debe mostrar mi información si existe
- ✅ El sistema debe mostrar mensaje si no existe
- ✅ La búsqueda debe ser en tiempo real
- ✅ El campo de cédula debe aceptar solo números
- ✅ La cédula debe tener mínimo 6 dígitos

**Definición de Terminado:**
- [ ] Campo de búsqueda funcional
- [ ] Validación de formato de cédula
- [ ] Integración con API de búsqueda
- [ ] Manejo de estados de carga
- [ ] Pruebas de integración completadas

---

#### **US-003: Visualización de Usuario**
**Como** administrador  
**Quiero** ver la información de un usuario  
**Para** gestionar sus datos  

**Criterios de Aceptación:**
- ✅ Debo poder ver todos los datos del usuario
- ✅ Debo poder ver las fechas de creación y actualización
- ✅ La información debe mostrarse en un formato legible
- ✅ Debo poder cerrar la vista de detalles
- ✅ Los datos sensibles deben estar protegidos

**Definición de Terminado:**
- [ ] Modal de visualización implementado
- [ ] Formato de datos apropiado
- [ ] Protección de datos sensibles
- [ ] Pruebas de interfaz completadas

---

#### **US-004: Edición de Usuario**
**Como** administrador  
**Quiero** editar la información de un usuario  
**Para** mantener los datos actualizados  

**Criterios de Aceptación:**
- ✅ Debo poder modificar nombre, email y teléfono
- ✅ La cédula no debe ser editable
- ✅ Debo poder guardar los cambios
- ✅ Debo poder cancelar la edición
- ✅ El sistema debe validar los datos modificados
- ✅ Debo recibir confirmación de los cambios

**Definición de Terminado:**
- [ ] Formulario de edición funcional
- [ ] Validaciones de entrada
- [ ] Botones de guardar/cancelar
- [ ] Confirmaciones de cambios
- [ ] Pruebas de funcionalidad completadas

---

#### **US-005: Eliminación de Usuario**
**Como** administrador  
**Quiero** eliminar un usuario y sus encuestas  
**Para** mantener la base de datos limpia  

**Criterios de Aceptación:**
- ✅ Debo poder eliminar un usuario por cédula
- ✅ El sistema debe eliminar también sus encuestas asociadas
- ✅ Debo recibir una confirmación antes de eliminar
- ✅ Debo poder cancelar la eliminación
- ✅ El sistema debe mostrar mensaje de confirmación
- ✅ La lista debe actualizarse automáticamente

**Definición de Terminado:**
- [ ] Botón de eliminación funcional
- [ ] Modal de confirmación
- [ ] Eliminación en cascada de encuestas
- [ ] Actualización de interfaz
- [ ] Pruebas de eliminación completadas

---

### **📊 ÉPICA 2: Gestión de Encuestas**

#### **US-006: Creación de Encuesta**
**Como** visitante del parque  
**Quiero** crear una nueva encuesta  
**Para** evaluar mi experiencia en el parque  

**Criterios de Aceptación:**
- ✅ El sistema debe crear automáticamente una encuesta si no existe
- ✅ La encuesta debe estar asociada a mi cédula
- ✅ El estado inicial debe ser "pending"
- ✅ Debo poder acceder a la encuesta inmediatamente
- ✅ Solo se debe crear una encuesta por día por usuario

**Definición de Terminado:**
- [ ] Creación automática de encuesta
- [ ] Asociación con usuario
- ✅ Validación de una encuesta por día
- [ ] Redirección a encuesta
- [ ] Pruebas de creación completadas

---

#### **US-007: Completar Encuesta**
**Como** visitante del parque  
**Quiero** completar mi encuesta de satisfacción  
**Para** proporcionar feedback sobre mi experiencia  

**Criterios de Aceptación:**
- ✅ Debo poder calificar mi experiencia general (1-5 estrellas)
- ✅ Debo poder seleccionar las salas que visité
- ✅ Debo poder ordenar mis salas favoritas por preferencia
- ✅ Debo poder seleccionar salas que necesitan renovación
- ✅ Debo poder agregar comentarios adicionales
- ✅ Debo poder guardar como borrador
- ✅ Debo poder enviar la encuesta completa

**Definición de Terminado:**
- [ ] Formulario de encuesta completo
- [ ] Sistema de calificación por estrellas
- [ ] Selección múltiple de salas
- [ ] Ordenamiento de preferencias
- [ ] Campo de comentarios
- [ ] Guardado de borrador
- [ ] Envío de encuesta
- [ ] Pruebas de encuesta completadas

---

#### **US-008: Visualización de Encuesta**
**Como** administrador  
**Quiero** ver los detalles de una encuesta  
**Para** analizar el feedback del visitante  

**Criterios de Aceptación:**
- ✅ Debo poder ver todos los datos de la encuesta
- ✅ Debo poder ver la información del usuario asociado
- ✅ Debo poder ver las salas seleccionadas y sus preferencias
- ✅ Debo poder ver la calificación y comentarios
- ✅ Debo poder ver las fechas de creación y actualización
- ✅ La información debe estar bien organizada

**Definición de Terminado:**
- [ ] Modal de visualización de encuesta
- [ ] Información del usuario incluida
- [ ] Salas y preferencias mostradas
- [ ] Calificación y comentarios visibles
- [ ] Fechas de auditoría mostradas
- [ ] Pruebas de visualización completadas

---

#### **US-009: Edición de Encuesta**
**Como** administrador  
**Quiero** editar una encuesta  
**Para** corregir errores o actualizar información  

**Criterios de Aceptación:**
- ✅ Debo poder modificar el estado de la encuesta
- ✅ Debo poder cambiar la calificación general
- ✅ Debo poder editar los comentarios
- ✅ No debo poder editar salas visitadas o favoritas
- ✅ Debo poder guardar los cambios
- ✅ Debo poder cancelar la edición

**Definición de Terminado:**
- [ ] Formulario de edición de encuesta
- [ ] Campos editables apropiados
- [ ] Validaciones de entrada
- [ ] Botones de guardar/cancelar
- [ ] Pruebas de edición completadas

---

#### **US-010: Eliminación de Encuesta**
**Como** administrador  
**Quiero** eliminar una encuesta  
**Para** mantener la base de datos limpia  

**Criterios de Aceptación:**
- ✅ Debo poder eliminar una encuesta por ID
- ✅ Debo recibir confirmación antes de eliminar
- ✅ Debo poder cancelar la eliminación
- ✅ El sistema debe mostrar mensaje de confirmación
- ✅ La lista debe actualizarse automáticamente

**Definición de Terminado:**
- [ ] Botón de eliminación funcional
- [ ] Modal de confirmación
- [ ] Actualización de interfaz
- [ ] Pruebas de eliminación completadas

---

### **🏛️ ÉPICA 3: Gestión de Salas**

#### **US-011: Visualización de Salas**
**Como** visitante del parque  
**Quiero** ver las salas disponibles  
**Para** seleccionarlas en mi encuesta  

**Criterios de Aceptación:**
- ✅ Debo poder ver todas las salas activas
- ✅ Debo poder ver el nombre y descripción de cada sala
- ✅ Las salas deben estar organizadas por categoría
- ✅ Debo poder seleccionar múltiples salas
- ✅ Las salas deben cargarse dinámicamente

**Definición de Terminado:**
- [ ] Lista de salas funcional
- [ ] Información completa de salas
- [ ] Organización por categoría
- [ ] Selección múltiple
- [ ] Carga dinámica
- [ ] Pruebas de salas completadas

---

### **📊 ÉPICA 4: Panel de Administración**

#### **US-012: Dashboard Principal**
**Como** administrador  
**Quiero** ver un dashboard con estadísticas generales  
**Para** tener una visión general del sistema  

**Criterios de Aceptación:**
- ✅ Debo poder ver el total de usuarios registrados
- ✅ Debo poder ver el total de encuestas completadas
- ✅ Debo poder ver el promedio de satisfacción
- ✅ Debo poder ver estadísticas por período
- ✅ Las estadísticas deben actualizarse en tiempo real

**Definición de Terminado:**
- [ ] Dashboard con estadísticas
- [ ] Métricas principales visibles
- [ ] Actualización en tiempo real
- [ ] Diseño responsivo
- [ ] Pruebas de dashboard completadas

---

#### **US-013: Lista de Usuarios**
**Como** administrador  
**Quiero** ver una lista de todos los usuarios  
**Para** gestionar la base de usuarios  

**Criterios de Aceptación:**
- ✅ Debo poder ver todos los usuarios en una tabla
- ✅ Debo poder buscar usuarios por nombre o cédula
- ✅ Debo poder ordenar por diferentes columnas
- ✅ Debo poder paginar los resultados
- ✅ Debo poder ver acciones (ver, editar, eliminar) para cada usuario

**Definición de Terminado:**
- [ ] Tabla de usuarios funcional
- [ ] Búsqueda en tiempo real
- [ ] Ordenamiento por columnas
- [ ] Paginación implementada
- [ ] Acciones por usuario
- [ ] Pruebas de lista completadas

---

#### **US-014: Lista de Encuestas**
**Como** administrador  
**Quiero** ver una lista de todas las encuestas  
**Para** gestionar el feedback de visitantes  

**Criterios de Aceptación:**
- ✅ Debo poder ver todas las encuestas en una tabla
- ✅ Debo poder filtrar por estado (pending, completed)
- ✅ Debo poder buscar por usuario o comentarios
- ✅ Debo poder ordenar por diferentes columnas
- ✅ Debo poder ver acciones (ver, editar, eliminar) para cada encuesta

**Definición de Terminado:**
- [ ] Tabla de encuestas funcional
- [ ] Filtros por estado
- [ ] Búsqueda implementada
- [ ] Ordenamiento por columnas
- [ ] Acciones por encuesta
- [ ] Pruebas de lista completadas

---

### **🔐 ÉPICA 5: Seguridad y Autenticación**

#### **US-015: Autenticación API**
**Como** desarrollador  
**Quiero** implementar autenticación por API Key  
**Para** proteger los endpoints del sistema  

**Criterios de Aceptación:**
- ✅ Todas las APIs deben requerir API Key válida
- ✅ Las solicitudes sin API Key deben ser rechazadas
- ✅ La API Key debe ser configurable
- ✅ Debo poder rotar la API Key cuando sea necesario
- ✅ Los logs deben registrar intentos de acceso no autorizados

**Definición de Terminado:**
- [ ] Autenticación API Key implementada
- [ ] Validación en todos los endpoints
- [ ] Configuración de API Key
- [ ] Logs de seguridad
- [ ] Pruebas de seguridad completadas

---

#### **US-016: Validación de Datos**
**Como** desarrollador  
**Quiero** validar todos los datos de entrada  
**Para** mantener la integridad del sistema  

**Criterios de Aceptación:**
- ✅ Todos los formularios deben validar datos de entrada
- ✅ Las APIs deben validar parámetros
- ✅ Debo mostrar mensajes de error apropiados
- ✅ Los datos deben ser sanitizados antes de almacenar
- ✅ Debo prevenir inyección de código malicioso

**Definición de Terminado:**
- [ ] Validación en frontend
- [ ] Validación en backend
- [ ] Mensajes de error apropiados
- [ ] Sanitización de datos
- [ ] Pruebas de validación completadas

---

### **📱 ÉPICA 6: Experiencia de Usuario**

#### **US-017: Interfaz Responsiva**
**Como** visitante del parque  
**Quiero** usar el sistema desde mi dispositivo móvil  
**Para** completar la encuesta desde cualquier lugar  

**Criterios de Aceptación:**
- ✅ La interfaz debe funcionar en dispositivos móviles
- ✅ Los formularios deben ser fáciles de usar en pantallas pequeñas
- ✅ Los botones deben ser del tamaño apropiado para touch
- ✅ La navegación debe ser intuitiva
- ✅ Debo poder completar toda la encuesta en móvil

**Definición de Terminado:**
- [ ] Diseño responsivo implementado
- [ ] Formularios optimizados para móvil
- [ ] Botones touch-friendly
- [ ] Navegación intuitiva
- [ ] Pruebas en dispositivos móviles completadas

---

#### **US-018: Mensajes de Feedback**
**Como** visitante del parque  
**Quiero** recibir confirmaciones claras de mis acciones  
**Para** saber que mis datos se guardaron correctamente  

**Criterios de Aceptación:**
- ✅ Debo recibir confirmación al guardar datos
- ✅ Debo ver mensajes de error claros si algo falla
- ✅ Debo recibir confirmación al enviar la encuesta
- ✅ Los mensajes deben ser en español
- ✅ Los mensajes deben ser visibles y comprensibles

**Definición de Terminado:**
- [ ] Sistema de notificaciones
- [ ] Mensajes de confirmación
- [ ] Mensajes de error claros
- [ ] Localización en español
- [ ] Pruebas de mensajes completadas

---

### **🚀 ÉPICA 7: Despliegue y Mantenimiento**

#### **US-019: Despliegue Automatizado**
**Como** desarrollador  
**Quiero** desplegar el sistema automáticamente  
**Para** reducir errores y tiempo de despliegue  

**Criterios de Aceptación:**
- ✅ Debo poder desplegar con un comando
- ✅ El despliegue debe ser reproducible
- ✅ Debo poder desplegar a diferentes ambientes
- ✅ Debo recibir confirmación del estado del despliegue
- ✅ Debo poder hacer rollback si es necesario

**Definición de Terminado:**
- [ ] Scripts de despliegue automatizado
- [ ] Configuración por ambientes
- [ ] Confirmación de despliegue
- [ ] Capacidad de rollback
- [ ] Pruebas de despliegue completadas

---

#### **US-020: Monitoreo y Logs**
**Como** desarrollador  
**Quiero** monitorear el sistema y ver logs  
**Para** diagnosticar problemas y mantener el sistema  

**Criterios de Aceptación:**
- ✅ Debo poder ver logs de todas las funciones
- ✅ Debo poder monitorear métricas de rendimiento
- ✅ Debo recibir alertas por errores críticos
- ✅ Debo poder rastrear solicitudes end-to-end
- ✅ Los logs deben ser estructurados y legibles

**Definición de Terminado:**
- [ ] Sistema de logging implementado
- [ ] Métricas de monitoreo
- [ ] Alertas configuradas
- [ ] Trazabilidad de solicitudes
- [ ] Logs estructurados
- [ ] Pruebas de monitoreo completadas

---

## 📊 Criterios de Aceptación Globales

### **Funcionales**
- ✅ Sistema debe funcionar 24/7
- ✅ Tiempo de respuesta < 3 segundos
- ✅ Disponibilidad > 99%
- ✅ Capacidad de manejar 1000+ usuarios concurrentes

### **No Funcionales**
- ✅ Interfaz intuitiva y fácil de usar
- ✅ Diseño responsivo para todos los dispositivos
- ✅ Accesibilidad básica implementada
- ✅ Performance optimizado

### **Técnicos**
- ✅ Código documentado y comentado
- ✅ Pruebas unitarias > 80% cobertura
- ✅ Pruebas de integración completas
- ✅ Documentación técnica actualizada

---

## 🎯 Priorización

### **Alta Prioridad (MVP)**
- US-001: Registro de Usuario
- US-002: Búsqueda de Usuario
- US-006: Creación de Encuesta
- US-007: Completar Encuesta
- US-011: Visualización de Salas
- US-015: Autenticación API

### **Media Prioridad**
- US-003: Visualización de Usuario
- US-004: Edición de Usuario
- US-008: Visualización de Encuesta
- US-012: Dashboard Principal
- US-013: Lista de Usuarios
- US-014: Lista de Encuestas
- US-017: Interfaz Responsiva

### **Baja Prioridad**
- US-005: Eliminación de Usuario
- US-009: Edición de Encuesta
- US-010: Eliminación de Encuesta
- US-016: Validación de Datos
- US-018: Mensajes de Feedback
- US-019: Despliegue Automatizado
- US-020: Monitoreo y Logs

---

*Historias de usuario para el Sistema de Encuestas de Satisfacción - Parque Explora*
