import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';

interface Reunion {
  id: number;
  fecha: Date;
  hora: string;
  persona: string;
  motivo: string;
  estado: 'pendiente' | 'realizada' | 'cancelada';
}

export default function CalendarioScreen() {
  const [reuniones, setReuniones] = useState<Reunion[]>([
    {
      id: 1,
      fecha: new Date(2025, 10, 5),
      hora: '10:00',
      persona: 'Juan Pérez',
      motivo: 'Consulta sobre trámites de documentación',
      estado: 'pendiente'
    },
    {
      id: 2,
      fecha: new Date(2025, 10, 5),
      hora: '15:30',
      persona: 'María González',
      motivo: 'Solicitud de ayuda para empleo',
      estado: 'pendiente'
    },
    {
      id: 3,
      fecha: new Date(2025, 10, 8),
      hora: '11:00',
      persona: 'Carlos López',
      motivo: 'Seguimiento de caso anterior',
      estado: 'realizada'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredReuniones = reuniones.filter(r =>
    r.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reunionesPorFecha = selectedDate
    ? reuniones.filter(r => r.fecha.toDateString() === selectedDate.toDateString())
    : [];

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar esta reunión?')) {
      setReuniones(reuniones.filter(r => r.id !== id));
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'realizada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-[#001447] mb-4">Calendario</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          
          <div className="mt-6">
            <h3 className="mb-3">Reuniones del día</h3>
            {reunionesPorFecha.length > 0 ? (
              <div className="space-y-2">
                {reunionesPorFecha.map(r => (
                  <div key={r.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="text-sm">
                      <span className="text-[#001447]">{r.hora}</span> - {r.persona}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{r.motivo}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay reuniones programadas</p>
            )}
          </div>
        </div>

        {/* Lista de reuniones */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl text-[#001447]">Gestión de Reuniones</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar reunión..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#001447] hover:bg-blue-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Reunión
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nueva Reunión</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <Label>Fecha</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Hora</Label>
                      <Input type="time" />
                    </div>
                    <div className="col-span-2">
                      <Label>Persona</Label>
                      <Input placeholder="Nombre de la persona" />
                    </div>
                    <div className="col-span-2">
                      <Label>Motivo de la Reunión</Label>
                      <Textarea placeholder="Describa el motivo de la reunión..." rows={4} />
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
                  <th className="border border-gray-300 px-4 py-3 text-left">Fecha</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Hora</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Persona</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Motivo</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Estado</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReuniones.map((reunion) => (
                  <tr key={reunion.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {reunion.fecha.toLocaleDateString('es-AR')}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{reunion.hora}</td>
                    <td className="border border-gray-300 px-4 py-3">{reunion.persona}</td>
                    <td className="border border-gray-300 px-4 py-3">{reunion.motivo}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${getEstadoColor(reunion.estado)}`}>
                        {reunion.estado}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(reunion.id)}>
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
    </div>
  );
}
