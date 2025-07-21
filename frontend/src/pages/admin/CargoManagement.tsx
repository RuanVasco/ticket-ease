import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import ActionBar from "../../components/ActionBar";
import axiosInstance from "../../components/AxiosConfig";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import { usePermissions } from "../../context/PermissionsContext";
import { Cargo } from "../../types/Cargo";
import { toast } from "react-toastify";
import { closeModal } from "../../components/Util/CloseModal";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [{ value: "name", label: "Nome" }];

const CargoManagement: React.FC = () => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState<string>("");
    const [modeModal, setModeModal] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [data, setData] = useState<Cargo[]>([]);
    const [submitType, setSubmitType] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentCargo, setCurrentCargo] = useState<Cargo>({
        id: "",
        name: "",
    });
    const { hasPermission } = usePermissions();
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);

    useEffect(() => {
        setCanCreate(hasPermission("CREATE_CARGO"));
        setCanEdit(hasPermission("EDIT_CARGO"));
        setCanDelete(hasPermission("DELETE_CARGO"));
    }, [hasPermission]);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(
                `${API_BASE_URL}/cargos/pageable?page=${currentPage}&size=${pageSize}`
            );
            if (res.status === 200) {
                setData(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                console.error("Error", res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action: string, mode: string, idUnit?: string) => {
        setModalTitle(`${action} Cargo`);
        setModeModal(mode);

        if (mode != "add") {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/cargos/${idUnit}`);
                if (res.status === 200) {
                    setCurrentCargo({
                        id: res.data.id,
                        name: res.data.name,
                    });
                } else {
                    console.error("Error", res.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentCargo({
                id: "",
                name: "",
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
        setCurrentCargo({
            ...currentCargo,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (submitType !== "delete" && !currentCargo.name.trim()) {
            alert("O campo 'Nome' é obrigatório.");
            return;
        }

        try {
            let res;
            let message;

            if (submitType === "delete") {
                res = await axiosInstance.delete(`${API_BASE_URL}/cargos/${currentCargo.id}`);
                message = "Cargo removido com sucesso!";
            } else if (submitType === "add") {
                res = await axiosInstance.post(`${API_BASE_URL}/cargos/`, currentCargo);
                message = "Cargo criado com sucesso!";
            } else if (submitType === "update") {
                res = await axiosInstance.put(
                    `${API_BASE_URL}/cargos/${currentCargo.id}`,
                    currentCargo
                );
                message = "Cargo atualizado com sucesso!";
            } else {
                console.error("Invalid submit type");
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentCargo({
                    id: "",
                    name: "",
                });

                setCurrentPage(0);
                fetchData();
                closeModal("modal");
                toast.success(message);
            } else {
                console.error("Error", res.status);
            }
        } catch (error) {
            setCurrentPage(0);
            fetchData();
            closeModal("modal");
            toast.error(String(error));
            console.error(error);
        }
    };

    return (
        <main>
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/cargos`}
                    onCreate={() => handleModalOpen("Criar", "add")}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                    canCreate={canCreate}
                    canDelete={canDelete}
                    onBack={() => { navigate("/admin") }}
                />

                <Table
                    columns={columns}
                    data={data}
                    modalID="modal"
                    mode="admin"
                    handleModalOpen={handleModalOpen}
                    filterText={filterText}
                    canDelete={canDelete}
                    canEdit={canEdit}
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
                                {modeModal != "delete" && (
                                    <>
                                        <div>
                                            <label htmlFor="name" className="form-label">
                                                Nome
                                            </label>
                                            <input
                                                name="name"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentCargo.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {modeModal === "delete" && (
                                    <>Deseja excluir o cargo {currentCargo.name}?</>
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

export default CargoManagement;
