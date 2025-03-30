import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

import ActionBar from "../../components/ActionBar";
import axiosInstance from "../../components/AxiosConfig";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import { usePermissions } from "../../context/PermissionsContext";
import { Form } from "../../types/Form";
import { TicketCategory } from "../../types/TicketCategory";
import { fetchCategories } from "../../services/TicketCategoryService";
import FormBuilder from "../../components/FormBuilder";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [
    { value: "id", label: "ID" },
    { value: "title", label: "Título" },
    { value: "description", label: "Descrição" },
    { value: "ticketCategory.name", label: "Categoria" },
    { value: "creator.name", label: "Criador" },
];

const FormManagement: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [modeModal, setModeModal] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [data, setData] = useState<Form[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [categories, setCategories] = useState<TicketCategory[]>([]);

    const [screenType, setScreenType] = useState<string>("view");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(
                    `${API_BASE_URL}/forms/pageable?page=${currentPage}&size=${pageSize}`
                );
                if (res.status === 200) {
                    setData(res.data?.content);
                    setTotalPages(res.data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching forms:", error);
            }
        };

        fetchData();
    }, [currentPage, pageSize]);

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await fetchCategories();
            setCategories(categories);
        };
        loadCategories();
    }, []);


    const handleModalOpen = async (action: string, mode: string) => {
        setModalTitle(`${action} Formulário`);
        setModeModal(mode);
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    return (
        <main>
            <div className="container">
                <ActionBar
                    delEntityEndPoint={`${API_BASE_URL}/departments`}
                    onCreate={() => { setScreenType("create") }}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                    canCreate={true}
                    canDelete={false}
                />
                {screenType === "view" ? (
                    <Table
                        columns={columns}
                        data={data}
                        modalID="modal"
                        mode="admin"
                        handleModalOpen={handleModalOpen}
                        filterText={filterText}
                        canDelete={true}
                        canEdit={true}
                    />
                ) : (
                    <FormBuilder />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* <div className="modal fade" id="modal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg">
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
                                            <label htmlFor="title" className="form-label">
                                                Título
                                            </label>
                                            <input
                                                name="title"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                // value={currentDepartment.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="description" className="form-label">
                                                Descrição
                                            </label>
                                            <input
                                                name="description"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                // value={currentDepartment.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="father" className="form-label">
                                                Categoria Pai
                                            </label>
                                            <select
                                                className="form-select"
                                                name="father"
                                                id="father"
                                                // value={currentCategory.father?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="">----</option>
                                                {categories.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {`${item.path}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                                {modeModal === "delete" && (
                                    <></>
                                    // <p>Deseja excluir o departamento {currentDepartment.name}?</p>
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
            </div> */}
        </main>
    );
};

export default FormManagement;
