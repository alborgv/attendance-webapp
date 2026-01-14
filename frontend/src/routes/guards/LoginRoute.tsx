import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

const LoginRoute: React.FC<ChildrenProps> = ({ children }) => {
    const { user } = useAuth();
    return user ? <Navigate to="/"/> :children;
}

export default LoginRoute;