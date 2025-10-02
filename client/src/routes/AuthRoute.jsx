import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export default function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } else if (!loading) return children;
}
