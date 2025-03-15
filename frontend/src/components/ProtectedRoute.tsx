import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { loading, checkAuth } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        };
        verifyAuth();
    }, [checkAuth]);

    if (loading || isAuthenticated === null) return <div>Carregando...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

export default ProtectedRoute;
