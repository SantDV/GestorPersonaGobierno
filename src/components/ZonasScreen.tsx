import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Dirigente {
  nombre: string;
  apellido: string;
  direccion: string;
  zona: string;
  personasACargo: number;
  vehiculosACargo: number;
  telefono: string;
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

const dirigentes: Dirigente[] = [
  {
    nombre: 'Ricardo',
    apellido: 'Gómez',
    direccion: 'Av. Circunvalación 3456',
    zona: 'Centro',
    personasACargo: 120,
    vehiculosACargo: 8,
    telefono: '381-5111111'
  },
  {
    nombre: 'Silvia',
    apellido: 'Ramírez',
    direccion: 'Calle Tucumán 789',
    zona: 'Villa Soledad',
    personasACargo: 85,
    vehiculosACargo: 5,
    telefono: '381-5222222'
  },
  {
    nombre: 'Miguel',
    apellido: 'Torres',
    direccion: 'Av. Independencia 1234',
    zona: 'Alto Verde',
    personasACargo: 95,
    vehiculosACargo: 6,
    telefono: '381-5333333'
  },
  {
    nombre: 'Ana',
    apellido: 'Fernández',
    direccion: 'Calle Belgrano 567',
    zona: 'Villa Mariano Moreno',
    personasACargo: 78,
    vehiculosACargo: 4,
    telefono: '381-5444444'
  },
  {
    nombre: 'Roberto',
    apellido: 'Silva',
    direccion: 'Av. Alem 890',
    zona: 'Los Pocitos',
    personasACargo: 65,
    vehiculosACargo: 3,
    telefono: '381-5555555'
  },
];

export default function ZonasScreen() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>('todas');
  const [vistaActual, setVistaActual] = useState<'mapa' | 'lista'>('mapa');

  const dirigentesFiltrados = zonaSeleccionada === 'todas'
    ? dirigentes
    : dirigentes.filter(d => d.zona === zonaSeleccionada);

  const getZonaColor = (zona: string) => {
    const colors: { [key: string]: string } = {
      'Centro': 'bg-blue-500',
      'Villa Soledad': 'bg-green-500',
      'Villa Mariano Moreno': 'bg-yellow-500',
      'Alto Verde': 'bg-red-500',
      'Los Pocitos': 'bg-purple-500',
      'Los Ralos': 'bg-pink-500',
      'San José': 'bg-indigo-500',
      'Villa Unión': 'bg-orange-500',
      'Villa Luján': 'bg-teal-500',
      'El Colmenar': 'bg-cyan-500'
    };
    return colors[zona] || 'bg-gray-500';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#001447]">Mapa de Zonas - Alderetes</h2>
          <div className="flex gap-3">
            <div className="flex gap-2 bg-gray-100 p-1 rounded">
              <button
                onClick={() => setVistaActual('mapa')}
                className={`px-4 py-2 rounded transition-colors ${
                  vistaActual === 'mapa' ? 'bg-[#001447] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mapa
              </button>
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-4 py-2 rounded transition-colors ${
                  vistaActual === 'lista' ? 'bg-[#001447] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lista
              </button>
            </div>
            <div className="w-64">
              <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las zonas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las zonas</SelectItem>
                  {zonasAlderetes.map(zona => (
                    <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {vistaActual === 'mapa' ? (
          <>
            {/* Mapa visual de Alderetes */}
            <div className="mb-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-4">
                <h3 className="text-xl text-[#001447]">Localidad de Alderetes - División por Zonas</h3>
                <p className="text-sm text-gray-600">Tucumán, Argentina</p>
              </div>

              <div className="grid grid-cols-5 gap-3 max-w-5xl mx-auto">
                {/* Fila 1 */}
                <div className={`${getZonaColor('Villa Unión')} ${zonaSeleccionada === 'Villa Unión' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                     onClick={() => setZonaSeleccionada('Villa Unión')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Villa Unión</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Villa Unión').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('Los Ralos')} ${zonaSeleccionada === 'Los Ralos' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                     onClick={() => setZonaSeleccionada('Los Ralos')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Los Ralos</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Los Ralos').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('Centro')} ${zonaSeleccionada === 'Centro' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer col-span-2`}
                     onClick={() => setZonaSeleccionada('Centro')}>
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <div className="">Centro</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Centro').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('Alto Verde')} ${zonaSeleccionada === 'Alto Verde' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                     onClick={() => setZonaSeleccionada('Alto Verde')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Alto Verde</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Alto Verde').length} dirigente(s)
                  </div>
                </div>

                {/* Fila 2 */}
                <div className={`${getZonaColor('Villa Luján')} ${zonaSeleccionada === 'Villa Luján' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                     onClick={() => setZonaSeleccionada('Villa Luján')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Villa Luján</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Villa Luján').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('San José')} ${zonaSeleccionada === 'San José' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer col-span-2`}
                     onClick={() => setZonaSeleccionada('San José')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">San José</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'San José').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('Villa Soledad')} ${zonaSeleccionada === 'Villa Soledad' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer col-span-2`}
                     onClick={() => setZonaSeleccionada('Villa Soledad')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Villa Soledad</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Villa Soledad').length} dirigente(s)
                  </div>
                </div>

                {/* Fila 3 */}
                <div className={`${getZonaColor('El Colmenar')} ${zonaSeleccionada === 'El Colmenar' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer col-span-2`}
                     onClick={() => setZonaSeleccionada('El Colmenar')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">El Colmenar</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'El Colmenar').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('Los Pocitos')} ${zonaSeleccionada === 'Los Pocitos' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                     onClick={() => setZonaSeleccionada('Los Pocitos')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Los Pocitos</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Los Pocitos').length} dirigente(s)
                  </div>
                </div>
                <div className={`${getZonaColor('Villa Mariano Moreno')} ${zonaSeleccionada === 'Villa Mariano Moreno' || zonaSeleccionada === 'todas' ? 'opacity-100' : 'opacity-30'} rounded-lg p-4 text-white text-center shadow-lg hover:scale-105 transition-transform cursor-pointer col-span-2`}
                     onClick={() => setZonaSeleccionada('Villa Mariano Moreno')}>
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">V. Mariano Moreno</div>
                  <div className="text-xs mt-1 opacity-90">
                    {dirigentes.filter(d => d.zona === 'Villa Mariano Moreno').length} dirigente(s)
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm mb-2 text-[#001447]">Leyenda:</h4>
              <div className="grid grid-cols-5 gap-2">
                {zonasAlderetes.map(zona => (
                  <div key={zona} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${getZonaColor(zona)}`}></div>
                    <span className="text-xs">{zona}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* Lista de dirigentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dirigentesFiltrados.map((dirigente, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-3 ${getZonaColor(dirigente.zona)} rounded-full`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-[#001447]">
                    {dirigente.nombre} {dirigente.apellido}
                  </h3>
                  <p className="text-sm text-gray-600">{dirigente.zona}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dirección:</span>
                  <span className="text-right">{dirigente.direccion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span>{dirigente.telefono}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personas a cargo:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {dirigente.personasACargo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehículos a cargo:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    {dirigente.vehiculosACargo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {dirigentesFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay dirigentes asignados a esta zona
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg text-[#001447] mb-3">Resumen por Zona</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {zonasAlderetes.map(zona => {
              const dirigentesEnZona = dirigentes.filter(d => d.zona === zona);
              const totalPersonas = dirigentesEnZona.reduce((sum, d) => sum + d.personasACargo, 0);
              const totalVehiculos = dirigentesEnZona.reduce((sum, d) => sum + d.vehiculosACargo, 0);
              
              return (
                <div key={zona} className="p-3 bg-white rounded border border-gray-200">
                  <div className="text-sm text-[#001447] mb-1">{zona}</div>
                  <div className="text-xs text-gray-600">
                    {dirigentesEnZona.length} dirigente(s)
                  </div>
                  <div className="text-xs text-gray-600">
                    {totalPersonas} personas
                  </div>
                  <div className="text-xs text-gray-600">
                    {totalVehiculos} vehículos
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
