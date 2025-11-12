import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  domicilio: string;
  telefono: string;
  trabaja: string;
  vehiculo: string;
  ayudas: number; // 0 = no ayudado (rojo), 1-2 = amarillo, 3+ = verde
}

export default function PersonasScreen() {
  const [personas, setPersonas] = useState<Persona[]>([
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '20.123.456',
      domicilio: 'Av. Aconquija 1234',
      telefono: '381-5123456',
      trabaja: 'Empleado',
      vehiculo: 'Toyota Corolla',
      ayudas: 0
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'González',
      documento: '25.987.654',
      domicilio: 'Calle San Martín 567',
      telefono: '381-5234567',
      trabaja: 'Comerciante',
      vehiculo: 'No posee',
      ayudas: 2
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'López',
      documento: '18.456.789',
      domicilio: 'Av. Mate de Luna 890',
      telefono: '381-5345678',
      trabaja: 'Docente',
      vehiculo: 'Honda Civic',
      ayudas: 5
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);

  const getColorByAyudas = (ayudas: number) => {
    if (ayudas === 0) return 'bg-red-100';
    if (ayudas <= 2) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const incrementarAyudas = (id: number) => {
    setPersonas(personas.map(p => 
      p.id === id ? { ...p, ayudas: p.ayudas + 1 } : p
    ));
  };

  const decrementarAyudas = (id: number) => {
    setPersonas(personas.map(p => 
      p.id === id ? { ...p, ayudas: Math.max(0, p.ayudas - 1) } : p
    ));
  };

  const resetearAyudas = (id: number) => {
    setPersonas(personas.map(p => 
      p.id === id ? { ...p, ayudas: 0 } : p
    ));
  };

  const filteredPersonas = personas.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.documento.includes(searchTerm)
  );

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar esta persona?')) {
      setPersonas(personas.filter(p => p.id !== id));
    }
  };

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001447] hover:bg-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Persona
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nueva Persona</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input placeholder="Ingrese nombre" />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input placeholder="Ingrese apellido" />
                  </div>
                  <div>
                    <Label>Documento</Label>
                    <Input placeholder="Ingrese documento" />
                  </div>
                  <div>
                    <Label>Domicilio</Label>
                    <Input placeholder="Ingrese domicilio" />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input placeholder="Ingrese teléfono" />
                  </div>
                  <div>
                    <Label>Trabaja</Label>
                    <Input placeholder="Ocupación" />
                  </div>
                  <div className="col-span-2">
                    <Label>Vehículo</Label>
                    <Input placeholder="Vehículo que posee" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button className="bg-[#001447]">Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#001447] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">Nombre</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Apellido</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Documento</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Domicilio</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Teléfono</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Trabaja</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Vehículo</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Ayudas</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonas.map((persona) => (
                <tr key={persona.id} className={`${getColorByAyudas(persona.ayudas)} hover:opacity-80`}>
                  <td className="border border-gray-300 px-4 py-3">{persona.nombre}</td>
                  <td className="border border-gray-300 px-4 py-3">{persona.apellido}</td>
                  <td className="border border-gray-300 px-4 py-3">{persona.documento}</td>
                  <td className="border border-gray-300 px-4 py-3">{persona.domicilio}</td>
                  <td className="border border-gray-300 px-4 py-3">{persona.telefono}</td>
                  <td className="border border-gray-300 px-4 py-3">{persona.trabaja}</td>
                  <td className="border border-gray-300 px-4 py-3">{persona.vehiculo}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => decrementarAyudas(persona.id)}>-</Button>
                      <span className="min-w-[30px] text-center">{persona.ayudas}</span>
                      <Button size="sm" variant="outline" onClick={() => incrementarAyudas(persona.id)}>+</Button>
                      <Button size="sm" variant="ghost" onClick={() => resetearAyudas(persona.id)}>Reset</Button>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(persona.id)}>
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
  );
}
