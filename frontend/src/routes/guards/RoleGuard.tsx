import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
    allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
    const { user, handleUnauthorized } = useAuth();

    useEffect(() => {
        if (user && !allowedRoles.includes(user.role)) {
            handleUnauthorized();
        }
    }, [user, allowedRoles, handleUnauthorized]);

    if (!user) {
        return <Navigate to="/ingresar" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return null; // o un loader
    }

    return <Outlet />;
};

export default RoleGuard;
