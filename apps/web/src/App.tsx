import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { PrivateRoute } from "@/components/routes/PrivateRoute";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeesPage from "@/pages/EmployeesPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <>
                    <Header />
                    <DashboardPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <>
                    <Header />
                    <EmployeesPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}
