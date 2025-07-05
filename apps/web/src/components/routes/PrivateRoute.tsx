import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
} 