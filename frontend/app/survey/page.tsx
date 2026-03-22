'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

function SurveyPageContent() {
  const searchParams = useSearchParams()
  const cedula = searchParams.get('cedula')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rooms, setRooms] = useState<any[]>([])
  const [surveyData, setSurveyData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  
  // Form states
  const [salasVisitadas, setSalasVisitadas] = useState<string[]>([])
  const [salasFavoritas, setSalasFavoritas] = useState<string[]>([])
  const [salasParaRenovar, setSalasParaRenovar] = useState<string[]>([])
  const [calificacionGeneral, setCalificacionGeneral] = useState<number | null>(null)
  const [comentarios, setComentarios] = useState('')

  useEffect(() => {
    if (cedula) {
      loadData()
    }
  }, [cedula])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar salas disponibles
      const roomsResponse = await fetch('/api/rooms', {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        }
      })
      
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json()
        setRooms(roomsData.rooms || roomsData.data || [])
      }

      // Cargar datos de la encuesta y usuario
      const surveyResponse = await fetch(`/api/surveys/user/${cedula}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        }
      })

      if (surveyResponse.ok) {
        const surveyData = await surveyResponse.json()
        setSurveyData(surveyData.data.survey)
        setUserData(surveyData.data.user)
        
        // Cargar datos existentes si la encuesta ya tiene información
        if (surveyData.data.survey.salasVisitadas) {
          setSalasVisitadas(surveyData.data.survey.salasVisitadas)
        }
        if (surveyData.data.survey.salasFavoritas) {
          setSalasFavoritas(surveyData.data.survey.salasFavoritas)
        }
        if (surveyData.data.survey.salasParaRenovar) {
          setSalasParaRenovar(surveyData.data.survey.salasParaRenovar)
        }
        if (surveyData.data.survey.calificacionGeneral) {
          setCalificacionGeneral(surveyData.data.survey.calificacionGeneral)
        }
        if (surveyData.data.survey.comentarios) {
          setComentarios(surveyData.data.survey.comentarios)
        }
      } else {
        throw new Error('Encuesta no encontrada')
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error al cargar los datos de la encuesta')
    } finally {
      setLoading(false)
    }
  }

  const handleRoomToggle = (roomId: string, category: 'visitadas' | 'favoritas' | 'renovar') => {
    if (category === 'visitadas') {
      setSalasVisitadas(prev => 
        prev.includes(roomId) 
          ? prev.filter(id => id !== roomId)
          : [...prev, roomId]
      )
      // Si se deselecciona de visitadas, también quitarla de favoritas
      if (salasVisitadas.includes(roomId)) {
        setSalasFavoritas(prev => prev.filter(id => id !== roomId))
      }
    } else if (category === 'favoritas') {
      setSalasFavoritas(prev => 
        prev.includes(roomId) 
          ? prev.filter(id => id !== roomId)
          : [...prev, roomId]
      )
    } else if (category === 'renovar') {
      setSalasParaRenovar(prev => 
        prev.includes(roomId) 
          ? prev.filter(id => id !== roomId)
          : [...prev, roomId]
      )
    }
  }

  const handleRankChange = (roomId: string, newRank: number) => {
    const currentRank = salasFavoritas.indexOf(roomId) + 1
    
    if (newRank === 0) {
      // Remover de favoritas
      setSalasFavoritas(prev => prev.filter(id => id !== roomId))
    } else {
      // Crear nueva lista de favoritas con el nuevo orden
      const newFavoritas = [...salasFavoritas]
      
      // Remover la sala de su posición actual
      newFavoritas.splice(currentRank - 1, 1)
      
      // Insertar en la nueva posición
      newFavoritas.splice(newRank - 1, 0, roomId)
      
      setSalasFavoritas(newFavoritas)
    }
  }

  const handleSubmit = async () => {
    if (!surveyData?.surveyId) {
      toast.error('No se encontró la encuesta')
      return
    }

    try {
      setSubmitting(true)
      
      const updateData = {
        salasVisitadas,
        salasFavoritas,
        salasParaRenovar,
        calificacionGeneral,
        comentarios,
        estado: 'completed'
      }

      const response = await fetch(`/api/surveys/${surveyData.surveyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Error al guardar la encuesta')
      }

      toast.success('¡Encuesta completada exitosamente!')
      
      // Redirigir a la página principal después de un breve delay
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting survey:', error)
      toast.error('Error al guardar la encuesta')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando encuesta...</p>
        </div>
      </div>
    )
  }

  if (!surveyData || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Encuesta no encontrada</h2>
          <p className="text-gray-600 mb-6">No se pudo cargar la información de la encuesta.</p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Encuesta de Satisfacción</h1>
            </div>
            <div className="text-sm text-gray-500">
              Cédula: {cedula}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Encuesta de Satisfacción
          </h1>
          <p className="text-lg text-gray-600">
            Ayúdanos a mejorar tu experiencia en el Parque Explora
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* User Info */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Información del Visitante</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nombre:</span>
                <p className="text-gray-900">{userData.nombre}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Cédula:</span>
                <p className="text-gray-900">{userData.cedula}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Fecha de Visita:</span>
                <p className="text-gray-900">{new Date(userData.fechaCompra).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Question 1: Salas Visitadas */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¿Qué salas visitaste durante tu estadía?
            </h2>
            <p className="text-gray-600 mb-6">
              Selecciona todas las salas que visitaste durante tu experiencia en el Parque Explora.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div key={room.roomId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`visitada-${room.roomId}`}
                      checked={salasVisitadas.includes(room.roomId)}
                      onChange={() => handleRoomToggle(room.roomId, 'visitadas')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{room.nombre}</h3>
                      <p className="text-sm text-gray-500 mt-1">{room.descripcion}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {room.categoria}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question 2: Salas Favoritas */}
          {salasVisitadas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Cuáles fueron tus salas favoritas? (Ordena por preferencia)
              </h2>
              <p className="text-gray-600 mb-4">
                Selecciona las salas que más te gustaron y ordénalas del 1 al {salasVisitadas.length} (1 = tu favorita):
              </p>
              <div className="space-y-3">
                {salasVisitadas.map((roomId, index) => {
                  const room = rooms.find(r => r.roomId === roomId)
                  const currentRank = salasFavoritas.indexOf(roomId) + 1
                  return room ? (
                    <div key={roomId} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
                      <input
                        type="checkbox"
                        checked={salasFavoritas.includes(roomId)}
                        onChange={() => handleRoomToggle(roomId, 'favoritas')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{room.nombre}</h3>
                        <p className="text-sm text-gray-500">{room.descripcion}</p>
                      </div>
                      {salasFavoritas.includes(roomId) && (
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Posición:</label>
                          <select
                            value={currentRank || ''}
                            onChange={(e) => handleRankChange(roomId, parseInt(e.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="">Seleccionar</option>
                            {salasFavoritas.map((_, rankIndex) => (
                              <option key={rankIndex + 1} value={rankIndex + 1}>
                                {rankIndex + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ) : null
                })}
              </div>
              {salasFavoritas.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Orden actual:</strong> {salasFavoritas.map((roomId, index) => {
                      const room = rooms.find(r => r.roomId === roomId)
                      return `${index + 1}. ${room?.nombre}`
                    }).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Question 3: Salas para Renovar */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¿Qué salas consideras que necesitan renovación?
            </h2>
            <p className="text-gray-600 mb-6">
              Selecciona las salas que consideras que necesitan mejoras, actualizaciones o renovación.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div key={room.roomId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`renovar-${room.roomId}`}
                      checked={salasParaRenovar.includes(room.roomId)}
                      onChange={() => handleRoomToggle(room.roomId, 'renovar')}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{room.nombre}</h3>
                      <p className="text-sm text-gray-500 mt-1">{room.descripcion}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {room.categoria}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question 4: Calificación General */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¿Cómo calificarías tu experiencia general?
            </h2>
            <p className="text-gray-600 mb-6">
              Selecciona una calificación del 1 al 5, donde 5 es excelente.
            </p>
            
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setCalificacionGeneral(rating)}
                  className={`p-3 rounded-lg border-2 transition duration-200 ${
                    calificacionGeneral === rating
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <Star 
                    className={`w-8 h-8 ${
                      calificacionGeneral && calificacionGeneral >= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                  <span className="block text-sm font-medium mt-1">{rating}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Comentarios */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Comentarios adicionales
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Tienes alguna sugerencia, comentario o recomendación para mejorar nuestra experiencia?
            </p>
            
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Escribe tus comentarios aquí..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center space-x-3 disabled:opacity-50 text-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>Completar Encuesta</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

const SurveyPageFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando encuesta...</p>
    </div>
  </div>
)

export default function SurveyPage() {
  return (
    <Suspense fallback={<SurveyPageFallback />}>
      <SurveyPageContent />
    </Suspense>
  )
}