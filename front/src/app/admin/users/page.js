"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import ActionBar from "../../components/actionBar/actionBar";
import { FaUserMinus, FaUserPlus } from "react-icons/fa6";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
    { value: "name", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "department.name", label: "Setor" },
    { value: "cargo.name", label: "Cargo" },
    { value: "profile", label: "Perfil" },
];

const User = () => {
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        id: '',
        name: '',
        email: '',
        department: { id: '', name: '' },
        cargo: { id: '', name: '' },
        profile: '',
        password: '',
    });
    const [cargos, setCargos] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [submitType, setSubmitType] = useState('');

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/users/`);
                if (res.status === 200) {
                    setData(res.data);
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchCargosData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/cargos/`);
                if (res.status === 200) {
                    setCargos(res.data);
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDepartmentsData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/departments/`);
                if (res.status === 200) {
                    setDepartments(res.data);
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsersData();
        fetchCargosData();
        fetchDepartmentsData();
    }, []);

    const handleModalOpen = async (action, mode, idUser) => {
        setModalTitle(`${action} Usuário`);
        setModeModal(mode);
        if (mode != "add") {
            try {
                const res = await axios.get(`${API_BASE_URL}/users/${idUser}`);
                if (res.status === 200) {
                    const department = {
                        id: res.data.department?.id ?? -1,
                        name: res.data.department?.name ?? ""
                    };
                    const cargos = {
                        id: res.data.cargo?.id ?? -1,
                        name: res.data.cargo?.name ?? ""
                    };
                    setCurrentUser({
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        department: department,
                        cargo: cargos,
                        profile: '',
                        password: '',
                    });
                } else {
                    console.error('Error', res.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentUser({
                id: '',
                name: '',
                email: '',
                department: { id: '', name: '' },
                cargo: { id: '', name: '' },
                profile: '',
                password: '',
            });
        }
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'department') {
            setCurrentUser({
                ...currentUser,
                department: { ...currentUser.department, id: parseInt(value, 10) },
            });
        } else if (name === 'cargo') {
            setCurrentUser({
                ...currentUser,
                cargo: { ...currentUser.cargo, id: parseInt(value, 10) },
            });
        } else {
            setCurrentUser({
                ...currentUser,
                [name]: value,
            });
        }
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            const { department, cargo, ...postData } = currentUser;

            if (submitType === "delete") {
                res = await axios.delete(`${API_BASE_URL}/users/${currentUser.id}`);
            } else {
                const postDataWithIds = {
                    ...postData,
                    department_id: department.id,
                    cargo_id: cargo.id,
                };

                switch (submitType) {
                    case 'add':
                        if (!department || !cargo) {
                            console.error('Department or cargo is null');
                            return;
                        }

                        res = await axios.post(`${API_BASE_URL}/auth/register`, postDataWithIds);
                        break;
                    case 'update':
                        if (!department || !cargo) {
                            console.error('Department or cargo is null');
                            return;
                        }

                        res = await axios.put(`${API_BASE_URL}/users/${currentUser.id}`, postDataWithIds);
                        break;
                    default:
                        console.error('Invalid submit type');
                        return;
                }
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentUser({
                    id: '',
                    name: '',
                    email: '',
                    department: { id: '', name: '' },
                    cargo: { id: '', name: '' },
                    profile: '',
                    password: '',
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
            <Header pageName="Gerenciar Usuários" />
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/users`}
                    addIcon={FaUserPlus}
                    removeIcon={FaUserMinus}
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
                                                value={currentUser.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="email" className="form-label">
                                                E-mail
                                            </label>
                                            <input
                                                name="email"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentUser.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mt-2">
                                            <label htmlFor="department" className="form-label">
                                                Setor
                                            </label>
                                            <select
                                                className="form-select"
                                                name="department"
                                                id="department"
                                                value={currentUser.department?.id || ""}
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
                                        <div className="mt-2">
                                            <label htmlFor="cargo" className="form-label">
                                                Cargo
                                            </label>
                                            <select
                                                className="form-select"
                                                name="cargo"
                                                id="cargo"
                                                value={currentUser.cargo?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="">----</option>
                                                {cargos.map((cargo) => (
                                                    <option key={cargo.id} value={cargo.id}>
                                                        {cargo.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="profile" className="form-label">
                                                Perfil
                                            </label>
                                            <input
                                                name="profile"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentUser.profile}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {modeModal !== "readonly" && (
                                            <div className="mt-2">
                                                <label htmlFor="password" className="form-label">
                                                    Senha
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    readOnly={modeModal === "readonly"}
                                                    value={currentUser.password}
                                                    onChange={handleInputChange}
                                                    required={modeModal === "add"}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {modeModal === "delete" && (
                                    <>
                                        Deseja excluir o usuário {currentUser.name}?
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

export default User;
