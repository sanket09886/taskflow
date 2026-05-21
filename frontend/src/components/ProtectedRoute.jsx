import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "./ui";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();
  if (loading) return <Spinner label="Checking session" />;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
