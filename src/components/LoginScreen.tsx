import { useState } from 'react';
import logo from 'figma:asset/280c2bfa74bfb52b021874ba9da1061e03fba562.png';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import { Alert, AlertDescription } from './ui/alert';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  if (!usuario || !clave) {
    setError('Por favor ingrese usuario y contraseña')
    return
  }

  // Acá esperamos el login contra Supabase
  const success = await login(usuario, clave)

  if (!success) {
    setError('Usuario o contraseña incorrectos')
  }
};


  return (
    <div className="min-h-screen bg-[#001447] flex items-center justify-center p-8">
      <div className="bg-white rounded-lg p-12 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="PartidoOP Logo" className="w-48 h-48 object-contain mb-6" />
          <h1 className="text-[#001447] text-3xl">Iniciar Sesión</h1>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="usuario" className="text-[#001447]">Usuario</Label>
            <Input
              id="usuario"
              type="text"
              placeholder="Ingrese su usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="mt-2 border-2 border-gray-300 focus:border-[#001447]"
            />
          </div>
          
          <div>
            <Label htmlFor="clave" className="text-[#001447]">Contraseña</Label>
            <Input
              id="clave"
              type="password"
              placeholder="Ingrese su contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="mt-2 border-2 border-gray-300 focus:border-[#001447]"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#001447] hover:bg-blue-900 text-white py-3"
          >
            Ingresar
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded text-sm">
          <p className="text-[#001447] mb-2">Usuarios de prueba:</p>
          <p className="text-gray-600">Administrador: admin / admin123</p>
          <p className="text-gray-600">Empleado: empleado / emp123</p>
          <p className="text-gray-600">Dirigente: dirigente / dir123</p>
        </div>
      </div>
    </div>
  );
}
