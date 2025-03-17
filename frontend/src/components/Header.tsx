import { useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

import "../assets/styles/header.css";
import { usePermissions } from "../context/PermissionsContext";
import { User } from "../types/User";

import GetUserData from "./GetUserData";
import ThemeSelector from "./ThemeSwitcher";
import { useAuth } from "../context/AuthContext";
import { MdExitToApp } from "react-icons/md";

const Header: React.FC = () => {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [canEditTicket, setCanEditTicket] = useState(false);
    const { hasPermission, isAdmin } = usePermissions();
    const { logout } = useAuth();

    useEffect(() => {
        setCanEditTicket(hasPermission("EDIT_TICKET"));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const userData = GetUserData();
            setUser(userData);
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        document.getElementsByClassName("modal-backdrop")[0].remove();
        logout();
    };

    const getActiveClass = (path: string) =>
        location.pathname === path ? "tab_item_link tab_item_link_active" : "tab_item_link";

    return (
        <nav className="navbar navbar-expand-lg header-style">
            <div className="container">
                <div className="row w-100 py-2">
                    <div className="col-3">
                        <h3 className="fw-bold my-auto">TicketEase</h3>
                    </div>
                    <div className="col-6 d-flex justify-content-center">
                        <Link to="/" className={getActiveClass("/")}>
                            Criar
                        </Link>
                        <Link to="/tickets" className={getActiveClass("/tickets")}>
                            Visualizar
                        </Link>
                        {canEditTicket && (
                            <Link
                                to="/gerenciar-tickets"
                                className={getActiveClass("/gerenciar-tickets")}
                            >
                                Gerenciar
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin" className={getActiveClass("/admin")} target="_blank">
                                Admin <MdExitToApp />
                            </Link>
                        )}
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
            <div className="modal fade" id="configModal" tabIndex={-1}>
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
                                        <span className="fw-semibold">{user.name}</span>
                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm ms-3"
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </button>
                                        <br />
                                        {user.email}
                                        <br />
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

export default Header;
