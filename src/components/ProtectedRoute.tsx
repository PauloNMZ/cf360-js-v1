
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  return user ? <Outlet /> : <Navigate to="/auth" />;
};
