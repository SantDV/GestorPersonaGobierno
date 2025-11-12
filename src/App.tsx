import { useState } from "react";
import {
  AuthProvider,
  useAuth,
} from "./components/AuthContext";
import LoginScreen from "./components/LoginScreen";
import Navigation from "./components/Navigation";
import PersonasScreen from "./components/PersonasScreen";
import EmpleadosScreen from "./components/EmpleadosScreen";
import DirigentesScreen from "./components/DirigentesScreen";
import VehiculosScreen from "./components/VehiculosScreen";
import CalendarioScreen from "./components/CalendarioScreen";
import ZonasScreen from "./components/ZonasScreen";

function AppContent() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] =
    useState("personas");

  if (!user) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "personas":
        return <PersonasScreen />;
      case "empleados":
        return <EmpleadosScreen />;
      case "dirigentes":
        return <DirigentesScreen />;
      case "vehiculos":
        return <VehiculosScreen />;
      case "calendario":
        return <CalendarioScreen />;
      case "zonas":
        return <ZonasScreen />;
      default:
        return <PersonasScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
      {renderScreen()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}