import React from "react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { Ticket } from "../../types/Ticket";

interface Props {
    tickets: Ticket[];
    onApprove: (ticketId: number) => void;
    onReject: (ticketId: number) => void;
    onView?: (ticketId: number) => void;
}

const PendingTicketsTable: React.FC<Props> = ({ tickets, onApprove, onReject, onView }) => {
    return (
        <div className="table-responsive">
            <table className="table table-custom">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Solicitante</th>
                        <th>Data</th>
                        <th>Status</th>
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
                                <td>
                                    {ticket.properties.createdAt
                                        ? new Date(ticket.properties.createdAt).toLocaleDateString()
                                        : "—"}
                                </td>
                                <td>
                                    <span className="badge bg-warning text-dark">Pendente</span>
                                </td>
                                <td className="text-center d-flex gap-2">
                                    {onView && (
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => onView(ticket.id)}
                                        >
                                            <FaEye />
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => onApprove(ticket.id)}
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
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
