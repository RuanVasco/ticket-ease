import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from "../../components/AxiosConfig";
import Table from "../../components/Table";
import ActionBar from "../../components/ActionBar";
import Pagination from "../../components/Pagination";

import { Department } from "../../types/Department";
import { Unit } from "../../types/Unit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [
    { value: "name", label: "Nome" },
    { value: "unit.name", label: "Unidade" },
    { value: "receivesRequests", label: "Recebe Chamados" },
];

const DepartmentManagement: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [modeModal, setModeModal] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [data, setData] = useState<Department[]>([]);
    const [submitType, setSubmitType] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [units, setUnits] = useState<Unit[]>([]);
    const [currentDepartment, setCurrentDepartment] = useState<Department>({
        id: "",
        name: "",
        unit: { id: "", name: "", address: "" },
        receivesRequests: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(
                    `${API_BASE_URL}/departments/pageable?page=${currentPage}&size=${pageSize}`
                );
                if (res.status === 200) {
                    const departments = res.data.content.map((dept: Department) => ({
                        ...dept,
                        receivesRequests: dept.receivesRequests ? "Sim" : "Não",
                    }));
                    setData(departments);
                    setTotalPages(res.data.totalPages);
                } else {
                    console.error("Error fetching departments:", res.status);
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        const fetchUnits = async () => {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/units/`);
                if (res.status === 200) {
                    setUnits(res.data);
                } else {
                    console.error("Error fetching units:", res.status);
                }
            } catch (error) {
                console.error("Error fetching units:", error);
            }
        };

        fetchData();
        fetchUnits();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action: string, mode: string, idUnit?: string) => {
        setModalTitle(`${action} Departamento`);
        setModeModal(mode);

        if (mode !== "add") {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/departments/${idUnit}`);
                if (res.status === 200) {
                    setCurrentDepartment({
                        id: res.data.id,
                        name: res.data.name,
                        unit: {
                            id: res.data.unit.id,
                            name: res.data.unit.name,
                            address: res.data.unit.address,
                        },
                        receivesRequests: res.data.receivesRequests,
                    });
                } else {
                    console.error("Error fetching department:", res.status);
                }
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        } else {
            setCurrentDepartment({
                id: "",
                name: "",
                unit: { id: "", name: "", address: "" },
                receivesRequests: false,
            });
        }
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "unit") {
            setCurrentDepartment({
                ...currentDepartment,
                unit: { ...currentDepartment.unit, id: value },
            });
        } else if (name === "receivesRequests") {
            setCurrentDepartment({
                ...currentDepartment,
                receivesRequests: value === "true",
            });
        } else {
            setCurrentDepartment({
                ...currentDepartment,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let res;

            if (submitType === "delete") {
                res = await axiosInstance.delete(
                    `${API_BASE_URL}/departments/${currentDepartment.id}`
                );
            } else if (submitType === "add") {
                res = await axiosInstance.post(`${API_BASE_URL}/departments/`, currentDepartment);
            } else if (submitType === "update") {
                res = await axiosInstance.put(
                    `${API_BASE_URL}/departments/${currentDepartment.id}`,
                    currentDepartment
                );
            } else {
                console.error("Invalid submit type");
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentDepartment({
                    id: "",
                    name: "",
                    unit: { id: "", name: "", address: "" },
                    receivesRequests: false,
                });

                setCurrentPage(0);
                window.location.reload();
            } else {
                console.error("Error submitting department:", res.status);
            }
        } catch (error) {
            console.error("Error submitting department:", error);
        }
    };

    return (
        <main>
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/departments`}
                    onCreate={() => handleModalOpen("Criar", "add")}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                />
                <Table
                    columns={columns}
                    data={data}
                    modalID="modal"
                    mode="admin"
                    handleModalOpen={handleModalOpen}
                    filterText={filterText}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <div className="modal fade" id="modal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="title_modal">
                                {modalTitle}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {modeModal !== "delete" && (
                                    <>
                                        <div>
                                            <label htmlFor="name" className="form-label">
                                                Nome
                                            </label>
                                            <input
                                                name="name"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentDepartment.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="unit" className="form-label">
                                                Unidade
                                            </label>
                                            <select
                                                className="form-select"
                                                name="unit"
                                                id="unit"
                                                value={currentDepartment.unit?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="">---</option>
                                                {units.map((unit) => (
                                                    <option key={unit.id} value={unit.id}>
                                                        {unit.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mt-2">
                                            <label
                                                htmlFor="receivesRequests"
                                                className="form-label"
                                            >
                                                Recebe Chamados
                                            </label>
                                            <select
                                                className="form-select"
                                                name="receivesRequests"
                                                id="receivesRequests"
                                                value={
                                                    currentDepartment.receivesRequests === true
                                                        ? "true"
                                                        : "false"
                                                }
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="false">Não</option>
                                                <option value="true">Sim</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {modeModal === "delete" && (
                                    <p>Deseja excluir o departamento {currentDepartment.name}?</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                {modeModal === "update" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType("update")}
                                    >
                                        Atualizar
                                    </button>
                                )}
                                {modeModal === "add" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType("add")}
                                    >
                                        Criar
                                    </button>
                                )}
                                {modeModal === "delete" && (
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() => setSubmitType("delete")}
                                    >
                                        Excluir
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DepartmentManagement;
