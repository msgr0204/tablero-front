import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh bg-primero flex items-center justify-center">
        <div className="w-[1.5em] h-[1.5em] border-2 border-segundo/30 border-t-segundo rounded-full animate-spin" />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default PrivateRoute;
