import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

interface Zona {
  id: number
  zona_nombre: string
}

export default function ZonasScreen() {
  const [zonas, setZonas] = useState<Zona[]>([])
  const [nuevaZona, setNuevaZona] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarZonas()
  }, [])

  async function cargarZonas() {
    setCargando(true)
    const { data, error } = await supabase
      .from('Zona')
      .select('*')
      .order('id', { ascending: true })
    if (error) {
      console.error('Error al cargar zonas:', error)
    } else {
      setZonas(data || [])
    }
    setCargando(false)
  }

  async function agregarZona() {
    if (!nuevaZona.trim()) return
    const { error } = await supabase.from('Zona').insert({ zona_nombre: nuevaZona })
    if (error) {
      alert('Error al agregar zona: ' + error.message)
      return
    }
    setNuevaZona('')
    cargarZonas()
  }

  async function eliminarZona(id: number) {
    const confirmar = confirm('¿Eliminar esta zona?')
    if (!confirmar) return
    const { error } = await supabase.from('Zona').delete().eq('id', id)
    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }
    cargarZonas()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Zonas</h2>

      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Nueva zona"
          value={nuevaZona}
          onChange={(e) => setNuevaZona(e.target.value)}
        />
        <button
          onClick={agregarZona}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {zonas.map((z) => (
              <tr key={z.id}>
                <td className="border px-4 py-2">{z.id}</td>
                <td className="border px-4 py-2">{z.zona_nombre}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => eliminarZona(z.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {zonas.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  No hay zonas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
