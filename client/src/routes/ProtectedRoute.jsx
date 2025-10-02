import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else if (!loading) return children;
}
