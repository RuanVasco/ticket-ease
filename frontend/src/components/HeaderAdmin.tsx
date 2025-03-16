import { useEffect, useState } from "react";
import { FaArrowLeft, FaGear } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/header.css";

import { User } from "../types/User";

import GetUserData from "./GetUserData";
import ThemeSelector from "./ThemeSwitcher";

interface HeaderAdminProps {
    pageName: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ pageName }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = GetUserData();
        setUser(userData);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg header-style">
            <div className="container">
                <div className="row w-100 py-2">
                    <div className="col-3">
                        {location.pathname !== "/admin" && (
                            <button onClick={() => navigate("/admin")} className="btn btn-go-back">
                                <FaArrowLeft /> Voltar
                            </button>
                        )}
                    </div>
                    <div className="col-6 d-flex justify-content-center">
                        <h3 className="fw-bold my-auto page_title">{pageName}</h3>
                    </div>
                    <div className="col-3 text-end">
                        <button
                            className="btn btn-settings"
                            data-bs-toggle="modal"
                            data-bs-target="#configModal"
                        >
                            <FaGear />
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="configModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Configurações</h5>
                            <div className="ms-auto">
                                <ThemeSelector />
                            </div>
                        </div>
                        <div className="modal-body">
                            {user && (
                                <div className="row">
                                    <div className="col">
                                        <span className="fw-semibold">{user.name} </span>
                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm ms-3"
                                            onClick={logout}
                                        >
                                            Sair
                                        </button>
                                        <br />
                                        {user.email} <br />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HeaderAdmin;
