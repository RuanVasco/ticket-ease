import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "./AxiosConfig";
import DateFormatter from "./DateFormatter";
import ItemsPerPage from "./ItemsPerPage";
import Pagination from "./Pagination";
import "../assets/styles/table.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Ticket {
    id: string;
    name: string;
    categoryPath: string;
    status: string;
    urgency: string;
    createdAt: string;
    updatedAt: string;
    user?: { name: string };
}

interface TableTicketProps {
    viewMode?: "readonly" | "edit";
}

const TableTicket: React.FC<TableTicketProps> = ({ viewMode = "readonly" }) => {
    const [data, setData] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [status, setStatus] = useState<string>("Novo");
    const [noResultsMessage, setNoResultsMessage] = useState<string>("");

    const columns: { label: string; value: string }[] = [
        { label: "ID", value: "id" },
        { label: "Assunto", value: "name" },
        { label: "Categoria", value: "categoryPath" },
        { label: "Status", value: "status" },
        { label: "Urgência", value: "urgency" },
        { label: "Data de Criação", value: "createdAt" },
        { label: "Última Atualização", value: "updatedAt" },
    ];

    if (viewMode === "edit") {
        columns.push({ label: "Usuário", value: "user.name" });
    }

    const fetchData = async () => {
        try {
            let url = "";

            switch (viewMode) {
                case "edit":
                    url = `${API_BASE_URL}/tickets/department?page=${currentPage}&size=${pageSize}&status=${status}`;
                    break;
                case "readonly":
                    url = `${API_BASE_URL}/tickets/user?page=${currentPage}&size=${pageSize}&status=${status}`;
                    break;
                default:
                    break;
            }

            const res = await axiosInstance.get(url);

            if (res.status !== 200) {
                console.error("Erro na pesquisa:", res.status);
            }

            if (res.data?._embedded?.ticketDTOList?.length > 0) {
                setData(res.data._embedded.ticketDTOList);
                setTotalPages(res.data.page.totalPages);
                setNoResultsMessage("");
            } else {
                setData([]);
                setNoResultsMessage("Nenhum ticket encontrado.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();

        return () => {};
    }, [currentPage, pageSize, status, viewMode]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;

        if (query.length >= 3) {
            try {
                let url = "";

                switch (viewMode) {
                    case "edit":
                        url = `${API_BASE_URL}/tickets/search/manager?page=${currentPage}&size=${pageSize}&status=${status}`;
                        break;
                    case "readonly":
                        url = `${API_BASE_URL}/tickets/search/user?page=${currentPage}&size=${pageSize}&status=${status}`;
                        break;
                    default:
                        break;
                }

                const res = await axiosInstance.get(url, {
                    params: { query },
                });

                if (res.status !== 200) {
                    console.error("Erro na pesquisa:", res.status);
                    setNoResultsMessage("Erro ao buscar tickets. Tente novamente.");
                }

                if (res.data?._embedded?.ticketDTOList?.length > 0) {
                    setData(res.data._embedded.ticketDTOList);
                    setTotalPages(res.data.page.totalPages);
                    setNoResultsMessage("");
                } else {
                    setData([]);
                    setNoResultsMessage("Nenhum ticket encontrado.");
                }
            } catch (error) {
                console.error("Search Error:", error);
                setNoResultsMessage("Erro ao buscar tickets. Tente novamente.");
            }
        } else {
            fetchData();
            setNoResultsMessage("");
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setCurrentPage(0);
    };

    const getNestedValue = (obj: any, path: string): any => {
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    return (
        <div className="container">
            <div className="row align-items-center my-3">
                <div className="col d-flex align-items-end">
                    <ItemsPerPage onPageSizeChange={handlePageSizeChange} pageSize={pageSize} />
                    <div className="ms-3">
                        <label htmlFor="statusSelect">Status: </label>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="form-select"
                            id="statusSelect"
                        >
                            <option value="Novo">Novos</option>
                            <option value="Em Andamento">Em Andamento</option>
                            <option value="Fechado">Fechados</option>
                            <option value="ALL">Todos</option>
                        </select>
                    </div>
                </div>
                <div className="col-2">
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        className="input-text"
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <table className="w-100 table table-custom table-hover">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && noResultsMessage ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center">
                                {noResultsMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.value === "name" ? (
                                            <Link
                                                to={`/tickets/${item.id}`}
                                                className="fw-semibold text-decoration-underline"
                                            >
                                                {getNestedValue(item, column.value)}
                                            </Link>
                                        ) : column.value.includes("createdAt") ||
                                          column.value.includes("updatedAt") ||
                                          column.value.includes("closedAt") ? (
                                            DateFormatter(
                                                (item[column.value as keyof Ticket] as
                                                    | string
                                                    | Date) ?? ""
                                            )
                                        ) : (
                                            getNestedValue(item, column.value) || "N/A"
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default TableTicket;
