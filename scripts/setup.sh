#!/bin/bash

# Parque Explora Survey System - Setup Script
# Este script automatiza la configuración inicial del proyecto

set -e

echo "🚀 Configurando Parque Explora Survey System..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
check_prerequisites() {
    print_status "Verificando prerrequisitos..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js versión 18+ requerida. Versión actual: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) encontrado"
    
    # Verificar AWS CLI
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI no está instalado. Necesario para despliegue"
    else
        print_success "AWS CLI $(aws --version) encontrado"
    fi
    
    # Verificar SAM CLI
    if ! command -v sam &> /dev/null; then
        print_warning "AWS SAM CLI no está instalado. Necesario para despliegue"
    else
        print_success "AWS SAM CLI $(sam --version) encontrado"
    fi
}

# Instalar dependencias del backend
setup_backend() {
    print_status "Configurando backend..."
    
    FUNCTIONS=("createUser" "getUser" "createSurvey" "getSurvey" "updateSurvey" "getRooms")
    
    for func in "${FUNCTIONS[@]}"; do
        print_status "Instalando dependencias para $func..."
        cd "backend/functions/$func"
        npm install --silent
        cd ../../..
        print_success "Dependencias de $func instaladas"
    done
    
    print_success "Backend configurado correctamente"
}

# Instalar dependencias del frontend
setup_frontend() {
    print_status "Configurando frontend..."
    
    cd frontend
    npm install --silent
    cd ..
    
    # Crear archivo de variables de entorno si no existe
    if [ ! -f "frontend/.env.local" ]; then
        print_status "Creando archivo de variables de entorno..."
        cp frontend/env.example frontend/.env.local
        print_warning "Archivo .env.local creado. Por favor actualiza las variables con tus valores reales."
    fi
    
    print_success "Frontend configurado correctamente"
}

# Crear archivos de configuración
setup_config() {
    print_status "Creando archivos de configuración..."
    
    # Crear directorio docs si no existe
    mkdir -p docs
    
    print_success "Archivos de configuración creados"
}

# Verificar estructura del proyecto
verify_structure() {
    print_status "Verificando estructura del proyecto..."
    
    REQUIRED_FILES=(
        "template.yaml"
        "README.md"
        "frontend/package.json"
        "backend/functions/createUser/package.json"
        "backend/functions/getUser/package.json"
        "backend/functions/createSurvey/package.json"
        "backend/functions/getSurvey/package.json"
        "backend/functions/updateSurvey/package.json"
        "backend/functions/getRooms/package.json"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Archivo requerido no encontrado: $file"
            exit 1
        fi
    done
    
    print_success "Estructura del proyecto verificada"
}

# Mostrar instrucciones finales
show_final_instructions() {
    echo ""
    echo "🎉 ¡Configuración completada exitosamente!"
    echo ""
    echo "📋 Próximos pasos:"
    echo ""
    echo "1. 🔧 Configurar variables de entorno:"
    echo "   - Edita frontend/.env.local con tus valores de API"
    echo ""
    echo "2. 🚀 Desplegar backend:"
    echo "   sam build"
    echo "   sam deploy --guided"
    echo ""
    echo "3. 🌐 Ejecutar frontend en desarrollo:"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "4. 📚 Leer documentación:"
    echo "   - README.md para información general"
    echo "   - docs/deployment.md para guía de despliegue"
    echo ""
    echo "💡 Tip: Ejecuta 'npm run dev' en el directorio frontend para ver la aplicación"
}

# Función principal
main() {
    echo "🏛️  Parque Explora - Sistema de Encuestas de Satisfacción"
    echo "=========================================================="
    echo ""
    
    check_prerequisites
    verify_structure
    setup_backend
    setup_frontend
    setup_config
    show_final_instructions
}

# Ejecutar función principal
main "$@"
