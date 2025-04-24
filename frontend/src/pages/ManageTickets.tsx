import { FaChartPie, FaList, FaListCheck } from "react-icons/fa6";
import TableTicket from "../components/TableTicket";
import React, { useState } from "react";
import TicketApproval from "../components/ManageTicket/TicketApproval";
import "../assets/styles/pages/_manageticket.scss";

const ManageTickets: React.FC = () => {
    const [viewMode, setViewMode] = useState("list");

    return (
        <main className="row container-fluid">
            <nav className="col-2 sidebar">
                <ul className="p-3 nav flex-column gap-2">
                    <li className="nav-item" onClick={() => setViewMode("list")}>
                        <button
                            className={`nav-link fw-semibold d-flex align-items-center ${viewMode === "list" ? "active" : ""}`}
                            style={{ cursor: "pointer" }}
                        >
                            <FaList className="me-2" /> Listar
                        </button>
                    </li>
                    <li className="nav-item" onClick={() => setViewMode("validate")}>
                        <button
                            className={`nav-link fw-semibold d-flex align-items-center ${viewMode === "validate" ? "active" : ""}`}
                            style={{ cursor: "pointer" }}
                        >
                            <FaListCheck className="me-2" /> Aprovar
                        </button>
                    </li>

                    <li className="nav-item" onClick={() => setViewMode("dashboard")}>
                        <button
                            className={`nav-link fw-semibold d-flex align-items-center ${viewMode === "dashboard" ? "active" : ""}`}
                            style={{ cursor: "pointer" }}
                        >
                            <FaChartPie className="me-2" /> Dashboard
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="col p-3">
                {viewMode === "list" && <TableTicket viewMode="edit" />}
                {viewMode === "validate" && <TicketApproval />}
                {viewMode === "dashboard" && <p>📊 Painel de estatísticas em construção</p>}
            </div>
        </main>
    );
};

export default ManageTickets;
