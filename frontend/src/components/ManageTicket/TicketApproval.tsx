import { useEffect, useState } from "react";
import PendingTicketsTable from "./PendingTicketsTable";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosConfig";
import { Ticket } from "../../types/Ticket";
import ItemsPerPage from "../Common/ItemsPerPage";
import Pagination from "../Pagination";
import { Modal } from "bootstrap";
import SelectDepartment from "../Fields/SelectDepartment";
import { Department } from "../../types/Department";
import "../../assets/styles/components/_ticketapproval.scss";
import { FaCheck } from "react-icons/fa6";
import { closeModal } from "../../components/Util/CloseModal";
import TicketDetail from "../TicketDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const TicketApproval = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [selectedTicketId, setSelectedTicketId] = useState<Number | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [department, setDepartment] = useState<Department>();

    useEffect(() => {
        fetchPendingTickets();
        fetchUserDepartments();
    }, []);

    const fetchUserDepartments = async () => {
        try {
            const res = await axiosInstance.get(`${API_BASE_URL}/departments/approver`);
            if (res.status === 200 && res.data) {
                setDepartments(res.data);
            }
        } catch (error) {
            console.error("Erro ao buscar departamentos:", error);
        }
    };

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

    const clearSelectedTicket = () => {
        closeModal("modal");
        setSelectedTicketId(null);
    };

    return (
        <div className="container-fluid">
            {totalItems <= 0 ? (
                <div className="floating-box pending-tickets-title fw-bold d-flex align-items-center justify-content-center mt-3">
                    Sem tickets pendentes
                    <FaCheck />
                </div>
            ) : (
                <>
                    <div className="d-flex align-items-center justify-content-between mt-3 mb-4 floating-box">
                        <div className="d-flex align-items-center">
                            <span className="pending-tickets-title fw-bold">
                                Tickets Pendentes
                                <span className="pending-tickets-amount">{totalItems}</span>
                            </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-start gap-2">
                            <div>
                                <ItemsPerPage onPageSizeChange={handlePageSizeChange} pageSize={pageSize} />
                            </div>
                            <div>
                                <SelectDepartment
                                    value={department?.id || ""}
                                    onChange={(id) => {
                                        const selected = departments.find((dep) => String(dep.id) === id);
                                        setDepartment(selected);
                                        setCurrentPage(0);
                                    }}
                                    scope="user"
                                />
                            </div>
                        </div>

                    </div>

                    <PendingTicketsTable
                        tickets={tickets}
                        onApprove={(id) => handleApproval(id, true)}
                        onReject={(id) => handleApproval(id, false)}
                        onView={(id) => openTicketDetails(id)}
                    />

                    <div className="d-flex justify-content-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}

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
                            {selectedTicketId && (
                                <TicketDetail
                                    selectedTicketId={selectedTicketId}
                                    setSelectedTicket={clearSelectedTicket}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketApproval;
