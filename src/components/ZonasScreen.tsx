import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash2, Settings2, User, Users, Car } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

interface Zona {
  id: number
  zona_nombre: string
}

interface Dirigente {
  id: number
  id_zona: number | string | null
  nombre: string
  apellido: string
  documento?: string | null
  domicilio?: string | null
  telefono?: string | null
  personasACargo?: number
  vehiculosACargo?: number
}

export default function ZonasScreen() {
  const [zonas, setZonas] = useState<Zona[]>([])
  const [dirigentes, setDirigentes] = useState<Dirigente[]>([])
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>('todas')
  const [vistaActual, setVistaActual] = useState<'mapa' | 'lista' | 'admin'>('mapa')
  const [nuevaZona, setNuevaZona] = useState('')
  const { user } = useAuth()

  // ===== CARGA DE DATOS =====
  async function cargarZonas() {
    const { data, error } = await supabase.from('Zona').select('*').order('id')
    if (!error && data) setZonas(data)
  }

  async function cargarDirigentes() {
    const { data, error } = await supabase
      .from('Dirigentes')
      .select('id, id_zona, nombre, apellido, documento, domicilio, telefono')
    if (error) {
      console.error('Error cargando dirigentes:', error)
      return
    }

    // Cargar relaciones (Personas y Vehículos)
    const { data: personas, error: errPers } = await supabase
      .from('Persona')
      .select('id, id_dirigente')

    const { data: vehiculos, error: errVeh } = await supabase
      .from('Vehiculo')
      .select('id, id_dirigente')

    if (errPers) console.error('Error cargando personas:', errPers)
    if (errVeh) console.error('Error cargando vehiculos:', errVeh)

    // Calcular totales por dirigente
    const personasPorDirigente: Record<number, number> = {}
    const vehiculosPorDirigente: Record<number, number> = {}

    personas?.forEach((p) => {
      if (p.id_dirigente) {
        personasPorDirigente[p.id_dirigente] = (personasPorDirigente[p.id_dirigente] || 0) + 1
      }
    })

    vehiculos?.forEach((v) => {
      if (v.id_dirigente) {
        vehiculosPorDirigente[v.id_dirigente] = (vehiculosPorDirigente[v.id_dirigente] || 0) + 1
      }
    })

    // Fusionar conteos con los dirigentes
    const enriquecidos = (data || []).map((d) => ({
      ...d,
      personasACargo: personasPorDirigente[d.id] || 0,
      vehiculosACargo: vehiculosPorDirigente[d.id] || 0,
    }))

    setDirigentes(enriquecidos)
  }

  useEffect(() => {
    cargarZonas()
    cargarDirigentes()
  }, [])

  // ===== CRUD ZONAS =====
  async function agregarZona() {
    if (!nuevaZona.trim()) return
    await supabase.from('Zona').insert({ zona_nombre: nuevaZona.trim() })
    setNuevaZona('')
    await cargarZonas()
  }

  async function eliminarZona(id: number) {
    if (!confirm('¿Eliminar zona?')) return
    await supabase.from('Zona').delete().eq('id', id)
    await cargarZonas()
  }

  // ===== Colores por zona =====
  const getZonaColor = (zona: string) => {
    const colores = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500',
    ]
    const idx = zonas.findIndex((z) => z.zona_nombre === zona)
    return colores[idx % colores.length] || 'bg-gray-500'
  }

  // ===== Conteo de dirigentes por zona =====
  const conteoDirigentes: Record<string, number> = {}
  dirigentes.forEach((d) => {
    if (d.id_zona !== null && d.id_zona !== undefined) {
      const key = String(d.id_zona)
      conteoDirigentes[key] = (conteoDirigentes[key] || 0) + 1
    }
  })

  // ===== Filtrado =====
  const zonasFiltradas =
    zonaSeleccionada === 'todas'
      ? zonas
      : zonas.filter((z) => z.zona_nombre === zonaSeleccionada)

  const zonaActual = zonas.find((z) => z.zona_nombre === zonaSeleccionada)
  const dirigentesEnZona =
    zonaSeleccionada !== 'todas' && zonaActual
      ? dirigentes.filter((d) => String(d.id_zona) === String(zonaActual.id))
      : []

  // ===== UI =====
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#001447]">Gestión y Mapa de Zonas</h2>
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 bg-gray-100 p-1 rounded">
              <button
                onClick={() => setVistaActual('mapa')}
                className={`px-4 py-2 rounded transition-colors ${
                  vistaActual === 'mapa'
                    ? 'bg-[#001447] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mapa
              </button>
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-4 py-2 rounded transition-colors ${
                  vistaActual === 'lista'
                    ? 'bg-[#001447] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lista
              </button>
              {user?.role === 'administrador' && (
                <button
                  onClick={() => setVistaActual('admin')}
                  className={`px-4 py-2 rounded transition-colors ${
                    vistaActual === 'admin'
                      ? 'bg-[#001447] text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Settings2 className="inline w-4 h-4 mr-1" />
                  Admin
                </button>
              )}
            </div>

            <div className="w-64">
              <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las zonas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las zonas</SelectItem>
                  {zonas.map((z) => (
                    <SelectItem key={z.id} value={z.zona_nombre}>
                      {z.zona_nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ===== Vista MAPA ===== */}
        {vistaActual === 'mapa' && (
          <>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {zonas.map((zona) => {
                const count = conteoDirigentes[String(zona.id)] || 0
                return (
                  <div
                    key={zona.id}
                    className={`${getZonaColor(zona.zona_nombre)} ${
                      zonaSeleccionada === zona.zona_nombre || zonaSeleccionada === 'todas'
                        ? 'opacity-100'
                        : 'opacity-30'
                    } rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                    onClick={() => setZonaSeleccionada(zona.zona_nombre)}
                  >
                    <MapPin className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">{zona.zona_nombre}</div>
                    <div className="text-xs mt-1 opacity-90">{count} dirigente(s)</div>
                  </div>
                )
              })}
            </div>

            {/* Dirigentes de la zona */}
            {zonaSeleccionada !== 'todas' && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#001447] mb-4">
                  Dirigentes en {zonaSeleccionada}
                </h3>
                {dirigentesEnZona.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dirigentesEnZona.map((d) => (
                      <div
                        key={d.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <User className="w-5 h-5 text-blue-700" />
                          </div>
                          <h4 className="text-lg font-semibold text-[#001447]">
                            {d.nombre} {d.apellido}
                          </h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Documento:</strong> {d.documento || '—'}</p>
                          <p><strong>Dirección:</strong> {d.domicilio || '—'}</p>
                          <p><strong>Teléfono:</strong> {d.telefono || '—'}</p>
                          <div className="flex justify-between mt-3 text-sm">
                            <span className="flex items-center gap-1 text-blue-700">
                              <Users className="w-4 h-4" /> {d.personasACargo} personas
                            </span>
                            <span className="flex items-center gap-1 text-green-700">
                              <Car className="w-4 h-4" /> {d.vehiculosACargo} vehículos
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay dirigentes registrados en esta zona.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
