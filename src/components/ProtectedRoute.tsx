import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "doctor") {
      return <Navigate to="/doctor" replace />;
    }

    return <Navigate to="/services" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;