import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Plus, Edit, Trash2, Eye, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Dirigente {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  direccion: string;
  zona: string;
  vehiculosACargo: number;
  personasACargo: number;
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

export default function DirigentesScreen() {
  const [dirigentes, setDirigentes] = useState<Dirigente[]>([
    {
      id: 1,
      nombre: 'Ricardo',
      apellido: 'Gómez',
      documento: '16.789.012',
      direccion: 'Av. Circunvalación 3456',
      zona: 'Centro',
      vehiculosACargo: 8,
      personasACargo: 120
    },
    {
      id: 2,
      nombre: 'Silvia',
      apellido: 'Ramírez',
      documento: '17.234.567',
      direccion: 'Calle Tucumán 789',
      zona: 'Villa Soledad',
      vehiculosACargo: 5,
      personasACargo: 85
    },
    {
      id: 3,
      nombre: 'Miguel',
      apellido: 'Torres',
      documento: '15.456.789',
      direccion: 'Av. Independencia 1234',
      zona: 'Alto Verde',
      vehiculosACargo: 6,
      personasACargo: 95
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDirigente, setSelectedDirigente] = useState<Dirigente | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredDirigentes = dirigentes.filter(d =>
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.documento.includes(searchTerm) ||
    d.zona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este dirigente?')) {
      setDirigentes(dirigentes.filter(d => d.id !== id));
    }
  };

  const handleViewDetails = (dirigente: Dirigente) => {
    setSelectedDirigente(dirigente);
    setShowDetailsDialog(true);
  };

  const handlePrintDetails = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#001447]">Gestión de Dirigentes</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar dirigente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001447] hover:bg-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Dirigente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nuevo Dirigente</DialogTitle>
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
                    <Label>Vehículos a Cargo</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Personas a Cargo</Label>
                    <Input type="number" placeholder="0" />
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#001447] text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">Nombre</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Apellido</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Documento</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Dirección</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Zona</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Vehículos</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Personas</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDirigentes.map((dirigente) => (
                <tr key={dirigente.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{dirigente.nombre}</td>
                  <td className="border border-gray-300 px-4 py-3">{dirigente.apellido}</td>
                  <td className="border border-gray-300 px-4 py-3">{dirigente.documento}</td>
                  <td className="border border-gray-300 px-4 py-3">{dirigente.direccion}</td>
                  <td className="border border-gray-300 px-4 py-3">{dirigente.zona}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{dirigente.vehiculosACargo}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{dirigente.personasACargo}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-800" onClick={() => handleViewDetails(dirigente)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(dirigente.id)}>
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

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Detalles del Dirigente: {selectedDirigente?.nombre} {selectedDirigente?.apellido}</span>
              <Button onClick={handlePrintDetails} size="sm" variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Zona</Label>
                <p className="mt-1">{selectedDirigente?.zona}</p>
              </div>
              <div>
                <Label>Dirección</Label>
                <p className="mt-1">{selectedDirigente?.direccion}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-3">Personas a Cargo ({selectedDirigente?.personasACargo})</h3>
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Lista de personas asignadas a este dirigente...</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-3">Vehículos a Cargo ({selectedDirigente?.vehiculosACargo})</h3>
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Lista de vehículos asignados a este dirigente...</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
