import { createContext, useState, useContext, useEffect } from "react";
import { checkSession, login, logout } from "./auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function initializeSession() {
      setLoading(true);
      const sessionResult = await checkSession();
      if (!sessionResult || !sessionResult.status) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (sessionResult.status === "blocked") {
        await handleLogout();
        setLoading(false);
        return;
      }
      setUser(sessionResult);
      setLoading(false);
    }
    initializeSession();
  }, []);
  const handleLogin = async (userData) => {
    login({ email: userData.email, password: userData.password });
    setUser(userData);
    navigate("/dashboard");
  };
  const handleLogout = async () => {
    logout();
    navigate("/login");
    setUser(null);
  };
  const isAuthenticated = !!user;
  const contextValue = {
    user,
    isAuthenticated,
    handleLogin,
    handleLogout,
    loading,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };
