# 📚 **GUÍA COMPLETA: Git y GitHub Paso a Paso**

## 🚀 **PRIMERA VEZ - Subir proyecto completo a GitHub**

### **Paso 1: Configurar Git (solo la primera vez)**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### **Paso 2: Inicializar repositorio local**
```bash
git init
```

### **Paso 3: Agregar todos los archivos**
```bash
git add .
```

### **Paso 4: Hacer el primer commit**
```bash
git commit -m "Initial commit: Descripción del proyecto"
```

### **Paso 5: Conectar con GitHub**
```bash
git remote add origin https://github.com/TU-USUARIO/NOMBRE-REPO.git
```

### **Paso 6: Subir a GitHub**
```bash
git push -u origin main
```

---

## 🔄 **ACTUALIZAR CAMBIOS (después de la primera vez)**

### **Paso 1: Ver qué cambió**
```bash
git status
```

### **Paso 2: Agregar archivos modificados**
```bash
# Para un archivo específico:
git add nombre-archivo.md

# Para todos los cambios:
git add .
```

### **Paso 3: Hacer commit**
```bash
git commit -m "Descripción de los cambios realizados"
```

### **Paso 4: Subir cambios**
```bash
git push
```

---

## 📋 **EJEMPLO REAL (lo que hicimos hoy):**

### **Configuración inicial:**
```bash
git config --global user.name "Manuel Cris"
git config --global user.email "tu-email@github.com"
```

### **Subir proyecto completo:**
```bash
git add .
git commit -m "Initial commit: Sistema de Encuestas Parque Explora - Backend AWS y Frontend Next.js"
git remote add origin https://github.com/ManuelCris29/parque-explora-survey.git
git push -u origin main
```

### **Para futuros cambios:**
```bash
git add .
git commit -m "Actualización de documentación"
git push
```

---

## 🔍 **COMANDOS ÚTILES:**

### **Ver el estado:**
```bash
git status
```

### **Ver el historial:**
```bash
git log --oneline
```

### **Ver remotes configurados:**
```bash
git remote -v
```

### **Deshacer cambios (si te equivocaste):**
```bash
git restore nombre-archivo.md
```

---

## ⚠️ **NOTAS IMPORTANTES:**

1. **Solo necesitas configurar Git una vez** (user.name y user.email)
2. **Solo necesitas `git remote add` una vez** por proyecto
3. **Después solo usas:** `git add`, `git commit`, `git push`
4. **El `-u origin main` solo se usa la primera vez** en el push
5. **Siempre describe bien tus commits** para saber qué cambió

---

## 🆘 **SOLUCIÓN DE PROBLEMAS COMUNES:**

### **Error: "remote origin already exists"**
```bash
git remote -v  # Verificar si ya está configurado
git push -u origin main  # Continuar normalmente
```

### **Error: "Author identity unknown"**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### **Error: "fatal: not a git repository"**
```bash
git init  # Inicializar repositorio
```

### **Error de autenticación en GitHub:**
- Usa tu **Personal Access Token** como contraseña
- NO uses tu contraseña normal de GitHub

---

## 🎯 **FLUJO DE TRABAJO RECOMENDADO:**

1. **Hacer cambios** en tu código
2. **Verificar** con `git status`
3. **Agregar** con `git add .`
4. **Commitear** con `git commit -m "descripción"`
5. **Subir** con `git push`

---

## 📝 **EJEMPLOS DE MENSAJES DE COMMIT:**

```bash
git commit -m "Agregar nueva funcionalidad de usuarios"
git commit -m "Corregir error en validación de cédula"
git commit -m "Actualizar documentación del proyecto"
git commit -m "Mejorar diseño del frontend"
git commit -m "Agregar panel de administración"
```

---

**¡Con esta guía puedes manejar Git y GitHub sin problemas! 🚀**
