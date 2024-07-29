"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
import Pagination from '../../components/pagination/pagination';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
    { value: "name", label: "Nome" },
    { value: "ticketCategory.path", label: "Categoria" },
];

const Forms = () => {
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [submitType, setSubmitType] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [categories, setCategories] = useState([]);
    const [currentForm, setCurrentForm] = useState({
        id: '',
        name: '',
        ticketCategory: { id: '', name: '', path: '' },
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/forms/pageable?page=${currentPage}&size=${pageSize}`);
                if (res.status === 200) {
                    setData(res.data.content);
                    setTotalPages(res.data.totalPages);
                } else {
                    console.error('Error fetching forms:', res.status);
                }
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
            setLoading(false);
        };

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/tickets-category/`);
                if (res.status === 200) {
                    setCategories(res.data);
                } else {
                    console.error('Error fetching categories:', res.status);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
            setLoading(false);
        };

        fetchData();
        fetchCategories();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action, mode, idForm) => {
        setModalTitle(`${action} Formulário`);
        setModeModal(mode);

        if (mode !== "add") {
            try {
                const res = await axios.get(`${API_BASE_URL}/forms/${idForm}`);
                if (res.status === 200) {
                    setCurrentForm({
                        id: res.data.id,
                        name: res.data.name,
                        ticketCategory: { id: res.data.ticketCategory.id, name: res.data.ticketCategory.name, path: res.data.ticketCategory.path }
                    });
                } else {
                    console.error('Error fetching form:', res.status);
                }
            } catch (error) {
                console.error('Error fetching form:', error);
            }
        } else {
            setCurrentForm({
                id: '',
                name: '',
                ticketCategory: { id: '', name: '', path: '' },
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'ticketCategory') {
            setCurrentForm({
                ...currentForm,
                ticketCategory: { ...currentForm.ticketCategory, id: parseInt(value, 10) },
            });
        } else {
            setCurrentForm({
                ...currentForm,
                [name]: value,
            });
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            const formId = currentForm.id;

            if (submitType === "delete") {
                res = await axios.delete(`${API_BASE_URL}/forms/${formId}`);
            } else if (submitType === "add") {
                res = await axios.post(`${API_BASE_URL}/forms/`, currentForm);
            } else if (submitType === "update") {
                res = await axios.put(`${API_BASE_URL}/forms/${formId}`, currentForm);
            } else {
                console.error('Invalid submit type');
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentForm({
                    id: '',
                    name: '',
                    ticketCategory: { id: '', name: '', path: '' },
                });
                setCurrentPage(0);
                window.location.reload();
            } else {
                console.error('Error submitting form:', res.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setLoading(false);
    };

    return (
        <main>
            <Header pageName="Gerenciar Formulários" />
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/forms`}
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
                                                value={currentForm.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="ticketCategory" className="form-label">
                                                Categoria de Formulários
                                            </label>
                                            <select
                                                className="form-select"
                                                name="ticketCategory"
                                                id="ticketCategory"
                                                value={currentForm.ticketCategory?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="">---</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.path}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                                {modeModal === "delete" && (
                                    <p>
                                        Deseja excluir o formulário {currentForm.name}?
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                {modeModal === "update" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType('update')}
                                    >
                                        Atualizar
                                    </button>
                                )}
                                {modeModal === "add" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType('add')}
                                    >
                                        Criar
                                    </button>
                                )}
                                {modeModal === "delete" && (
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() => setSubmitType('delete')}
                                    >
                                        Excluir
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
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

export default Forms;
