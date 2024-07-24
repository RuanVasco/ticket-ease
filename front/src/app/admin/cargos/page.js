"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
    { value: "name", label: "Nome" }
];

const Cagos = () => {
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [submitType, setSubmitType] = useState('');
    const [currentCargo, setCurrentCargo] = useState({
        id: '',
        name: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/cargos/`);
                if (res.status === 200) {
                    setData(res.data);
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleModalOpen = async (action, mode, idUnit) => {
        setModalTitle(`${action} Cargo`);
        setModeModal(mode);

        if (mode != "add") {
            try {
                const res = await axios.get(`${API_BASE_URL}/cargos/${idUnit}`);
                if (res.status === 200) {
                    setCurrentCargo({
                        id: res.data.id,
                        name: res.data.name,
                    });
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentCargo({
                id: '',
                name: '',
            });
        }
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCargo({
            ...currentCargo,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;

            if (submitType === "delete") {
                res = await axios.delete(`${API_BASE_URL}/cargos/${currentCargo.id}`);
            } else if (submitType === "add") {
                res = await axios.post(`${API_BASE_URL}/cargos/`, currentCargo);
            } else if (submitType === "update") {
                res = await axios.put(`${API_BASE_URL}/cargos/${currentCargo.id}`, currentCargo);
            } else {
                console.error('Invalid submit type');
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentCargo({
                    id: '',
                    name: '',
                });

                window.location.reload();
            } else {
                console.error('Error', res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <Header pageName="Gerenciar Cargos" />
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/cargos`}
                    onCreate={() => handleModalOpen('Criar', 'add')}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                />
                <Table
                    columns={columns}
                    data={data}
                    modalID="modal"
                    mode="admin"
                    handleModalOpen={handleModalOpen}
                    filterText={filterText}
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
                                    <>
                                        Deseja excluir a unidade {currentCargo.name}?
                                    </>
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

export default Cagos;
