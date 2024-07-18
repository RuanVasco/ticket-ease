"use client";

import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaUserMinus, FaUserPlus, FaPencil, FaCircleXmark } from "react-icons/fa6";
import axios from "axios";
import Header from "../../components/header/header";
import styles from "../../components/table/table.css";

const columns = [
    { value: "name", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "department.name", label: "Setor" },
    { value: "cargo.name", label: "Cargo" },
    { value: "profile", label: "Perfil" },
];

const User = () => {
    const [filterText, setFilterText] = useState("");
    const [modeModal, setModeModal] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [updateModal, setUpdateModal] = useState(false);
    const [data, setData] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        name: "",
        email: "",
        department: { id: "", name: "" },
        cargo: { id: "", name: "" },
        profile: "",
        password: "",
    });
    const [cargos, setCargos] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/users/`);
                if (res.status === 200) {
                    setData(res.data);
                } else {
                    console.error("Error", res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchCargosData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/cargos/`);
                if (res.status === 200) {
                    setCargos(res.data);
                } else {
                    console.error("Error", res.status);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDepartmentsData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/departments/`);
                if (res.status === 200) {
                    setDepartments(res.data);
                } else {
                    console.error("Error", res.status);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsersData();
        fetchCargosData();
        fetchDepartmentsData();
    }, []);

    const handleModalOpen = (action, mode, user) => {
        setModalTitle(`${action} Usuário`);
        setModeModal(mode);
        if (mode === "update") {
            setCurrentUser(user);
            setUpdateModal(true);
        } else {
            setCurrentUser({
                name: "",
                email: "",
                department: { id: "", name: "" },
                cargo: { id: "", name: "" },
                profile: "",
                password: "",
            });
            setUpdateModal(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "department") {
            setCurrentUser({
                ...currentUser,
                department: { ...currentUser.department, id: parseInt(value, 10) },
            });
        } else if (name === "cargo") {
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
            const { department, cargo, ...postData } = currentUser;
            const postDataWithIds = {
                ...postData,
                department_id: department.id,
                cargo_id: cargo.id,
            };

            const res = await axios.post("http://localhost:8080/auth/register", postDataWithIds);

            if (res.status === 200 || res.status === 201) {
                setData(
                    updateModal
                        ? data.map((user) => (user.id === currentUser.id ? res.data : user))
                        : [...data, res.data]
                );
                setCurrentUser({
                    name: "",
                    email: "",
                    department: { id: "", name: "" },
                    role: "",
                    profile: "",
                    password: "",
                });
                document.querySelector("#modal .btn-close").click();
            } else {
                console.error("Error", res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredData = data.filter((row) =>
        columns.some((column) => {
            const keys = column.value.split(".");
            let value = row;
            for (const key of keys) {
                value = value?.[key];
            }
            return value?.toString().toLowerCase().includes(filterText.toLowerCase());
        })
    );

    return (
        <main>
            <Header pageName="Gerenciar Usuários" />
            <div className="container">
                <div className="d-flex justify-content-center mt-4 mb-3">
                    <button
                        className="btn btn-massive-actions me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modal"
                        onClick={() => handleModalOpen("Criar", "")}
                    >
                        <FaUserPlus />
                    </button>
                    <button className="btn btn-massive-actions me-2">
                        <FaUserMinus />
                    </button>
                    <div>
                        <input
                            className="form-control"
                            placeholder="Filtrar"
                            value={filterText}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <table className="table table-custom">
                    <thead>
                        <tr>
                            <th scope="col">Selecionar</th>
                            <th scope="col">Ação</th>
                            {columns.map((column, colIndex) => (
                                <th key={colIndex} scope="col">
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, rowIndex) => (
                            <tr key={rowIndex} scope="row" valign="middle">
                                <td className="col-auto-width">
                                    <input type="checkbox" className="massive-actions" />
                                </td>
                                <td className="col-auto-width">
                                    <button
                                        className="btn btn-warning me-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal"
                                        onClick={() => handleModalOpen("Visualizar", "readonly", row)}
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="btn btn-secondary me-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal"
                                        onClick={() => handleModalOpen("Editar", "update", row)}
                                    >
                                        <FaPencil />
                                    </button>
                                    <button className="btn btn-danger">
                                        <FaCircleXmark />
                                    </button>
                                </td>
                                {columns.map((column, colIndex) => {
                                    const keys = column.value.split(".");
                                    let value = row;
                                    for (const key of keys) {
                                        value = value?.[key];
                                    }
                                    const displayValue = value === null || value === undefined ? "-" : value;

                                    return (
                                        <td key={colIndex}>
                                            <span>{displayValue}</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

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
                                        >
                                            <option value="">---</option>
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
                                        >
                                            <option value="">---</option>
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
                                                name="password"
                                                type="password"
                                                className="form-control"
                                                placeholder="*****"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    {modeModal !== "readonly" && (
                                        <button type="submit" className="btn btn-primary">
                                            {updateModal ? "Atualizar Usuário" : "Criar Usuário"}
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
            </div>
        </main>
    );
};

export default User;
