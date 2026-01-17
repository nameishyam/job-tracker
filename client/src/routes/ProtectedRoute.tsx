import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SpinnerCustom } from "@/components/ui/spinner";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
