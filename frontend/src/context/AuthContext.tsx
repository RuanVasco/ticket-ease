import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface AuthContextType {
    checkAuth: () => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async (): Promise<boolean> => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token) {
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });
                    localStorage.setItem("token", response.data.token);
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return false;
        } else {
            try {
                await axios.post(`${API_BASE_URL}/auth/validate`, { token });
                return true;
            } catch (error) {
                return false;
            }
        }
    };

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                logout();
            }
            setLoading(false);
        };

        authenticate();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ checkAuth, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    return context;
};
