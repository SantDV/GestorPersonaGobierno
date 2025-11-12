import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  patente: string;
  año: number;
  titularNombre: string;
  titularDocumento: string;
  titularTelefono: string;
  dirigente: string;
}

export default function VehiculosScreen() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([
    {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      patente: 'ABC123',
      año: 2018,
      titularNombre: 'Juan Pérez',
      titularDocumento: '20.123.456',
      titularTelefono: '381-5123456',
      dirigente: 'Ricardo Gómez'
    },
    {
      id: 2,
      marca: 'Chevrolet',
      modelo: 'Cruze',
      patente: 'DEF456',
      año: 2020,
      titularNombre: 'María González',
      titularDocumento: '25.987.654',
      titularTelefono: '381-5234567',
      dirigente: 'Silvia Ramírez'
    },
    {
      id: 3,
      marca: 'Ford',
      modelo: 'Focus',
      patente: 'GHI789',
      año: 2019,
      titularNombre: 'Carlos López',
      titularDocumento: '18.456.789',
      titularTelefono: '381-5345678',
      dirigente: 'Miguel Torres'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredVehiculos = vehiculos.filter(v =>
    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.titularNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.dirigente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      setVehiculos(vehiculos.filter(v => v.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#001447]">Gestión de Vehículos</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar vehículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001447] hover:bg-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Vehículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nuevo Vehículo</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <Label>Marca</Label>
                    <Input placeholder="Ingrese marca" />
                  </div>
                  <div>
                    <Label>Modelo</Label>
                    <Input placeholder="Ingrese modelo" />
                  </div>
                  <div>
                    <Label>Patente</Label>
                    <Input placeholder="Ingrese patente" />
                  </div>
                  <div>
                    <Label>Año</Label>
                    <Input type="number" placeholder="2024" />
                  </div>
                  <div className="col-span-2">
                    <h3 className="mb-2">Datos del Titular</h3>
                  </div>
                  <div>
                    <Label>Nombre del Titular</Label>
                    <Input placeholder="Ingrese nombre" />
                  </div>
                  <div>
                    <Label>Documento del Titular</Label>
                    <Input placeholder="Ingrese documento" />
                  </div>
                  <div>
                    <Label>Teléfono del Titular</Label>
                    <Input placeholder="Ingrese teléfono" />
                  </div>
                  <div>
                    <Label>Dirigente Asignado</Label>
                    <Input placeholder="Nombre del dirigente" />
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
                <th className="border border-gray-300 px-4 py-3 text-left">Marca</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Modelo</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Patente</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Año</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Titular</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Doc. Titular</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Tel. Titular</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Dirigente</th>
                <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehiculos.map((vehiculo) => (
                <tr key={vehiculo.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.marca}</td>
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.modelo}</td>
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.patente}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{vehiculo.año}</td>
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.titularNombre}</td>
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.titularDocumento}</td>
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.titularTelefono}</td>
                  <td className="border border-gray-300 px-4 py-3">{vehiculo.dirigente}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(vehiculo.id)}>
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
