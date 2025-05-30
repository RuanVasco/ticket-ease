import { createContext, useContext, useEffect, useState, useMemo } from "react";

import axiosInstance from "../components/AxiosConfig";
import { Permission } from "../types/Permission";

import { useAuth } from "./AuthContext";

interface PermissionsContextType {
    permissions: Permission[];
    loading: boolean;
    fetchPermissions: () => void;
    hasPermission: (permission: string) => boolean;
    isAdmin: boolean;
    clearPermissions: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { checkAuth, logout } = useAuth();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);

            if (authStatus) {
                fetchPermissions();
            } else {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [checkAuth]);

    const fetchPermissions = async () => {
        try {
            const cachedPermissions = sessionStorage.getItem("permissions");

            if (cachedPermissions) {
                setPermissions(JSON.parse(cachedPermissions));
                setLoading(false);
                return;
            }

            const res = await axiosInstance.get("/auth/permissions");
            setPermissions(res.data);
            sessionStorage.setItem("permissions", JSON.stringify(res.data));
        } catch (error) {
            logout();
            console.error("Erro ao buscar permissões:", error);
        } finally {
            setLoading(false);
        }
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.some((p) => p.name === permission);
    };

    const isAdmin = useMemo(() => {
        const entities = ["USER", "PROFILE", "DEPARTMENT", "UNIT", "CARGO"];
        const actions = ["CREATE", "EDIT", "DELETE"];

        if (hasPermission("MANAGE_TICKET_CATEGORY") || hasPermission("MANAGE_FORMS")) {
            return true;
        }

        for (const action of actions) {
            for (const entity of entities) {
                if (hasPermission(`${action}_${entity}`)) {
                    return true;
                }
            }
        }

        return false;
    }, [permissions]);

    const clearPermissions = () => {
        setPermissions([]);
        sessionStorage.removeItem("permissions");
    };

    if (isAuthenticated === null) {
        return <div>Carregando permissões...</div>;
    }

    if (!isAuthenticated) {
        return (
            <PermissionsContext.Provider
                value={{
                    permissions: [],
                    loading: false,
                    fetchPermissions,
                    hasPermission: () => false,
                    isAdmin: false,
                    clearPermissions,
                }}
            >
                {children}
            </PermissionsContext.Provider>
        );
    }

    return (
        <PermissionsContext.Provider
            value={{
                permissions,
                loading,
                fetchPermissions,
                hasPermission,
                isAdmin,
                clearPermissions,
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = (): PermissionsContextType => {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error("usePermissions deve ser usado dentro de um PermissionsProvider");
    }
    return context;
};
