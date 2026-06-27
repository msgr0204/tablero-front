import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./modules/auth/components/AuthLayout";
import Login from "./modules/auth/pages/Login";
import Register from "./modules/auth/pages/Register";
import SeleccionarPlantilla from "./modules/auth/pages/SeleccionarPlantilla";
import Tablero from "./modules/tablero/pages/Tablero";
import ModulosCategoria from "./modules/tablero/pages/ModulosCategoria";
import DetalleModulo from "./modules/tablero/pages/DetalleModulo";
import ConfiguracionEstados from "./modules/tablero/pages/ConfiguracionEstados";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Metricas from "./modules/metricas/pages/Metricas";
import GestionUsuarios from "./modules/usuarios/pages/GestionUsuarios";
import Perfil from "./modules/perfil/pages/Perfil";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import { BrandingProvider } from "./context/BrandingContext";
import { EstadosPrioridadesProvider } from "./modules/tablero/contexts/EstadosPrioridadesContext";

function WithTableroProviders({ children }) {
    return (
        <PrivateRoute>
            <BrandingProvider>
                <EstadosPrioridadesProvider>
                    {children}
                </EstadosPrioridadesProvider>
            </BrandingProvider>
        </PrivateRoute>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                    <Route
                        path="/auth/seleccionar-plantilla"
                        element={<PrivateRoute><SeleccionarPlantilla /></PrivateRoute>}
                    />
                    <Route
                        path="/tablero"
                        element={<WithTableroProviders><Tablero /></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/:categoriaId/modulos"
                        element={<WithTableroProviders><ModulosCategoria /></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/:categoriaId/modulos/:moduloId"
                        element={<WithTableroProviders><DetalleModulo /></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/configuracion-estados"
                        element={<WithTableroProviders><ConfiguracionEstados /></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/dashboard"
                        element={<WithTableroProviders><Dashboard /></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/metricas"
                        element={<WithTableroProviders><Metricas /></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/usuarios"
                        element={<WithTableroProviders><AdminRoute><GestionUsuarios /></AdminRoute></WithTableroProviders>}
                    />
                    <Route
                        path="/tablero/perfil"
                        element={<WithTableroProviders><Perfil /></WithTableroProviders>}
                    />
                    <Route path="*" element={<Navigate to="/auth/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
