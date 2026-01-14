import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ViewAttendance from "@/pages/admin/ViewAttendance";
import Attendance from "@/pages/monitor/Attendance";

const HomeRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/ingresar" replace />;
    }

    switch (user.role) {
        case "administrador":
            return <ViewAttendance />;
        case "monitor":
            return <Attendance />;
        default:
            return <Navigate to="/no-autorizado" replace />;
    }
};

export default HomeRedirect;