import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
    allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/ingresar" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;