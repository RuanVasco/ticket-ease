import { useEffect, useRef, useState } from "react";
import { FaBell, FaEye, FaEyeSlash, FaPlus, FaUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

import logo from "../assets/logo_claro.png";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";
import { useWebSocket } from "../context/WebSocketContext";
import { User } from "../types/User";

import GetUserData from "./GetUserData";
import { FaSlidersH, FaTasks } from "react-icons/fa";

const Header: React.FC = () => {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [canManageTicket, setCanManageTicket] = useState(false);
    const [canOpenTicket, setCanOpenTicket] = useState(false);
    const { hasPermission, isAdmin, permissions } = usePermissions();
    const { logout } = useAuth();
    const { notifications, unreadNotifications, markAsRead, markAllAsRead } = useWebSocket();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const bellButtonRef = useRef<HTMLButtonElement | null>(null);

    const Logo = () => <img src={logo} className="header_brand" alt="Logo" draggable={false} />;

    useEffect(() => {
        setCanManageTicket(hasPermission("MANAGE_TICKET"));
        setCanOpenTicket(hasPermission("CREATE_TICKET"));
    }, [permissions, hasPermission]);

    useEffect(() => {
        const fetchData = async () => {
            const userData = GetUserData();
            setUser(userData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                bellButtonRef.current &&
                !bellButtonRef.current.contains(target)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        document.getElementsByClassName("modal-backdrop")[0]?.remove();
        logout();
    };

    const getActiveClass = (path: string) => {
        if (path === "/") {
            return location.pathname === "/"
                ? "header_link header_link_active"
                : "header_link";
        } else {
            return location.pathname.startsWith(path)
                ? "header_link header_link_active"
                : "header_link";
        }
    };

    return (
        <nav className="navbar navbar-expand-lg header px-4">
            <div className="row w-100 py-2">
                <div className="col-2">
                    <Logo />
                </div>
                <div className="col menu-scroll d-flex justify-content-center gap-3 align-items-center">

                    {canOpenTicket && (
                        <Link to="/" className={`d-flex align-items-center ${getActiveClass("/")}`} draggable={false}>
                            <FaPlus />
                            <span className="ms-2">Abrir Ticket</span>
                        </Link>
                    )}
                    <Link
                        to="/tickets"
                        className={`d-flex align-items-center ${getActiveClass("/tickets")}`}
                        draggable={false}
                    >
                        <FaEye />
                        <span className="ms-2">Visualizar Tickets</span>
                    </Link>
                    {canManageTicket && (
                        <Link
                            to="/gerenciar-tickets"
                            className={`d-flex align-items-center ${getActiveClass("/gerenciar-tickets")}`}
                            draggable={false}
                        >
                            <FaTasks />
                            <span className="ms-2">Gerenciar Tickets</span>
                        </Link>
                    )}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={`d-flex align-items-center ${getActiveClass("/admin")}`}
                            draggable={false}
                        >
                            <FaSlidersH />
                            <span className="ms-2">Administação</span>
                        </Link>
                    )}
                </div>
                <div className="col-2 d-flex justify-content-end align-items-center gap-2">
                    <div>
                        <button
                            className="header_action_btn"
                            data-bs-toggle="modal"
                            data-bs-target="#configModal"
                        >
                            <FaUser />
                        </button>
                    </div>
                    <hr className="header_divider" />
                    <div className="notification_wrapper">
                        <button
                            className="header_action_btn position-relative"
                            onClick={() => setDropdownVisible((prev) => !prev)}
                            ref={bellButtonRef}
                        >
                            <FaBell />
                            {unreadNotifications > 0 && (
                                <span className="notification_badge">{unreadNotifications}</span>
                            )}
                        </button>
                        {dropdownVisible && (
                            <div className="notification_dropdown" ref={dropdownRef}>
                                <div className="dropdown_header">
                                    <span>
                                        <FaBell /> {unreadNotifications} novas notificações
                                    </span>
                                    <span
                                        onClick={markAllAsRead}
                                        className="mark-as-readed-btn mt-1"
                                    >
                                        <FaEye /> Marcar tudo como lido
                                    </span>
                                </div>
                                <ul>
                                    {notifications.map((n, i) => (
                                        <li key={i} className={`${!n.read ? "unread" : ""}`}>
                                            <div className="notification_content">
                                                <Link
                                                    to={`/ticket/${n.typeId}`}
                                                    className="notification_message"
                                                    onClick={() => markAsRead(Number(n.id))}
                                                >
                                                    {n.message}
                                                </Link>
                                                <span>
                                                    {new Date(n.createdAt).toLocaleString("pt-BR", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <span
                                                className="mark-as-readed-btn"
                                                onClick={() => markAsRead(Number(n.id))}
                                            >
                                                {!n.read ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="modal fade" id="configModal" tabIndex={-1} aria-labelledby="configModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="configModalLabel">Preferências</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>

                        <div className="modal-body">
                            {user && (
                                <div className="d-flex align-items-center justify-content-between gap-3">
                                    <div className="mb-2 d-flex flex-column">
                                        <span className="fw-semibold">{user.name}</span>
                                        <span className="d-block">{user.email}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn_yellow"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
