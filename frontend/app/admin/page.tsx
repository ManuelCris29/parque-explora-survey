'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  X,
  Star,
  Home,
  Heart,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  cedula: string
  nombre: string
  email: string
  telefono: string
  fechaCreacion: string
}

interface Survey {
  surveyId: string
  cedula: string
  estado: 'pending' | 'in_progress' | 'completed'
  calificacionGeneral?: number
  salasVisitadas?: string[]
  salasFavoritas?: string[]
  salasParaRenovar?: string[]
  comentarios?: string
  fechaCreacion: string
  fechaActualizacion: string
  user?: User
}

interface DashboardStats {
  totalUsers: number
  totalSurveys: number
  completedSurveys: number
  pendingSurveys: number
  averageRating: number
}

export default function AdminPanel() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSurveys: 0,
    completedSurveys: 0,
    pendingSurveys: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [viewingSurvey, setViewingSurvey] = useState<Survey | null>(null)
  const [rooms, setRooms] = useState<string[]>([])
  const [creatingUser, setCreatingUser] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData()
    } else if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'surveys') {
      loadSurveys()
    }
  }, [activeTab])

  useEffect(() => {
    loadRooms()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Cargar estadísticas generales
      const usersResponse = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })

      const surveysResponse = await fetch(`${API_BASE_URL}/surveys`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })

      // Calcular estadísticas
      const usersData = await usersResponse.json()
      const surveysData = await surveysResponse.json()
      
      const totalUsers = usersData.users?.length || 0
      const totalSurveys = surveysData.surveys?.length || 0
      const completedSurveys = surveysData.surveys?.filter((s: Survey) => s.estado === 'completed').length || 0
      const pendingSurveys = surveysData.surveys?.filter((s: Survey) => s.estado === 'pending' || s.estado === 'in_progress').length || 0
      
      const ratings = surveysData.surveys?.filter((s: Survey) => s.calificacionGeneral).map((s: Survey) => s.calificacionGeneral) || []
      const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0

      setStats({
        totalUsers,
        totalSurveys,
        completedSurveys,
        pendingSurveys,
        averageRating: Math.round(averageRating * 10) / 10
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Error al cargar datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const loadSurveys = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/surveys`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSurveys(data.surveys || [])
      }
    } catch (error) {
      console.error('Error loading surveys:', error)
      toast.error('Error al cargar encuestas')
    } finally {
      setLoading(false)
    }
  }

  const loadRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms || [])
      }
    } catch (error) {
      console.error('Error loading rooms:', error)
    }
  }

  // CRUD Functions for Users
  const createUser = async (userData: { cedula: string, nombre: string, email: string, telefono: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      if (response.ok) {
        toast.success('Usuario creado exitosamente')
        setCreatingUser(false)
        loadUsers()
        loadDashboardData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al crear usuario')
      }
    } catch {
      toast.error('Error al crear usuario')
    }
  }

  const getUserById = async (cedula: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${cedula}`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.data
      }
    } catch (error) {
      console.error('Error getting user:', error)
      toast.error('Error al obtener usuario')
    }
  }

  const updateUser = async (cedula: string, userData: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${cedula}`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success('Usuario actualizado exitosamente')
        loadUsers()
        return data.data
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al actualizar usuario')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Error al actualizar usuario')
    }
  }

  const deleteUser = async (cedula: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción también eliminará todas sus encuestas.')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${cedula}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        toast.success('Usuario eliminado exitosamente')
        loadUsers()
        loadSurveys()
        loadDashboardData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al eliminar usuario')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error al eliminar usuario')
    }
  }

  // CRUD Functions for Surveys
  const getSurveyById = async (surveyId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.data
      }
    } catch (error) {
      console.error('Error getting survey:', error)
      toast.error('Error al obtener encuesta')
    }
  }

  const updateSurvey = async (surveyId: string, surveyData: Partial<Survey>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success('Encuesta actualizada exitosamente')
        loadSurveys()
        return data.data
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al actualizar encuesta')
      }
    } catch (error) {
      console.error('Error updating survey:', error)
      toast.error('Error al actualizar encuesta')
    }
  }

  const deleteSurvey = async (surveyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta encuesta?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY!,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        toast.success('Encuesta eliminada exitosamente')
        loadSurveys()
        loadDashboardData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al eliminar encuesta')
      }
    } catch (error) {
      console.error('Error deleting survey:', error)
      toast.error('Error al eliminar encuesta')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'in_progress':
        return 'En Progreso'
      case 'pending':
        return 'Pendiente'
      default:
        return 'Desconocido'
    }
  }

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cedula.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSurveys = surveys.filter(survey =>
    survey.cedula.includes(searchTerm) ||
    survey.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (survey.user?.nombre && survey.user.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Volver al Sistema
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'surveys', label: 'Encuestas', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Encuestas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSurveys}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingSurveys}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Los datos de actividad reciente se cargarán próximamente</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setCreatingUser(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Usuario</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cédula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Cargando usuarios...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.cedula} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.cedula}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.telefono || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.fechaCreacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={async () => {
                                const userData = await getUserById(user.cedula)
                                if (userData) setViewingUser(userData)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-green-600 hover:text-green-900"
                              title="Editar usuario"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.cedula)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Surveys Tab */}
        {activeTab === 'surveys' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestión de Encuestas</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar encuestas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Encuesta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cédula Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actualización
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        Cargando encuestas...
                      </td>
                    </tr>
                  ) : filteredSurveys.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron encuestas
                      </td>
                    </tr>
                  ) : (
                    filteredSurveys.map((survey) => (
                      <tr key={survey.surveyId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {survey.surveyId.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {survey.cedula}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(survey.estado)}
                            <span className="text-sm text-gray-900">
                              {getStatusText(survey.estado)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {survey.calificacionGeneral ? `${survey.calificacionGeneral}/5` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(survey.fechaCreacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(survey.fechaActualizacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={async () => {
                                const surveyData = await getSurveyById(survey.surveyId)
                                if (surveyData) setViewingSurvey(surveyData)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingSurvey(survey)}
                              className="text-green-600 hover:text-green-900"
                              title="Editar encuesta"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSurvey(survey.surveyId)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar encuesta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Ver Usuario */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles del Usuario</h3>
              <button
                onClick={() => setViewingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Cédula:</label>
                <p className="text-gray-900">{viewingUser.cedula}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre:</label>
                <p className="text-gray-900">{viewingUser.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="text-gray-900">{viewingUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono:</label>
                <p className="text-gray-900">{viewingUser.telefono || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Registro:</label>
                <p className="text-gray-900">{new Date(viewingUser.fechaCreacion).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Usuario */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Editar Usuario</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const userData = {
                nombre: formData.get('nombre') as string,
                email: formData.get('email') as string,
                telefono: formData.get('telefono') as string
              }
              await updateUser(editingUser.cedula, userData)
              setEditingUser(null)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={editingUser.nombre}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono:</label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={editingUser.telefono}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Ver Encuesta */}
      {viewingSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles de la Encuesta</h3>
              <button
                onClick={() => setViewingSurvey(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID Encuesta:</label>
                  <p className="text-gray-900 text-sm">{viewingSurvey.surveyId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cédula Usuario:</label>
                  <p className="text-gray-900">{viewingSurvey.cedula}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado:</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(viewingSurvey.estado)}
                    <span className="text-gray-900">{getStatusText(viewingSurvey.estado)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Calificación General:</label>
                  <p className="text-gray-900">
                    {viewingSurvey.calificacionGeneral ? `${viewingSurvey.calificacionGeneral}/5` : 'No especificada'}
                  </p>
                </div>
              </div>
              {viewingSurvey.salasVisitadas && viewingSurvey.salasVisitadas.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Salas Visitadas:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingSurvey.salasVisitadas.map((sala, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        <Home className="w-3 h-3 inline mr-1" />
                        {sala}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewingSurvey.salasFavoritas && viewingSurvey.salasFavoritas.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Salas Favoritas:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingSurvey.salasFavoritas.map((sala, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        <Heart className="w-3 h-3 inline mr-1" />
                        {sala}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewingSurvey.salasParaRenovar && viewingSurvey.salasParaRenovar.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Salas para Renovar:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingSurvey.salasParaRenovar.map((sala, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        <RefreshCw className="w-3 h-3 inline mr-1" />
                        {sala}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewingSurvey.comentarios && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Comentarios:</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {viewingSurvey.comentarios}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha Creación:</label>
                  <p className="text-gray-900 text-sm">{new Date(viewingSurvey.fechaCreacion).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Última Actualización:</label>
                  <p className="text-gray-900 text-sm">{new Date(viewingSurvey.fechaActualizacion).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Encuesta */}
      {editingSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Editar Encuesta</h3>
              <button
                onClick={() => setEditingSurvey(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const surveyData = {
                estado: formData.get('estado') as Survey['estado'],
                calificacionGeneral: formData.get('calificacionGeneral') ? parseInt(formData.get('calificacionGeneral') as string) : undefined,
                comentarios: formData.get('comentarios') as string
              }
              await updateSurvey(editingSurvey.surveyId, surveyData)
              setEditingSurvey(null)
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Estado:</label>
                    <select
                      name="estado"
                      defaultValue={editingSurvey.estado}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Calificación General (1-5):</label>
                    <select
                      name="calificacionGeneral"
                      defaultValue={editingSurvey.calificacionGeneral || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sin calificar</option>
                      <option value="1">1 - Muy Malo</option>
                      <option value="2">2 - Malo</option>
                      <option value="3">3 - Regular</option>
                      <option value="4">4 - Bueno</option>
                      <option value="5">5 - Excelente</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Comentarios:</label>
                  <textarea
                    name="comentarios"
                    defaultValue={editingSurvey.comentarios || ''}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Comentarios adicionales..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSurvey(null)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Crear Usuario */}
      {creatingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Usuario</h3>
              <button onClick={() => setCreatingUser(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              await createUser({
                cedula: formData.get('cedula') as string,
                nombre: formData.get('nombre') as string,
                email: formData.get('email') as string,
                telefono: (formData.get('telefono') as string) || ''
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                  <input name="cedula" type="text" required pattern="[0-9]+" placeholder="Ej: 12345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input name="nombre" type="text" required placeholder="Ej: Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" required placeholder="Ej: juan@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input name="telefono" type="text" placeholder="Ej: 3001234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                    <Save className="w-4 h-4" />
                    <span>Crear Usuario</span>
                  </button>
                  <button type="button" onClick={() => setCreatingUser(false)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200">
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

