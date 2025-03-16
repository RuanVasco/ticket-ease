import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";

interface ProtectedLayoutProps {
    requiredPermission?: string;
    isAdmin?: boolean;
}

const ProtectedLayout = ({ requiredPermission, isAdmin }: ProtectedLayoutProps) => {
    const { loading, checkAuth } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { hasPermission } = usePermissions();

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        };
        verifyAuth();
    }, [checkAuth]);

    if (loading || isAuthenticated === null) {
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isAdmin !== undefined && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;
