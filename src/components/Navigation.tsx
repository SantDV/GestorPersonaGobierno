import logo from 'figma:asset/280c2bfa74bfb52b021874ba9da1061e03fba562.png';
import { Users, Briefcase, UserCog, Car, Calendar, MapPin, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth();

  // Definir qué módulos puede ver cada rol
  const getAvailableModules = () => {
    if (!user) return [];

    const allModules = [
  { id: 'personas', label: 'Personas', icon: Users, roles: ['administrador', 'empleado', 'dirigente'] },
  { id: 'empleados', label: 'Empleados', icon: Briefcase, roles: ['administrador'] },
  { id: 'dirigentes', label: 'Dirigentes', icon: UserCog, roles: ['administrador', 'empleado'] },
  { id: 'vehiculos', label: 'Vehículos', icon: Car, roles: ['administrador', 'empleado', 'dirigente'] },
  { id: 'calendario', label: 'Calendario', icon: Calendar, roles: ['administrador', 'empleado'] },
  { id: 'zonas', label: 'Zonas', icon: MapPin, roles: ['administrador', 'empleado'] },
];


    return allModules.filter(module => module.roles.includes(user.role));
  };

  const menuItems = getAvailableModules();

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'administrador':
        return 'bg-purple-600';
      case 'empleado':
        return 'bg-blue-600';
      case 'dirigente':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-[#001447] text-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-800">
        <div className="flex items-center gap-4">
          <img src={logo} alt="PartidoOP Logo" className="w-16 h-16 object-contain" />
          <div>
            <h1 className="text-2xl">Sistema de Gestión PartidoOP</h1>
            <p className="text-sm text-blue-200">Bienvenido, {user?.nombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`${getRoleBadgeColor()} px-4 py-2 rounded-full text-sm capitalize`}>
            {user?.role}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      <nav className="flex gap-2 px-6 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                currentScreen === item.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-900 hover:bg-blue-800 text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
