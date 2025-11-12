import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { supabase } from '../supabaseClient'

interface Persona {
  id: number
  nombre: string
  apellido: string
  documento: string
  domicilio: string
  telefono: string
  trabaja: string
  vehiculo: string
  ayudas: number
  id_dirigente?: number | null
}

interface Dirigente {
  id: number
  nombre: string
  apellido: string
}

export default function PersonasScreen() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [dirigentes, setDirigentes] = useState<Dirigente[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPersona, setCurrentPersona] = useState<Partial<Persona> | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)

  // ===== CARGA INICIAL =====
  async function cargarPersonas() {
    const { data, error } = await supabase.from('Persona').select('*').order('id')
    if (error) console.error('Error cargando personas:', error)
    else setPersonas(data || [])
  }

  async function cargarDirigentes() {
    const { data, error } = await supabase.from('Dirigentes').select('id, nombre, apellido').order('nombre')
    if (error) console.error('Error cargando dirigentes:', error)
    else setDirigentes(data || [])
  }

  useEffect(() => {
    cargarPersonas()
    cargarDirigentes()
  }, [])

  // ===== FUNCIONES =====
  const getColorByAyudas = (ayudas: number) => {
    if (ayudas === 0) return 'bg-red-100'
    if (ayudas <= 2) return 'bg-yellow-100'
    return 'bg-green-100'
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta persona?')) return
    await supabase.from('Persona').delete().eq('id', id)
    await cargarPersonas()
  }

  const filteredPersonas = personas.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documento?.includes(searchTerm)
  )

  const incrementarAyudas = async (id: number) => {
    const persona = personas.find((p) => p.id === id)
    if (!persona) return
    const nuevasAyudas = persona.ayudas + 1
    await supabase.from('Persona').update({ ayudas: nuevasAyudas }).eq('id', id)
    await cargarPersonas()
  }

  const decrementarAyudas = async (id: number) => {
    const persona = personas.find((p) => p.id === id)
    if (!persona) return
    const nuevasAyudas = Math.max(0, persona.ayudas - 1)
    await supabase.from('Persona').update({ ayudas: nuevasAyudas }).eq('id', id)
    await cargarPersonas()
  }

  const resetearAyudas = async (id: number) => {
    await supabase.from('Persona').update({ ayudas: 0 }).eq('id', id)
    await cargarPersonas()
  }

  // ===== CREAR o EDITAR =====
  const handleGuardar = async () => {
    if (!currentPersona?.nombre || !currentPersona.apellido) {
      alert('Debe completar nombre y apellido')
      return
    }

    const data = {
      nombre: currentPersona.nombre,
      apellido: currentPersona.apellido,
      documento: currentPersona.documento || '',
      domicilio: currentPersona.domicilio || '',
      telefono: currentPersona.telefono || '',
      trabaja: currentPersona.trabaja || '',
      vehiculo: currentPersona.vehiculo || '',
      ayudas: currentPersona.ayudas ?? 0,
      id_dirigente: currentPersona.id_dirigente || null,
    }

    if (modoEdicion && currentPersona.id) {
      await supabase.from('Persona').update(data).eq('id', currentPersona.id)
    } else {
      await supabase.from('Persona').insert(data)
    }

    setIsDialogOpen(false)
    setCurrentPersona(null)
    setModoEdicion(false)
    await cargarPersonas()
  }

  const abrirEdicion = (persona: Persona) => {
    setCurrentPersona(persona)
    setModoEdicion(true)
    setIsDialogOpen(true)
  }

  const abrirNuevo = () => {
    setCurrentPersona({})
    setModoEdicion(false)
    setIsDialogOpen(true)
  }

  // ===== INTERFAZ =====
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#001447]">Gestión de Personas</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar persona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="bg-[#001447] hover:bg-blue-900" onClick={abrirNuevo}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Persona
            </Button>
          </div>
        </div>

        {/* Modal Crear/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{modoEdicion ? 'Editar Persona' : 'Nueva Persona'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={currentPersona?.nombre || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input
                  value={currentPersona?.apellido || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, apellido: e.target.value })}
                />
              </div>
              <div>
                <Label>Documento</Label>
                <Input
                  value={currentPersona?.documento || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, documento: e.target.value })}
                />
              </div>
              <div>
                <Label>Domicilio</Label>
                <Input
                  value={currentPersona?.domicilio || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, domicilio: e.target.value })}
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={currentPersona?.telefono || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, telefono: e.target.value })}
                />
              </div>
              <div>
                <Label>Trabaja</Label>
                <Input
                  value={currentPersona?.trabaja || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, trabaja: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>Vehículo</Label>
                <Input
                  value={currentPersona?.vehiculo || ''}
                  onChange={(e) => setCurrentPersona({ ...currentPersona, vehiculo: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>Dirigente</Label>
                <select
                  className="border rounded w-full px-3 py-2"
                  value={currentPersona?.id_dirigente || ''}
                  onChange={(e) =>
                    setCurrentPersona({
                      ...currentPersona,
                      id_dirigente: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">(Sin asignar)</option>
                  {dirigentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre} {d.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-[#001447]" onClick={handleGuardar}>
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Leyenda */}
        <div className="mb-4 flex items-center gap-4 p-4 bg-gray-100 rounded">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-400 rounded"></div>
            <span className="text-sm">No ayudado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded"></div>
            <span className="text-sm">1-2 ayudas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-400 rounded"></div>
            <span className="text-sm">3+ ayudas</span>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#001447] text-white">
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Apellido</th>
                <th className="px-4 py-3 text-left">Documento</th>
                <th className="px-4 py-3 text-left">Domicilio</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Trabaja</th>
                <th className="px-4 py-3 text-left">Vehículo</th>
                <th className="px-4 py-3 text-center">Ayudas</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonas.map((p) => (
                <tr key={p.id} className={`${getColorByAyudas(p.ayudas)} hover:opacity-80`}>
                  <td className="border px-4 py-3">{p.nombre}</td>
                  <td className="border px-4 py-3">{p.apellido}</td>
                  <td className="border px-4 py-3">{p.documento}</td>
                  <td className="border px-4 py-3">{p.domicilio}</td>
                  <td className="border px-4 py-3">{p.telefono}</td>
                  <td className="border px-4 py-3">{p.trabaja}</td>
                  <td className="border px-4 py-3">{p.vehiculo}</td>
                  <td className="border px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => decrementarAyudas(p.id)}>
                        -
                      </Button>
                      <span className="min-w-[30px] text-center">{p.ayudas}</span>
                      <Button size="sm" variant="outline" onClick={() => incrementarAyudas(p.id)}>
                        +
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => resetearAyudas(p.id)}>
                        Reset
                      </Button>
                    </div>
                  </td>
                  <td className="border px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => abrirEdicion(p)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
