import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./modules/auth/components/AuthLayout";
import Login from "./modules/auth/pages/Login";
import Register from "./modules/auth/pages/Register";
import SeleccionarPlantilla from "./modules/auth/pages/SeleccionarPlantilla";
import Tablero from "./modules/tablero/pages/Tablero";
import ModulosCategoria from "./modules/tablero/pages/ModulosCategoria";
import DetalleModulo from "./modules/tablero/pages/DetalleModulo";
import ConfiguracionEstados from "./modules/tablero/pages/ConfiguracionEstados";
import Equipos from "./modules/tablero/pages/Equipos";
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

// El catálogo y las páginas se remontan cuando cambia el ámbito o el tablero
// que se está viendo (key = ambito + owner), para que nunca queden en memoria
// datos del otro tablero al alternar entre el propio y uno compartido.
function TableroProviders({ children }) {
    const { ambito, ownerId } = useAmbito();
    return (
        <BrandingProvider>
            <EstadosPrioridadesProvider key={`${ambito}:${ownerId ?? 'propio'}`}>
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

// Envuelve una página del tablero en ámbito 'personal'. El tablero concreto (el
// propio o uno compartido) lo determina el :ownerId de la URL, que AmbitoScope
// lee. Así "qué tablero veo" vive en la ruta y sobrevive a recargas.
function VistaPersonal({ children }) {
    return (
        <PrivateRoute>
            <AmbitoScope ambito="personal">
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

                        {/* Tableros de equipo: galería de los tableros que me compartieron */}
                        <Route path="/equipos" element={<VistaEmpresa><Equipos /></VistaEmpresa>} />

                        {/* Entrar a un tablero de equipo (owner en la URL) — reusa las mismas páginas en ámbito personal */}
                        <Route path="/equipos/:ownerId" element={<VistaPersonal><Tablero /></VistaPersonal>} />
                        <Route path="/equipos/:ownerId/:categoriaId/modulos" element={<VistaPersonal><ModulosCategoria /></VistaPersonal>} />
                        <Route path="/equipos/:ownerId/:categoriaId/modulos/:moduloId" element={<VistaPersonal><DetalleModulo /></VistaPersonal>} />
                        <Route path="/equipos/:ownerId/configuracion-estados" element={<VistaPersonal><ConfiguracionEstados /></VistaPersonal>} />

                        <Route path="*" element={<Navigate to="/auth/login" replace />} />
                    </Routes>
                </Router>
            </AmbitoProvider>
        </AuthProvider>
    );
}

export default App;
