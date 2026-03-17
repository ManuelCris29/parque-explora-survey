'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, User, Calendar, Ticket, CheckCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const [cedula, setCedula] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [surveyStatus, setSurveyStatus] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<'search' | 'user-found' | 'user-not-found' | 'survey-completed'>('search')
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [registerNombre, setRegisterNombre] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerTelefono, setRegisterTelefono] = useState('')
  const router = useRouter()

  const handleGetSurvey = async () => {
    try {
      toast.loading('Verificando usuario...', { id: 'survey' })

      const userResponse = await fetch(`/api/users/${cedula}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        }
      })

      if (userResponse.status === 404) {
        toast.error('Usuario no registrado. Debes estar registrado para acceder a la encuesta.', { id: 'survey' })
        setCurrentStep('user-not-found')
        return
      }

      if (!userResponse.ok) {
        toast.error('No fue posible validar el usuario. Intenta nuevamente.', { id: 'survey' })
        return
      }

      const userPayload = await userResponse.json()
      const resolvedUser = userPayload?.data || userPayload?.user || null
      await handleCheckUserAndCreateSurvey(resolvedUser)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al buscar encuesta'
      toast.error(errorMessage, { id: 'survey' })
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que la cédula tenga al menos 6 dígitos
    if (cedula.trim() && cedula.length >= 6) {
      setLoading(true)
      handleGetSurvey()
    } else {
      toast.error('La cédula debe tener al menos 6 dígitos', { id: 'validation' })
    }
  }

  const handleCreateSurvey = async () => {
    try {
      toast.loading('Creando encuesta...', { id: 'create' })
      
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        },
        body: JSON.stringify({ cedula })
      })

      if (!response.ok) {
        throw new Error('Error al crear la encuesta')
      }

      toast.success('¡Encuesta creada!', { id: 'create' })
      
      // Recargar la página para mostrar la encuesta
      window.location.reload()
      
    } catch {
      toast.error('Error al crear la encuesta', { id: 'create' })
    }
  }

  const handleCheckUserAndCreateSurvey = async (resolvedUserData?: any) => {
    try {
      const existingUser = resolvedUserData || null

      if (!existingUser) {
        toast.error('Usuario no registrado. Debes estar registrado para acceder a la encuesta.', { id: 'survey' })
        setCurrentStep('user-not-found')
        return
      }

      toast.loading('Buscando encuesta...', { id: 'survey' })

      const existingSurveyResponse = await fetch(`/api/surveys/user/${cedula}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        }
      })

      if (existingSurveyResponse.ok) {
        const surveyData = await existingSurveyResponse.json()
        const survey = surveyData.data.survey

        if (survey.estado === 'completed') {
          toast.error('Ya completaste la encuesta. No puedes editarla nuevamente.', { id: 'survey' })
          setCurrentStep('survey-completed')
          return
        }

        setUserData(surveyData.data.user || existingUser)
        setSurveyStatus(survey)
        setCurrentStep('user-found')

        toast.success('¡Encuesta encontrada!', { id: 'survey' })

        setTimeout(() => {
          router.push(`/survey?cedula=${cedula}`)
        }, 1000)

        return
      }

      if (existingSurveyResponse.status !== 404) {
        toast.error('No fue posible consultar la encuesta. Intenta nuevamente.', { id: 'survey' })
        return
      }

      toast.loading('Creando encuesta...', { id: 'survey' })

      const surveyResponse = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        },
        body: JSON.stringify({ cedula })
      })

      if (!surveyResponse.ok) {
        if (surveyResponse.status === 409) {
          const conflictData = await surveyResponse.json().catch(() => null)
          const conflictMessage = conflictData?.error || 'Ya existe una encuesta para esta cédula.'

          if (conflictData?.completedToday) {
            setCurrentStep('survey-completed')
          }

          toast.error(conflictMessage, { id: 'survey' })
          return
        }

        toast.error('Error al crear la encuesta', { id: 'survey' })
        return
      }

      setUserData(existingUser)
      setCurrentStep('user-found')
      toast.success('¡Encuesta creada! Redirigiendo...', { id: 'survey' })

      setTimeout(() => {
        router.push(`/survey?cedula=${cedula}`)
      }, 1000)
    } catch {
      toast.error('Error al gestionar la encuesta', { id: 'survey' })
      setCurrentStep('user-not-found')
    }
  }

  const handleCreateUserAndSurvey = async () => {
    try {
      // Paso 1: Crear usuario
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        },
        body: JSON.stringify({
          cedula,
          nombre: registerNombre || `Visitante ${cedula}`,
          email: registerEmail || `visitante${cedula}@parqueexplora.co`,
          telefono: registerTelefono || ''
        })
      })

      if (!userResponse.ok) {
        throw new Error('Error al crear el usuario')
      }

      // Paso 2: Crear encuesta
      const surveyResponse = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        },
        body: JSON.stringify({ cedula })
      })

      if (!surveyResponse.ok) {
        throw new Error('Error al crear la encuesta')
      }

      toast.success('¡Usuario y encuesta creados! Redirigiendo...', { id: 'survey' })
      
      // Paso 3: Ir directamente a la encuesta
      setTimeout(() => {
        router.push(`/survey?cedula=${cedula}`)
      }, 1000)
      
    } catch {
      toast.error('Error al crear usuario y encuesta', { id: 'survey' })
      setCurrentStep('user-not-found')
    }
  }

  const handleCreateUser = async () => {
    try {
      toast.loading('Creando usuario...', { id: 'user' })
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        },
        body: JSON.stringify({
          cedula,
          nombre: 'Usuario Temporal',
          email: 'usuario@example.com',
          telefono: '3000000000'
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear el usuario')
      }

      toast.success('¡Usuario creado!', { id: 'user' })
      
      // Crear encuesta para el nuevo usuario
      await handleCreateSurvey()
      
    } catch {
      toast.error('Error al crear el usuario', { id: 'user' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Parque Explora</h1>
                  <p className="text-sm text-gray-500">Encuesta de Satisfacción</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Sistema de Evaluación
              </div>
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
                title="Panel de Administración"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema de Encuestas
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Ayúdanos a mejorar tu experiencia en el Parque Explora
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Para acceder a tu encuesta de satisfacción, ingresa tu número de cédula 
            en el formulario a continuación. Esto nos permitirá identificar tu visita 
            y personalizar tu experiencia.
          </p>
        </div>

        {/* Search Section */}
        {currentStep === 'search' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Buscar mi Encuesta
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Ingresa tu número de cédula para acceder a tu encuesta de satisfacción
            </p>
            
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cédula
                </label>
                <input
                  id="cedula"
                  type="text"
                  value={cedula}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setCedula(value)
                  }}
                  placeholder="Ej: 12345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  maxLength={15}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !cedula.trim() || cedula.length < 6}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Buscar Encuesta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* User Found Section */}
        {currentStep === 'user-found' && userData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                ¡Usuario encontrado!
              </h2>
              <p className="text-gray-600">
                Hola <strong>{userData.nombre}</strong>, encontramos tu información
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900">Información Personal</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Cédula:</span> {userData.cedula}</p>
                  <p><span className="font-medium">Email:</span> {userData.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {userData.telefono}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Ticket className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900">Información de Compra</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Boleta ID:</span> {userData.boletaId}</p>
                  <p><span className="font-medium">Fecha:</span> {new Date(userData.fechaCompra).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Survey Status */}
            {surveyStatus && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-blue-900">Estado de la Encuesta</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">
                      Estado: <span className={`font-medium ${surveyStatus.estado === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                        {surveyStatus.estado === 'completed' ? 'Completada' : 'Pendiente'}
                      </span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Creada: {new Date(surveyStatus.fechaCreacion).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/survey?cedula=${cedula}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
                  >
                    {surveyStatus.estado === 'completed' ? 'Ver Encuesta' : 'Continuar Encuesta'}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`/survey?cedula=${cedula}`)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Acceder a Encuesta</span>
              </button>
              
              <button
                onClick={() => {
                  setCedula('')
                  setCurrentStep('search')
                  setUserData(null)
                  setSurveyStatus(null)
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Nueva Búsqueda
              </button>
            </div>
          </div>
        )}

        {/* Survey Completed Section */}
        {currentStep === 'survey-completed' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Encuesta completada
            </h2>
            <p className="text-gray-600 mb-6">
              Ya completaste la encuesta de satisfacción para la cédula <strong>{cedula}</strong>. 
              No puedes editarla nuevamente una vez que ha sido completada.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setCedula('')
                  setCurrentStep('search')
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                Buscar otra cédula
              </button>
              <p className="text-sm text-gray-500">
                Gracias por tu participación. Tu opinión es muy importante para nosotros.
              </p>
            </div>
          </div>
        )}

        {/* User Not Found Section */}
        {currentStep === 'user-not-found' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Usuario no registrado
              </h2>
              <p className="text-gray-600 mb-6">
                No encontramos un usuario registrado con la cédula <strong>{cedula}</strong>.
                Para acceder a la encuesta debés estar registrado.
              </p>
            </div>

            {!showRegisterForm ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition duration-200"
                >
                  Registrarme y completar encuesta
                </button>
                <button
                  onClick={() => { setCedula(''); setCurrentStep('search'); setShowRegisterForm(false) }}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                >
                  Buscar otra cédula
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleCreateUserAndSurvey() }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={registerNombre}
                    onChange={(e) => setRegisterNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Ej: juan@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={registerTelefono}
                    onChange={(e) => setRegisterTelefono(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ej: 3001234567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Registrando...' : 'Confirmar registro y continuar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  )
}