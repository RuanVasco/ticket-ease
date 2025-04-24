import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "./AxiosConfig";
import DateFormatter from "./Util/DateFormatter";
import ItemsPerPage from "./Common/ItemsPerPage";
import Pagination from "./Pagination";

import "../assets/styles/components/_form.scss";
import "../assets/styles/components/_table.scss";
import { Department } from "../types/Department";
import { Ticket } from "../types/Ticket";
import { StatusEnum, StatusLabels } from "../enums/StatusEnum";
import { FaSearch } from "react-icons/fa";
import SelectStatus from "./Common/SelectStatus";
import SelectDepartment from "./Fields/SelectDepartment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface TableTicketProps {
    viewMode?: "readonly" | "edit";
}

const TableTicket: React.FC<TableTicketProps> = ({ viewMode = "readonly" }) => {
    const [data, setData] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [status, setStatus] = useState<StatusEnum | null>(null);
    const [noResultsMessage, setNoResultsMessage] = useState<string>("");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [department, setDepartment] = useState<Department>();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<string>("id");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const columnDefs = [
        { label: "ID", field: "id" },
        { label: "Assunto", field: "form.title" },
        { label: "Categoria", field: "form.ticketCategory.name" },
        { label: "Status", field: "status" },
        { label: "Urgência", field: "urgency" },
        { label: "Criação", field: "createdAt" },
        { label: "Última Atualização", field: "updatedAt" },
    ];

    if (viewMode === "edit") {
        columnDefs.push({
            label: "Usuário",
            field: "user.name",
        });
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
            const params: any = {
                page: currentPage,
                size: pageSize,
                status,
            };

            if (searchQuery.length >= 3) {
                url =
                    viewMode === "edit"
                        ? `${API_BASE_URL}/tickets/search/manager`
                        : `${API_BASE_URL}/tickets/search/user`;
            } else {
                if (viewMode === "edit") {

                    if (!department) {
                        url = `${API_BASE_URL}/ticket/managed`;
                    } else {
                        url = `${API_BASE_URL}/ticket/by-department/${department.id}`;
                    }

                } else {
                    url = `${API_BASE_URL}/ticket/my-tickets`;
                }

                params.sort = `${sortField},${sortDir}`;
            }

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
        fetchData();
    }, [currentPage, pageSize, status, department, searchQuery, sortField, sortDir]);

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

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    const renderHeader = (c: { label: string; field: string }) => {
        const active = sortField === c.field;
        const dirIcon = active && sortDir === "asc" ? "▲" : "▼";

        return (
            <th
                key={c.field}
                onClick={() => {
                    if (active) setSortDir(sortDir === "asc" ? "desc" : "asc");
                    else setSortField(c.field);
                    setCurrentPage(0);
                }}
                style={{ cursor: "pointer" }}
            >
                {c.label} {active && dirIcon}
            </th>
        );
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mt-3 mb-4 floating-box">
                <div className="d-flex align-items-center justify-content-start gap-2">
                    <div>
                        <ItemsPerPage onPageSizeChange={handlePageSizeChange} pageSize={pageSize} />
                    </div>
                    <div>
                        <SelectStatus
                            status={status}
                            onStatusChange={handleStatusChange}
                            className="select_bar_outlined"
                        />
                    </div>
                    {viewMode === "edit" && departments.length > 1 && (
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
                    )}
                </div>
                <div>
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
            <div className="table-responsive">
                <table className="custom_table">
                    <thead>
                        <tr>{columnDefs.map(renderHeader)}</tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && noResultsMessage ? (
                            <tr>
                                <th colSpan={columnDefs.length} className="text-center">
                                    {noResultsMessage}
                                </th>
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
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default TableTicket;
