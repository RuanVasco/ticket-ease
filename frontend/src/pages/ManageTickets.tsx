import { FaChartPie, FaList, FaListCheck } from "react-icons/fa6";
import TableTicket from "../components/TableTicket";
import React, { useState } from "react";
import TicketApproval from "../components/ManageTicket/TicketApproval";

const ManageTickets: React.FC = () => {
    const [viewMode, setViewMode] = useState("list");

    return (
        <main className="row" style={{ minHeight: "100vh" }}>
            <nav className="col-2 header-style border-top">
                <ul className="p-3 nav flex-column">
                    <li className="nav-item" onClick={() => setViewMode("list")}>
                        <span
                            className={`nav-link text-white fw-semibold d-flex align-items-center ${viewMode === "list" ? "active bg-white bg-opacity-25 rounded" : ""}`}
                            style={{ cursor: "pointer" }}
                        >
                            <FaList className="me-2" /> Listar
                        </span>
                    </li>
                    <li className="nav-item" onClick={() => setViewMode("validate")}>
                        <span
                            className={`nav-link text-white fw-semibold d-flex align-items-center ${viewMode === "validate" ? "active bg-white bg-opacity-25 rounded" : ""}`}
                            style={{ cursor: "pointer" }}
                        >
                            <FaListCheck className="me-2" /> Aprovar
                        </span>
                    </li>

                    <li className="nav-item" onClick={() => setViewMode("dashboard")}>
                        <span
                            className={`nav-link text-white fw-semibold d-flex align-items-center ${viewMode === "dashboard" ? "active bg-white bg-opacity-25 rounded" : ""}`}
                            style={{ cursor: "pointer" }}
                        >
                            <FaChartPie className="me-2" /> Dashboard
                        </span>
                    </li>
                </ul>
            </nav>

            <div className="col">
                {viewMode === "list" && <TableTicket viewMode="edit" />}
                {viewMode === "validate" && <TicketApproval />}
                {viewMode === "dashboard" && <p>📊 Painel de estatísticas em construção</p>}
            </div>
        </main>
    );
};

export default ManageTickets;
