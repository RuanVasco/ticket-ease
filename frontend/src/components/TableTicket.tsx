import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "./AxiosConfig";
import DateFormatter from "./Util/DateFormatter";
import ItemsPerPage from "./ItemsPerPage";
import Pagination from "./Pagination";

import "../assets/styles/table.css";
import { Department } from "../types/Department";

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
    const [departments, setDepartments] = useState<Department[]>([]);
    const [department, setDepartment] = useState<Department>();
    const [searchQuery, setSearchQuery] = useState<string>("");

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

    const getNestedValue = (obj: any, path: string): any => {
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    const fetchUserDepartments = async () => {
        try {
            const res = await axiosInstance.get(`${API_BASE_URL}/departments/manager`);
            if (res.status === 200 && res.data) {
                setDepartments(res.data);
            }
        } catch (error) {
            console.error("Erro ao buscar departamentos:", error);
        }
    };

    const fetchData = async () => {
        try {
            let url = "";

            if (searchQuery.length >= 3) {
                url =
                    viewMode === "edit"
                        ? `${API_BASE_URL}/tickets/search/manager`
                        : `${API_BASE_URL}/tickets/search/user`;
            } else {
                if (viewMode === "edit") {
                    if (!department) return;
                    url = `${API_BASE_URL}/tickets/department/${department.id}`;
                } else {
                    url = `${API_BASE_URL}/tickets/user`;
                }
            }

            const params: any = {
                page: currentPage,
                size: pageSize,
                status,
            };

            if (searchQuery.length >= 3) {
                params.query = searchQuery;
            }

            const res = await axiosInstance.get(url, { params });

            if (res.status === 200 && res.data?._embedded?.ticketDTOList?.length > 0) {
                setData(res.data._embedded.ticketDTOList);
                setTotalPages(res.data.page.totalPages);
                setNoResultsMessage("");
            } else {
                setData([]);
                setTotalPages(1);
                setNoResultsMessage("Nenhum ticket encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setData([]);
            setNoResultsMessage("Erro ao buscar tickets.");
        }
    };

    useEffect(() => {
        fetchUserDepartments();
    }, []);

    useEffect(() => {
        if (departments.length > 0 && !department) {
            setDepartment(departments[0]);
        }
    }, [departments]);

    useEffect(() => {
        if (viewMode === "edit" && !department) return;
        fetchData();
    }, [currentPage, pageSize, status, department, searchQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setCurrentPage(0);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setCurrentPage(0);
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = departments.find((dep) => Number(dep.id) === Number(e.target.value));
        setDepartment(selected);
        setCurrentPage(0);
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
                    {viewMode === "edit" && departments.length > 1 && (
                        <div className="ms-3">
                            <label htmlFor="departmentSelect">Departamento: </label>
                            <select
                                value={department?.id || ""}
                                onChange={handleDepartmentChange}
                                className="form-select"
                                id="departmentSelect"
                            >
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.id ?? ""}>
                                        {dep.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
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
                                {columns.map((column, colIndex) => {
                                    const value = getNestedValue(item, column.value);
                                    const isDate =
                                        column.value === "createdAt" ||
                                        column.value === "updatedAt" ||
                                        column.value === "closedAt";

                                    return (
                                        <td key={colIndex}>
                                            {column.value === "name" ? (
                                                <Link
                                                    to={`/tickets/${item.id}`}
                                                    className="fw-semibold text-decoration-underline"
                                                >
                                                    {value}
                                                </Link>
                                            ) : isDate ? (
                                                DateFormatter(value || "")
                                            ) : (
                                                value || "N/A"
                                            )}
                                        </td>
                                    );
                                })}
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
