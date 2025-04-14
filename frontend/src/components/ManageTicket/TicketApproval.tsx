import { useEffect, useState } from "react";
import PendingTicketsTable from "./PendingTicketsTable";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosConfig";
import { Ticket } from "../../types/Ticket";

const TicketApproval = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        fetchPendingTickets();
    }, []);

    const fetchPendingTickets = async () => {
        try {
            const res = await axiosInstance.get("/ticket", {
                params: {
                    status: "PENDING_APPROVAL"
                }
            });

            if (res.status === 200) {
                setTickets(res.data);
            }
        } catch (err) {
            toast.error("Erro ao buscar tickets pendentes.");
        }
    };

    const handleApproval = async (ticketId: number, approve: boolean) => {
        try {
            await axiosInstance.post(`/tickets/${ticketId}/approval`, { approve });
            toast.success(`Ticket ${approve ? "aprovado" : "rejeitado"} com sucesso.`);
            setTickets((prev) => prev.filter((t) => t.id !== ticketId));
        } catch (err) {
            toast.error("Erro ao processar aprovação.");
        }
    };

    const openTicketDetails = (ticketId: number) => {
        console.log("Abrir detalhes do ticket:", ticketId);
    };

    return (
        <div className="p-3">
            <h3>Tickets Pendentes de Aprovação</h3>
            <PendingTicketsTable
                tickets={tickets}
                onApprove={(id) => handleApproval(id, true)}
                onReject={(id) => handleApproval(id, false)}
                onView={(id) => openTicketDetails(id)}
            />
        </div>
    );
};

export default TicketApproval;
