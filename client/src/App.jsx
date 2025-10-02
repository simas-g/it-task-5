import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeConfig, RouteRenderer } from "./routes/routeRenderer.jsx";
import Nav from "./components/Nav.jsx";
const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Nav></Nav>
          <RouteRenderer config={routeConfig} />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
