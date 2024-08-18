"use client";

import React, { useEffect, useState } from 'react';
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
import withAdmin from '../../auth/withAdmin';
import Pagination from '../../components/pagination/pagination';
import axiosInstance from "../../components/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
    { value: "name", label: "Nome" },
    { value: "unit.name", label: "Unidade" },
    { value: "receivesRequests", label: "Recebe Chamados" }
];

const Departments = () => {
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [submitType, setSubmitType] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [units, setUnits] = useState([]);
    const [currentDepartment, setCurrentDepartment] = useState({
        id: '',
        name: '',
        unit: { id: '', name: '', address: '' },
        receivesRequests: '',
    });
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/departments/pageable?page=${currentPage}&size=${pageSize}`);
                if (res.status === 200) {
                    const departments = res.data.content.map(dept => ({
                        ...dept,
                        receivesRequests: dept.receivesRequests ? 'Sim' : 'Não',
                    }));
                    setData(departments);
                    setTotalPages(res.data.totalPages);
                } else {
                    console.error('Error fetching departments:', res.status);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
            setLoading(false);
        };

        const fetchUnits = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/units/`);
                if (res.status === 200) {
                    setUnits(res.data);
                } else {
                    console.error('Error fetching units:', res.status);
                }
            } catch (error) {
                console.error('Error fetching units:', error);
            }
            setLoading(false);
        }

        fetchData();
        fetchUnits();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action, mode, idUnit) => {
        setModalTitle(`${action} Departamento`);
        setModeModal(mode);

        if (mode !== "add") {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/departments/${idUnit}`);
                if (res.status === 200) {
                    setCurrentDepartment({
                        id: res.data.id,
                        name: res.data.name,
                        unit: { id: res.data.unit.id, name: res.data.unit.name, address: res.data.unit.address },
                        receivesRequests: res.data.receivesRequests
                    });
                } else {
                    console.error('Error fetching department:', res.status);
                }
            } catch (error) {
                console.error('Error fetching department:', error);
            }
        } else {
            setCurrentDepartment({
                id: '',
                name: '',
                unit: { id: '', name: '', address: '' },
                receivesRequests: ''
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
        if (name === 'unit') {
            setCurrentDepartment({
                ...currentDepartment,
                unit: { ...currentDepartment.unit, id: parseInt(value, 10) },
            });
        } else if (name === 'receivesRequests') {
            setCurrentDepartment({
                ...currentDepartment,
                receivesRequests: value === 'true',
            });
        } else {
            setCurrentDepartment({
                ...currentDepartment,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;

            if (submitType === "delete") {
                res = await axiosInstance.delete(`${API_BASE_URL}/departments/${currentDepartment.id}`);
            } else if (submitType === "add") {
                res = await axiosInstance.post(`${API_BASE_URL}/departments/`, currentDepartment);
            } else if (submitType === "update") {
                res = await axiosInstance.put(`${API_BASE_URL}/departments/${currentDepartment.id}`, currentDepartment);
            } else {
                console.error('Invalid submit type');
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentDepartment({
                    id: '',
                    name: '',
                    unit: { id: '', name: '', address: '' },
                    receivesRequests: ''
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

    return (
        <main>
            <Header pageName="Gerenciar Setores" />
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/departments`}
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
                                            <label htmlFor="receivesRequests" className="form-label">
                                                Recebe Chamados
                                            </label>
                                            <select
                                                className="form-select"
                                                name="receivesRequests"
                                                id="receivesRequests"
                                                value={currentDepartment.receivesRequests === true ? "true" : "false"}
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
                                    <p>
                                        Deseja excluir o departamento {currentDepartment.name}?
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

export default withAdmin(Departments);
