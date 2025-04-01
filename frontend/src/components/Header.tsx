import { useEffect, useRef, useState } from "react";
import { FaBell, FaEye, FaEyeSlash, FaGear, FaPlus } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

import "../assets/styles/header.css";
import logo from "../assets/logo_claro.png";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";
import { useWebSocket } from "../context/WebSocketContext";
import { User } from "../types/User";

import GetUserData from "./GetUserData";
import ThemeSelector from "./ThemeSwitcher";
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

	const Logo = () => <img src={logo} alt="Logo" style={{ height: "35px" }} />;

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

	const getActiveClass = (path: string) =>
		location.pathname === path ? "tab_item_link tab_item_link_active" : "tab_item_link";

	return (
		<nav className="navbar navbar-expand-lg header-style px-4">
			<div className="row w-100 py-2">
				<div className="col-2">
					<Logo />
				</div>
				<div className="col d-flex justify-content-center">
					{canOpenTicket && (
						<Link to="/" className={`d-flex align-items-center ${getActiveClass("/")}`}>
							<FaPlus />
							<span className="ms-2">Abrir Ticket</span>
						</Link>
					)}
					<Link
						to="/tickets"
						className={`d-flex align-items-center ${getActiveClass("/tickets")}`}
					>
						<FaEye />
						<span className="ms-2">Visualizar Tickets</span>
					</Link>
					{canManageTicket && (
						<Link
							to="/gerenciar-tickets"
							className={`d-flex align-items-center ${getActiveClass("/gerenciar-tickets")}`}
						>
							<FaTasks />
							<span className="ms-2">Gerenciar Tickets</span>
						</Link>
					)}
					{isAdmin && (
						<Link
							to="/admin"
							className={`d-flex align-items-center ${getActiveClass("/admin")}`}
							target="_blank"
						>
							<FaSlidersH />
							<span className="ms-2">Administação</span>
						</Link>
					)}
				</div>
				<div className="col-2 d-flex justify-content-end p-0">
					<div className="me-3">
						<button
							className="btn btn-settings"
							data-bs-toggle="modal"
							data-bs-target="#configModal"
						>
							<FaGear />
						</button>
					</div>
					<div className="notification-wrapper">
						<button
							className="btn btn-settings position-relative"
							onClick={() => setDropdownVisible((prev) => !prev)}
							ref={bellButtonRef}
						>
							<FaBell />
							{unreadNotifications > 0 && (
								<span className="notification-badge">{unreadNotifications}</span>
							)}
						</button>
						{dropdownVisible && (
							<div className="notification-dropdown" ref={dropdownRef}>
								<div className="dropdown-header">
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
											<div className="notification-content">
												<Link
													to={`/tickets/${n.typeId}`}
													className="notification-message"
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
