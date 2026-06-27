import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { usuario } = useAuth();

  if (usuario?.rol !== 'admin') {
    return <Navigate to="/tablero" replace />;
  }

  return children;
}

export default AdminRoute;
