"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/header/header";
import ActionBar from "../../components/actionBar/actionBar";
import Pagination from '../../components/pagination/pagination';
import Table from "../../components/table/table";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
    { value: "name", label: "Nome" },
    { value: "path", label: "Diretório" },
    { value: "father.name", label: "Categoria Pai" },
    { value: "department.name", label: "Setor" },
];

const FormsCategory = () => {
    const [loading, setLoading] = useState(false);
    const [modeModal, setModeModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [submitType, setSubmitType] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [departments, setDepartments] = useState([]);
    const [rootCategory, setRootCategory] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({
        id: '',
        name: '',
        department: {
            id: '',
            name: '',
        },
        father: {
            id: '',
            name: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/tickets-category/pageable?page=${currentPage}&size=${pageSize}`);
                if (res.status === 200) {
                    setData(res.data.content);
                    setTotalPages(res.data.totalPages);
                } else {
                    console.error('Error fetching departments:', res.status);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
            setLoading(false);
        };

        const fetchDepartments = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/departments/receiveRequests`, {params:{ receiveRequests: true }});
                if (res.status === 200) {
                    setDepartments(res.data);
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        fetchDepartments();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action, mode, idCategory) => {
        setModalTitle(`${action} Categoria de Formulário`);
        setModeModal(mode);

        if (mode !== "add") {
            try {
                const res = await axios.get(`${API_BASE_URL}/tickets-category/${idCategory}`);
                if (res.status === 200) {
                    if (res.data.father === null) {
                        setRootCategory(true);
                    } else {
                        setRootCategory(false);
                    }

                    setCurrentCategory({
                        id: res.data.id,
                        name: res.data.name,
                        father: res.data.father,
                        department: res.data.department,
                    });
                } else {
                    console.error('Error fetching department:', res.status);
                }
            } catch (error) {
                console.error('Error fetching department:', error);
            }
        } else {
            setCurrentCategory({
                id: '',
                name: '',
                father: '',
                department: '',
            });
        }
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;

            const payload = {
                name: currentCategory.name,
                department_id: rootCategory ? currentCategory.department.id : null,
                father_id: !rootCategory ? currentCategory.father.id : null,
            };

            if (submitType === "delete") {
                res = await axios.delete(`${API_BASE_URL}/tickets-category/${currentCategory.id}`);
            } else if (submitType === "add") {
                res = await axios.post(`${API_BASE_URL}/tickets-category/`, payload);
            } else if (submitType === "update") {
                res = await axios.put(`${API_BASE_URL}/tickets-category/${currentCategory.id}`, payload);
            } else {
                console.error('Invalid submit type');
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentCategory({
                    id: '',
                    name: '',
                    path: '',
                    department: '',
                });

                setCurrentPage(0);
                window.location.reload();
            } else {
                console.error('Error submitting department:', res.status);
            }
        } catch (error) {
            console.error('Error submitting department:', error);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rootCategory') {
            setRootCategory(value === 'true');
        } else if (name === 'department') {
            setCurrentCategory({
                ...currentCategory,
                department: { ...currentCategory.department, id: parseInt(value, 10) },
            });
        } else if (name === "father") {
            setCurrentCategory({
                ...currentCategory,
                father: { ...currentCategory.father, id: parseInt(value, 10) },
            });
        } else {
            setCurrentCategory({
                ...currentCategory,
                [name]: value,
            });
        }
    };

    return (
        <main>
            <Header pageName="Gerenciar Categorias de Formulários" />
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/tickets-category`}
                    onCreate={() => handleModalOpen('Criar', 'add')}
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
                    loading={loading}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <div className="modal fade" id="modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="title_modal">
                                {modalTitle}
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                            <label htmlFor="rootCategory" className="form-label">Categoria Raiz</label>
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
                                            <div className="mt-2">
                                                <label htmlFor="department" className="form-label">
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
                                                        <option key={department.id} value={department.id}>
                                                            {department.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                                                    {data.map((i) => (
                                                        <option key={i.id} value={i.id}>
                                                            {i.path}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                )}
                                {modeModal === "delete" && <p>Tem certeza de que deseja excluir esta categoria?</p>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-${modeModal === "delete" ? "danger" : "primary"}`}
                                    onClick={() => setSubmitType(modeModal)}
                                >
                                    {modeModal === "delete" ? "Excluir" : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FormsCategory;
