import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Plus, Edit, Trash2, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type RolEmpleado = 'administrador' | 'empleado' | 'dirigente';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  direccion: string;
  zona: string;
  personasACargo: number;
  telefono: string;
  vehiculos: string;
  rol: RolEmpleado;
}

const zonasAlderetes = [
  'Centro',
  'Villa Soledad',
  'Villa Mariano Moreno',
  'Alto Verde',
  'Los Pocitos',
  'Los Ralos',
  'San José',
  'Villa Unión',
  'Villa Luján',
  'El Colmenar'
];

export default function EmpleadosScreen() {
  const [empleados, setEmpleados] = useState<Empleado[]>([
    {
      id: 1,
      nombre: 'Pedro',
      apellido: 'Martínez',
      documento: '22.345.678',
      direccion: 'Av. Perón 1500',
      zona: 'Centro',
      personasACargo: 45,
      telefono: '381-5456789',
      vehiculos: 'Camioneta Toyota',
      rol: 'administrador'
    },
    {
      id: 2,
      nombre: 'Laura',
      apellido: 'Fernández',
      documento: '24.567.890',
      direccion: 'Calle Belgrano 890',
      zona: 'Villa Soledad',
      personasACargo: 32,
      telefono: '381-5567890',
      vehiculos: 'Auto Chevrolet',
      rol: 'empleado'
    },
    {
      id: 3,
      nombre: 'Roberto',
      apellido: 'Silva',
      documento: '19.234.567',
      direccion: 'Av. Alem 2340',
      zona: 'Alto Verde',
      personasACargo: 28,
      telefono: '381-5678901',
      vehiculos: 'Moto y Auto',
      rol: 'dirigente'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEmpleados = empleados.filter(e =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.documento.includes(searchTerm) ||
    e.zona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este empleado?')) {
      setEmpleados(empleados.filter(e => e.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#001447]">Gestión de Empleados</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={handlePrint} variant="outline" className="border-[#001447] text-[#001447]">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001447] hover:bg-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Empleado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nuevo Empleado</DialogTitle>
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
                    <Label>Dirección</Label>
                    <Input placeholder="Ingrese dirección" />
                  </div>
                  <div>
                    <Label>Zona</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zonasAlderetes.map(zona => (
                          <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Personas a Cargo</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input placeholder="Ingrese teléfono" />
                  </div>
                  <div>
                    <Label>Vehículos</Label>
                    <Input placeholder="Vehículos que posee" />
                  </div>
                  <div>
                    <Label>Rol</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="empleado">Empleado</SelectItem>
                        <SelectItem value="dirigente">Dirigente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <p className="text-sm text-[#001447] mb-2">Permisos por Rol:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li><strong>Administrador:</strong> Acceso completo al sistema</li>
                    <li><strong>Empleado:</strong> Reuniones, personas, dirigentes, vehículos, asignar ayudas</li>
                    <li><strong>Dirigente:</strong> Solo personas y vehículos</li>
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button className="bg-[#001447]">Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#001447] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">Nombre</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Apellido</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Documento</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Dirección</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Zona</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Personas a Cargo</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Teléfono</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Vehículos</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Rol</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpleados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{empleado.nombre}</td>
                  <td className="border border-gray-300 px-4 py-3">{empleado.apellido}</td>
                  <td className="border border-gray-300 px-4 py-3">{empleado.documento}</td>
                  <td className="border border-gray-300 px-4 py-3">{empleado.direccion}</td>
                  <td className="border border-gray-300 px-4 py-3">{empleado.zona}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{empleado.personasACargo}</td>
                  <td className="border border-gray-300 px-4 py-3">{empleado.telefono}</td>
                  <td className="border border-gray-300 px-4 py-3">{empleado.vehiculos}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                      empleado.rol === 'administrador' ? 'bg-purple-100 text-purple-800' :
                      empleado.rol === 'empleado' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {empleado.rol}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(empleado.id)}>
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
