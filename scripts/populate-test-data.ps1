# Script para poblar la base de datos con datos de prueba
# Ejecutar con: .\scripts\populate-test-data.ps1

param(
    [string]$Region = "us-east-1",
    [string]$Environment = "dev"
)

# Configurar colores para output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar AWS CLI
function Test-AWSCLI {
    try {
        $awsVersion = aws --version
        Write-Success "AWS CLI encontrado: $($awsVersion.Split(' ')[0])"
        return $true
    }
    catch {
        Write-Error "AWS CLI no está instalado o configurado"
        return $false
    }
}

# Verificar que las tablas existen
function Test-Tables {
    $usersTable = "$Environment-parque-explora-users"
    $roomsTable = "$Environment-parque-explora-rooms"
    
    Write-Status "Verificando que las tablas existen..."
    
    try {
        aws dynamodb describe-table --table-name $usersTable --region $Region | Out-Null
        Write-Success "Tabla de usuarios encontrada: $usersTable"
    }
    catch {
        Write-Error "Tabla de usuarios no encontrada: $usersTable"
        return $false
    }
    
    try {
        aws dynamodb describe-table --table-name $roomsTable --region $Region | Out-Null
        Write-Success "Tabla de salas encontrada: $roomsTable"
    }
    catch {
        Write-Error "Tabla de salas no encontrada: $roomsTable"
        return $false
    }
    
    return $true
}

# Crear usuario de prueba
function New-TestUser {
    param(
        [string]$Cedula,
        [string]$Nombre,
        [string]$Email,
        [string]$Telefono,
        [string]$FechaCompra,
        [string]$BoletaId
    )
    
    $usersTable = "$Environment-parque-explora-users"
    
    $userData = @{
        cedula = $Cedula
        nombre = $Nombre
        email = $Email
        telefono = $Telefono
        fechaCompra = $FechaCompra
        boletaId = $BoletaId
        fechaCreacion = $FechaCompra
        fechaActualizacion = $FechaCompra
    } | ConvertTo-Json -Compress
    
    try {
        $userDataJson = $userData | ConvertTo-Json -Depth 10
        aws dynamodb put-item `
            --table-name $usersTable `
            --item $userDataJson `
            --region $Region | Out-Null
        
        Write-Success "Usuario creado: $Nombre ($Cedula)"
        return $true
    }
    catch {
        Write-Error "Error creando usuario $Cedula`: $($_.Exception.Message)"
        return $false
    }
}

# Crear sala de prueba
function New-TestRoom {
    param(
        [string]$RoomId,
        [string]$Nombre,
        [string]$Descripcion,
        [string]$Categoria
    )
    
    $roomsTable = "$Environment-parque-explora-rooms"
    
    $roomData = @{
        roomId = $RoomId
        nombre = $Nombre
        descripcion = $Descripcion
        categoria = $Categoria
        estado = "activa"
    } | ConvertTo-Json -Compress
    
    try {
        $roomDataJson = $roomData | ConvertTo-Json -Depth 10
        aws dynamodb put-item `
            --table-name $roomsTable `
            --item $roomDataJson `
            --region $Region | Out-Null
        
        Write-Success "Sala creada: $Nombre ($RoomId)"
        return $true
    }
    catch {
        Write-Error "Error creando sala $RoomId`: $($_.Exception.Message)"
        return $false
    }
}

# Función principal
function Main {
    Write-Host "🚀 Poblando datos de prueba para Parque Explora" -ForegroundColor Magenta
    Write-Host "==============================================" -ForegroundColor Magenta
    Write-Host ""
    
    # Verificar prerrequisitos
    if (-not (Test-AWSCLI)) {
        Write-Error "AWS CLI es requerido para ejecutar este script"
        exit 1
    }
    
    if (-not (Test-Tables)) {
        Write-Error "Las tablas requeridas no existen. Ejecuta 'sam deploy' primero."
        exit 1
    }
    
    Write-Status "Iniciando población de datos de prueba..."
    Write-Host ""
    
    # Crear usuarios de prueba
    Write-Status "Creando usuarios de prueba..."
    $currentDate = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    $yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $twoDaysAgo = (Get-Date).AddDays(-2).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $threeDaysAgo = (Get-Date).AddDays(-3).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $fourDaysAgo = (Get-Date).AddDays(-4).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    
    $testUsers = @(
        @{ Cedula = "12345678"; Nombre = "Juan Pérez"; Email = "juan.perez@email.com"; Telefono = "3001234567"; FechaCompra = $currentDate; BoletaId = "BOL-001-12345678" },
        @{ Cedula = "87654321"; Nombre = "María García"; Email = "maria.garcia@email.com"; Telefono = "3007654321"; FechaCompra = $yesterday; BoletaId = "BOL-002-87654321" },
        @{ Cedula = "11223344"; Nombre = "Carlos López"; Email = "carlos.lopez@email.com"; Telefono = "3001122334"; FechaCompra = $twoDaysAgo; BoletaId = "BOL-003-11223344" },
        @{ Cedula = "55667788"; Nombre = "Ana Martínez"; Email = "ana.martinez@email.com"; Telefono = "3005566778"; FechaCompra = $threeDaysAgo; BoletaId = "BOL-004-55667788" },
        @{ Cedula = "99887766"; Nombre = "Pedro Rodríguez"; Email = "pedro.rodriguez@email.com"; Telefono = "3009988776"; FechaCompra = $fourDaysAgo; BoletaId = "BOL-005-99887766" }
    )
    
    foreach ($user in $testUsers) {
        New-TestUser -Cedula $user.Cedula -Nombre $user.Nombre -Email $user.Email -Telefono $user.Telefono -FechaCompra $user.FechaCompra -BoletaId $user.BoletaId
    }
    
    Write-Host ""
    
    # Crear salas de prueba
    Write-Status "Creando salas del parque..."
    $testRooms = @(
        @{ RoomId = "sala-1"; Nombre = "Sala de Proyección 3D"; Descripcion = "Experiencia inmersiva en 3D con tecnología de última generación"; Categoria = "Tecnología" },
        @{ RoomId = "sala-2"; Nombre = "Planetario"; Descripcion = "Observación del cosmos y proyecciones astronómicas"; Categoria = "Astronomía" },
        @{ RoomId = "sala-3"; Nombre = "Laboratorio de Química"; Descripcion = "Experimentos interactivos de química y física"; Categoria = "Ciencias" },
        @{ RoomId = "sala-4"; Nombre = "Acuario"; Descripcion = "Exhibición de vida marina y ecosistemas acuáticos"; Categoria = "Biología" },
        @{ RoomId = "sala-5"; Nombre = "Sala de Robots"; Descripcion = "Interacción con robots y tecnología de inteligencia artificial"; Categoria = "Robótica" },
        @{ RoomId = "sala-6"; Nombre = "Museo de la Tierra"; Descripcion = "Exhibición sobre geología y formaciones terrestres"; Categoria = "Geología" }
    )
    
    foreach ($room in $testRooms) {
        New-TestRoom -RoomId $room.RoomId -Nombre $room.Nombre -Descripcion $room.Descripcion -Categoria $room.Categoria
    }
    
    Write-Host ""
    Write-Success "¡Datos de prueba creados exitosamente!"
    Write-Host ""
    Write-Host "👥 Usuarios de prueba creados:" -ForegroundColor Cyan
    foreach ($user in $testUsers) {
        Write-Host "   - $($user.Nombre) (Cédula: $($user.Cedula))" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "🏛️ Salas del parque creadas:" -ForegroundColor Cyan
    foreach ($room in $testRooms) {
        Write-Host "   - $($room.Nombre) ($($room.Categoria))" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "💡 Ahora puedes usar estos usuarios para probar el sistema:" -ForegroundColor Yellow
    Write-Host "   1. Ve a http://localhost:3000" -ForegroundColor Gray
    Write-Host "   2. Ingresa cualquiera de las cédulas de prueba" -ForegroundColor Gray
    Write-Host "   3. Completa la encuesta de satisfacción" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎫 O simula una compra en: http://localhost:3000/compra" -ForegroundColor Yellow
}

# Ejecutar función principal
Main
