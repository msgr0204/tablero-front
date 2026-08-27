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
import AmbitoScope from "./components/AmbitoScope";
import { AuthProvider } from "./context/AuthContext";
import { BrandingProvider } from "./context/BrandingContext";
import { AmbitoProvider, useAmbito } from "./context/AmbitoContext";
import { EstadosPrioridadesProvider } from "./modules/tablero/contexts/EstadosPrioridadesContext";

// El catálogo (estados/prioridades/tipos) se remonta cuando cambia el ámbito
// (key={ambito}) para que nunca queden en memoria los del otro tablero.
function TableroProviders({ children }) {
    const { ambito } = useAmbito();
    return (
        <BrandingProvider>
            <EstadosPrioridadesProvider key={ambito}>
                {children}
            </EstadosPrioridadesProvider>
        </BrandingProvider>
    );
}

// Envuelve una página del tablero fijando el ámbito 'empresa'. Es el flujo de
// siempre: al entrar a rutas de empresa, el contexto vuelve a empresa.
function VistaEmpresa({ children }) {
    return (
        <PrivateRoute>
            <AmbitoScope ambito="empresa">
                <TableroProviders>{children}</TableroProviders>
            </AmbitoScope>
        </PrivateRoute>
    );
}

// Envuelve una página del tablero fijando el ámbito 'personal' e inicializando
// el catálogo personal (clonado de la empresa la primera vez).
function VistaPersonal({ children }) {
    return (
        <PrivateRoute>
            <AmbitoScope ambito="personal" inicializar>
                <TableroProviders>{children}</TableroProviders>
            </AmbitoScope>
        </PrivateRoute>
    );
}

function App() {
    return (
        <AuthProvider>
            <AmbitoProvider>
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

                        {/* Tablero de empresa (el de siempre) */}
                        <Route path="/tablero" element={<VistaEmpresa><Tablero /></VistaEmpresa>} />
                        <Route path="/tablero/:categoriaId/modulos" element={<VistaEmpresa><ModulosCategoria /></VistaEmpresa>} />
                        <Route path="/tablero/:categoriaId/modulos/:moduloId" element={<VistaEmpresa><DetalleModulo /></VistaEmpresa>} />
                        <Route path="/tablero/configuracion-estados" element={<VistaEmpresa><ConfiguracionEstados /></VistaEmpresa>} />
                        <Route path="/tablero/dashboard" element={<VistaEmpresa><Dashboard /></VistaEmpresa>} />
                        <Route path="/tablero/metricas" element={<VistaEmpresa><Metricas /></VistaEmpresa>} />
                        <Route path="/tablero/usuarios" element={<VistaEmpresa><AdminRoute><GestionUsuarios /></AdminRoute></VistaEmpresa>} />
                        <Route path="/tablero/perfil" element={<VistaEmpresa><Perfil /></VistaEmpresa>} />

                        {/* Mi tablero (personal) — reusa las mismas páginas en ámbito personal */}
                        <Route path="/tablero-personal" element={<VistaPersonal><Tablero /></VistaPersonal>} />
                        <Route path="/tablero-personal/:categoriaId/modulos" element={<VistaPersonal><ModulosCategoria /></VistaPersonal>} />
                        <Route path="/tablero-personal/:categoriaId/modulos/:moduloId" element={<VistaPersonal><DetalleModulo /></VistaPersonal>} />
                        <Route path="/tablero-personal/configuracion-estados" element={<VistaPersonal><ConfiguracionEstados /></VistaPersonal>} />

                        <Route path="*" element={<Navigate to="/auth/login" replace />} />
                    </Routes>
                </Router>
            </AmbitoProvider>
        </AuthProvider>
    );
}

export default App;
