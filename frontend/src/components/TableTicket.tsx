import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "./AxiosConfig";
import DateFormatter from "./Util/DateFormatter";
import ItemsPerPage from "./ItemsPerPage";
import Pagination from "./Pagination";

import "../assets/styles/components/_form.scss";
import { Department } from "../types/Department";
import { Ticket } from "../types/Ticket";
import { StatusEnum, StatusLabels } from "../enums/StatusEnum";
import { FaSearch } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface TableTicketProps {
    viewMode?: "readonly" | "edit";
}

const TableTicket: React.FC<TableTicketProps> = ({ viewMode = "readonly" }) => {
    const [data, setData] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [status, setStatus] = useState<StatusEnum | null>(StatusEnum.NEW);
    const [noResultsMessage, setNoResultsMessage] = useState<string>("");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [department, setDepartment] = useState<Department>();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const columns: string[] = [
        "ID",
        "Assunto",
        "Categoria",
        "Status",
        "Urgência",
        "Data de Criação",
        "Última Atualização",
    ];

    if (viewMode === "edit") {
        columns.push("Usuário");
    }

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
                    url = `${API_BASE_URL}/ticket/by-department/${department.id}`;
                } else {
                    url = `${API_BASE_URL}/ticket/my-tickets`;
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

            if (res.status === 200 && res.data?.content?.length > 0) {
                setData(res.data.content);
                setTotalPages(res.data.totalPages);
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
        if (viewMode === "edit") {
            fetchUserDepartments();
        }
    }, [viewMode]);

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

    const handleStatusChange = (status: string | null) => {
        if (status === "") {
            setStatus(null);
        } else {
            setStatus(status as StatusEnum);
        }
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
        <div>
            <div className="row align-items-center my-3">
                <div className="col d-flex align-items-end">
                    <ItemsPerPage onPageSizeChange={handlePageSizeChange} pageSize={pageSize} />
                    <div className="ms-3">
                        <label htmlFor="statusSelect" className="label_form">Status</label>
                        <select
                            value={status || ""}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="select_bar_outlined"
                            id="statusSelect"
                        >
                            <option value="">Todos</option>
                            {Object.values(StatusEnum).map((statusKey) => (
                                <option key={statusKey} value={statusKey}>
                                    {StatusLabels[statusKey]}
                                </option>
                            ))}
                        </select>
                    </div>
                    {viewMode === "edit" && departments.length > 1 && (
                        <div className="ms-3">
                            <label htmlFor="departmentSelect" className="label_form">Departamento</label>
                            <select
                                value={department?.id || ""}
                                onChange={handleDepartmentChange}
                                className="select_bar_outlined"
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
                <div className="col-5">
                    <div className="search_wrapper">
                        <input
                            type="text"
                            className="search_bar_outlined"
                            placeholder="Pesquisar"
                            onChange={handleSearch}
                        />
                        <FaSearch className="search_icon_outlined" />
                    </div>
                </div>
            </div>
            <table className="w-100 table table-custom table-hover">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
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
                                <td>
                                    <Link
                                        to={`/ticket/${item.id}`}
                                        className="fw-semibold text-decoration-underline"
                                    >
                                        {item.id}
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        to={`/ticket/${item.id}`}
                                        className="fw-semibold text-decoration-underline"
                                    >
                                        {item.form.title}
                                    </Link>
                                </td>
                                <td>{item.form.ticketCategory.name}</td>
                                <td>{item.properties.status ? StatusLabels[item.properties.status] : "Status desconhecido"}</td>
                                <td>{item.properties.urgency}</td>
                                <td>{DateFormatter(item.properties.createdAt || "")}</td>
                                <td>{DateFormatter(item.properties.updatedAt || "")}</td>
                                {viewMode === "edit" && <td>{item.properties.user?.name || ""}</td>}
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
