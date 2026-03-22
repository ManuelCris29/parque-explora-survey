# Parque Explora Survey System - Setup Script (PowerShell)
# Este script automatiza la configuración inicial del proyecto

param(
    [switch]$SkipPrerequisites
)

# Configurar colores para output
$Host.UI.RawUI.ForegroundColor = "White"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar prerrequisitos
function Test-Prerequisites {
    Write-Status "Verificando prerrequisitos..."
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version
        $nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        
        if ($nodeMajorVersion -lt 18) {
            Write-Error "Node.js versión 18+ requerida. Versión actual: $nodeVersion"
            exit 1
        }
        
        Write-Success "Node.js $nodeVersion encontrado"
    }
    catch {
        Write-Error "Node.js no está instalado. Por favor instala Node.js 18+"
        exit 1
    }
    
    # Verificar AWS CLI
    try {
        $awsVersion = aws --version
        Write-Success "AWS CLI encontrado: $($awsVersion.Split(' ')[0])"
    }
    catch {
        Write-Warning "AWS CLI no está instalado. Necesario para despliegue"
    }
    
    # Verificar SAM CLI
    try {
        $samVersion = sam --version
        Write-Success "AWS SAM CLI encontrado: $($samVersion.Split(' ')[1])"
    }
    catch {
        Write-Warning "AWS SAM CLI no está instalado. Necesario para despliegue"
    }
}

# Instalar dependencias del backend
function Install-BackendDependencies {
    Write-Status "Configurando backend..."
    
    $functions = @("userService", "surveyService", "roomService")
    
    foreach ($func in $functions) {
        Write-Status "Instalando dependencias para $func..."
        
        $originalLocation = Get-Location
        Set-Location "backend\functions\$func"
        
        try {
            npm install --silent
            Write-Success "Dependencias de $func instaladas"
        }
        catch {
            Write-Error "Error instalando dependencias para $func"
            exit 1
        }
        finally {
            Set-Location $originalLocation
        }
    }
    
    Write-Success "Backend configurado correctamente"
}

# Instalar dependencias del frontend
function Install-FrontendDependencies {
    Write-Status "Configurando frontend..."
    
    $originalLocation = Get-Location
    Set-Location "frontend"
    
    try {
        npm install --silent
        Write-Success "Dependencias del frontend instaladas"
        
        # Crear archivo de variables de entorno si no existe
        if (-not (Test-Path ".env.local")) {
            Write-Status "Creando archivo de variables de entorno..."
            Copy-Item "env.example" ".env.local"
            Write-Warning "Archivo .env.local creado. Por favor actualiza las variables con tus valores reales."
        }
    }
    catch {
        Write-Error "Error instalando dependencias del frontend"
        exit 1
    }
    finally {
        Set-Location $originalLocation
    }
    
    Write-Success "Frontend configurado correctamente"
}

# Crear archivos de configuración
function New-ConfigFiles {
    Write-Status "Creando archivos de configuración..."
    
    # Crear directorio docs si no existe
    if (-not (Test-Path "docs")) {
        New-Item -ItemType Directory -Path "docs" -Force | Out-Null
    }
    
    Write-Success "Archivos de configuración creados"
}

# Verificar estructura del proyecto
function Test-ProjectStructure {
    Write-Status "Verificando estructura del proyecto..."
    
    $requiredFiles = @(
        "template.yaml",
        "frontend\package.json",
        "backend\functions\userService\package.json",
        "backend\functions\surveyService\package.json",
        "backend\functions\roomService\package.json"
    )

    $readmePaths = @(
        "README.md",
        "docs\guias-retomar-proyecto\05-docs-raiz\04-inicio\README.md"
    )
    
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            Write-Error "Archivo requerido no encontrado: $file"
            exit 1
        }
    }

    if (-not ($readmePaths | Where-Object { Test-Path $_ })) {
        Write-Error "README no encontrado en rutas esperadas: README.md o docs\guias-retomar-proyecto\05-docs-raiz\04-inicio\README.md"
        exit 1
    }
    
    Write-Success "Estructura del proyecto verificada"
}

# Mostrar instrucciones finales
function Show-FinalInstructions {
    Write-Host ""
    Write-Host "🎉 ¡Configuración completada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 🔧 Configurar variables de entorno:" -ForegroundColor Yellow
    Write-Host "   - Edita frontend\.env.local con tus valores de API" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. 🚀 Desplegar backend:" -ForegroundColor Yellow
    Write-Host "   sam build" -ForegroundColor Gray
    Write-Host "   sam deploy --guided" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. 🌐 Ejecutar frontend en desarrollo:" -ForegroundColor Yellow
    Write-Host "   cd frontend" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. 📚 Leer documentación:" -ForegroundColor Yellow
    Write-Host "   - docs\guias-retomar-proyecto\05-docs-raiz\04-inicio\README.md para información general" -ForegroundColor Gray
    Write-Host "   - docs\deployment.md para guía de despliegue" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Tip: Ejecuta 'npm run dev' en el directorio frontend para ver la aplicación" -ForegroundColor Cyan
}

# Función principal
function Main {
    Write-Host "🏛️  Parque Explora - Sistema de Encuestas de Satisfacción" -ForegroundColor Magenta
    Write-Host "==========================================================" -ForegroundColor Magenta
    Write-Host ""
    
    if (-not $SkipPrerequisites) {
        Test-Prerequisites
    }
    
    Test-ProjectStructure
    Install-BackendDependencies
    Install-FrontendDependencies
    New-ConfigFiles
    Show-FinalInstructions
}

# Ejecutar función principal
Main
