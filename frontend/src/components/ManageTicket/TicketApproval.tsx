import { useEffect, useState } from "react";
import PendingTicketsTable from "./PendingTicketsTable";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosConfig";
import { Ticket } from "../../types/Ticket";
import ItemsPerPage from "../Common/ItemsPerPage";
import Pagination from "../Pagination";
import { Modal } from "bootstrap";
import TicketDetails from "../../pages/TicketDetails";

const TicketApproval = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

    useEffect(() => {
        fetchPendingTickets();
    }, []);

    const fetchPendingTickets = async () => {
        try {
            const res = await axiosInstance.get("/ticket", {
                params: {
                    status: "PENDING_APPROVAL",
                    page: currentPage,
                    size: pageSize,
                }
            });

            if (res.status === 200) {
                setTickets(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalItems(res.data.totalElements);
            }
        } catch (err) {
            toast.error("Erro ao buscar tickets pendentes.");
        }
    };

    const handleApproval = async (ticketId: number, approved: boolean) => {
        try {
            await axiosInstance.post(`/ticket/${ticketId}/approval?approved=${approved}`);
            toast.success(`Ticket ${approved ? "aprovado" : "rejeitado"} com sucesso.`);
            fetchPendingTickets();
        } catch (err) {
            toast.error("Erro ao processar aprovação.");
        }
    };

    const openTicketDetails = (ticketId: number) => {
        setSelectedTicketId(ticketId);
        const modalElement = document.getElementById("modal");
        if (modalElement) {
            const modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="fw-semibold">Tickets Pendentes de Aprovação <span className="badge bg-secondary">{totalItems}</span></h3>
                <ItemsPerPage onPageSizeChange={handlePageSizeChange} pageSize={pageSize} />
            </div>

            {totalItems <= 0 ? (
                <div className="alert alert-success text-center fs-5 shadow-sm">
                    Tudo certo por aqui!
                </div>
            ) : (
                <PendingTicketsTable
                    tickets={tickets}
                    onApprove={(id) => handleApproval(id, true)}
                    onReject={(id) => handleApproval(id, false)}
                    onView={(id) => openTicketDetails(id)}
                />
            )}

            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <div className="modal fade" id="modal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="title_modal">
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {selectedTicketId && <TicketDetails ticketId={selectedTicketId.toString()} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketApproval;
