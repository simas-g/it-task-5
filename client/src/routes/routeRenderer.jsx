import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AuthRoute from "./AuthRoute.jsx";
import { Route, Routes } from "react-router-dom";

const routeConfig = [
  { path: "/", element: LoginPage, protected: false },
  { path: "/login", element: LoginPage, protected: false },
  {
    path: "/register",
    element: RegisterPage,
    protected: false,
  },
  {
    path: "/dashboard",
    element: DashboardPage,
    protected: true,
  },
];

const RouteRenderer = ({ config }) => {
  return (
    <Routes>
      {config.map(({ path, element: Element, protected: isProtected }) => {
        const Wrapper = isProtected ? ProtectedRoute : AuthRoute;
        return (
          <Route
            key={path}
            path={path}
            element={
              <Wrapper>
                <Element />
              </Wrapper>
            }
          />
        );
      })}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen bg-gray-200">
            <h1 className="text-4xl text-gray-700">404 - Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};
export { routeConfig, RouteRenderer };
