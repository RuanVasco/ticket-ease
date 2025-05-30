import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import ActionBar from "../../components/ActionBar";
import axiosInstance from "../../components/AxiosConfig";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import { Department } from "../../types/Department";
import { TicketCategory } from "../../types/TicketCategory";
import { fetchCategories } from "../../services/TicketCategoryService";
import { closeModal } from "../../components/Util/CloseModal";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [
    { value: "name", label: "Nome" },
    { value: "path", label: "Diretório" },
    { value: "father.name", label: "Categoria Pai" },
    { value: "department.name", label: "Setor" },
];

const TicketCategoryManagement: React.FC = () => {
    const [modeModal, setModeModal] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [data, setData] = useState<TicketCategory[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [filterText, setFilterText] = useState<string>("");
    const [submitType, setSubmitType] = useState<string>("");
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [rootCategory, setRootCategory] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState({
        id: "",
        name: "",
        department: { id: "", name: "" },
        father: { id: "", name: "" },
    });

    const fetchDepartments = async () => {
        try {
            const res = await axiosInstance.get(
                `${API_BASE_URL}/ticket-category/departments/allowed`
            );
            if (res.status === 200) {
                setDepartments(res.data);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(
                `${API_BASE_URL}/ticket-category/pageable?page=${currentPage}&size=${pageSize}`
            );
            if (res.status === 200) {
                setData(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                console.error("Error fetching data:", res.status);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDepartments();
        loadCategories();
    }, [currentPage, pageSize]);

    const loadCategories = async () => {
        const categories = await fetchCategories();
        setCategories(categories);
    };

    const handleModalOpen = async (action: string, mode: string, idCategory?: string) => {
        setModalTitle(`${action} Categoria de Formulário`);
        setModeModal(mode);

        if (idCategory) {
            setCategories(prev =>
                prev.filter(category => category.id !== idCategory)
            );
        }

        if (mode !== "add") {
            try {
                const res = await axiosInstance.get(
                    `${API_BASE_URL}/ticket-category/${idCategory}`
                );
                if (res.status === 200) {
                    const { father, department, ...category } = res.data;
                    setRootCategory(father === null);
                    setCurrentCategory({
                        id: category.id,
                        name: category.name,
                        father: father || { id: "", name: "" },
                        department: department || { id: "", name: "" },
                    });
                } else {
                    console.error("Error fetching category:", res.status);
                }
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        } else {
            setCurrentCategory({
                id: "",
                name: "",
                department: { id: "", name: "" },
                father: { id: "", name: "" },
            });
        }
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value);

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload = {
                name: currentCategory.name,
                departmentId: rootCategory ? currentCategory.department.id : null,
                fatherId: !rootCategory ? currentCategory.father.id : null,
            };

            let res;
            let message;
            switch (submitType) {
                case "delete":
                    res = await axiosInstance.delete(
                        `${API_BASE_URL}/ticket-category/${currentCategory.id}`
                    );
                    message = "Categoria removida com sucesso!"
                    break;
                case "add":
                    res = await axiosInstance.post(`${API_BASE_URL}/ticket-category`, payload);
                    message = "Categoria criada com sucesso!"
                    break;
                case "update":
                    res = await axiosInstance.put(
                        `${API_BASE_URL}/ticket-category/${currentCategory.id}`,
                        payload
                    );
                    message = "Categoria atualizada com sucesso!"
                    break;
                default:
                    console.error("Invalid submit type");
                    return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentCategory({
                    id: "",
                    name: "",
                    department: { id: "", name: "" },
                    father: { id: "", name: "" },
                });

                setCurrentPage(0);
                fetchData();
                loadCategories();
                fetchDepartments();
                closeModal("modal");
                toast.success(message);
            }
        } catch (error) {
            closeModal("modal");
            toast.error(String(error));
            console.error(error)
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "rootCategory") {
            setRootCategory(value === "true");
        } else if (name === "department") {
            setCurrentCategory((prev) => ({
                ...prev,
                department: { ...prev.department, id: value },
            }));
        } else if (name === "father") {
            setCurrentCategory((prev) => ({
                ...prev,
                father: { ...prev.father, id: value },
            }));
        } else {
            setCurrentCategory((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <React.Fragment>
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/ticket-category`}
                    onCreate={() => handleModalOpen("Criar", "add")}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                    canCreate={true}
                    canDelete={true}
                />
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
                                                value={currentCategory.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="rootCategory" className="form-label">
                                                Categoria Raiz
                                            </label>
                                            <select
                                                className="form-select"
                                                name="rootCategory"
                                                id="rootCategory"
                                                value={rootCategory ? "true" : "false"}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="false">Não</option>
                                                <option value="true">Sim</option>
                                            </select>
                                        </div>

                                        {rootCategory && (
                                            <>
                                                <div className="mt-2">
                                                    <label
                                                        htmlFor="department"
                                                        className="form-label"
                                                    >
                                                        Setor
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        name="department"
                                                        id="department"
                                                        value={currentCategory.department?.id || ""}
                                                        onChange={handleInputChange}
                                                        disabled={modeModal === "readonly"}
                                                        required
                                                    >
                                                        <option value="">----</option>
                                                        {departments.map((department) => (
                                                            <option
                                                                key={department.id}
                                                                value={department.id ?? ""}
                                                            >
                                                                {department.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        {!rootCategory && (
                                            <div className="mt-2">
                                                <label htmlFor="father" className="form-label">
                                                    Categoria Pai
                                                </label>
                                                <select
                                                    className="form-select"
                                                    name="father"
                                                    id="father"
                                                    value={currentCategory.father?.id || ""}
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
                                        )}
                                    </>
                                )}
                                {modeModal === "delete" && (
                                    <p>Tem certeza de que deseja excluir esta categoria?</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-${modeModal === "delete" ? "danger" : "primary"
                                        }`}
                                    onClick={() => setSubmitType(modeModal)}
                                >
                                    {modeModal === "delete" ? "Excluir" : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TicketCategoryManagement;
