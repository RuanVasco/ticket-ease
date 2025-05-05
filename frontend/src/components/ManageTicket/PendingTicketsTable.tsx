import React from "react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { Ticket } from "../../types/Ticket";
import "../../assets/styles/components/_table.scss";
import "../../assets/styles/components/_buttons.scss";

interface Props {
    tickets: Ticket[];
    onApprove: (ticketId: number) => void;
    onReject: (ticketId: number) => void;
    onView?: (ticketId: number) => void;
}

const PendingTicketsTable: React.FC<Props> = ({ tickets, onApprove, onReject, onView }) => {
    return (
        <div className="table-responsive">
            <table className="custom_table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Solicitante</th>
                        <th>Urgência</th>
                        <th>Departamento</th>
                        <th>Categoria</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                Nenhum ticket pendente
                            </td>
                        </tr>
                    ) : (
                        tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.form.title}</td>
                                <td>{ticket.properties.user?.name}</td>
                                <td>{ticket.properties.urgency}</td>
                                <td>{ticket.form.ticketCategory.department.name}</td>
                                <td>{ticket.form.ticketCategory.name}</td>
                                <td>
                                    {ticket.properties.createdAt
                                        ? new Date(ticket.properties.createdAt).toLocaleDateString()
                                        : "—"}
                                </td>
                                <td className="text-center d-flex gap-2">
                                    {onView && (
                                        <button
                                            className="btn_info"
                                            onClick={() => onView(ticket.id)}
                                        >
                                            <FaEye />
                                        </button>
                                    )}
                                    <button
                                        className="btn_success"
                                        onClick={() => onApprove(ticket.id)}
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        className="btn_error"
                                        onClick={() => onReject(ticket.id)}
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PendingTicketsTable;
