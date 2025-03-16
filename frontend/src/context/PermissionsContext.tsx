import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../components/AxiosConfig";
import { Permission } from "../types/Permission";

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
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPermissions();
    }, []);

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
            console.error("Erro ao buscar permissões:", error);
        } finally {
            setLoading(false);
        }
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.some((p) => p.name === permission);
    };

    const isAdmin = useMemo(() => {
        const entities = ["USER", "PROFILE", "DEPARTMENT", "UNIT", "CARGO", "TICKET_CATEGORY"];
        const actions = ["CREATE", "EDIT", "DELETE"];

        return entities.some((entity) =>
            actions.some((action) => hasPermission(`${action}_${entity}`))
        );
    }, [permissions]);

    const clearPermissions = () => {
        setPermissions([]);
        sessionStorage.removeItem("permissions");
    };

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
