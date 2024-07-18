"use client";

import { FaEye } from "react-icons/fa";
import { FaUserMinus, FaUserPlus, FaPencil, FaCircleXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";
import styles from "../../components/tables/tables.css";
import Header from "../../components/header/header";
import axios from "axios";

const columns = [
    { value: "name", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "department.name", label: "Setor" },
    { value: "role", label: "Função" },
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
        role: "",
        profile: "",
        password: "",
    });

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
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
                role: "",
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
        if (name === "departmentName") {
            setCurrentUser({
                ...currentUser,
                department: { ...currentUser.department, name: value },
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
            const res = updateModal
                ? await axios.put(`http://localhost:8080/users/${currentUser.id}`, currentUser)
                : await axios.post("http://localhost:8080/users/", currentUser);

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
                // Close modal
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
                if (value[key]) {
                    value = value[key];
                } else {
                    return false;
                }
            }
            return value.toString().toLowerCase().includes(filterText.toLowerCase());
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
                                        value = value[key];
                                    }
                                    return (
                                        <td key={colIndex}>
                                            <span>{value}</span>
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
                                        <label htmlFor="departmentName" className="form-label">
                                            Setor
                                        </label>
                                        <input
                                            name="departmentName"
                                            className="form-control"
                                            readOnly={modeModal === "readonly"}
                                            value={currentUser.department.name}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            name="departmentId"
                                            type="hidden"
                                            value={currentUser.department.id}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor="role" className="form-label">
                                            Função
                                        </label>
                                        <input
                                            name="role"
                                            className="form-control"
                                            readOnly={modeModal === "readonly"}
                                            value={currentUser.role}
                                            onChange={handleInputChange}
                                        />
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
                                                className="form-control"
                                                placeholder="*****"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        {updateModal ? "Atualizar Usuário" : "Criar Usuário"}
                                    </button>
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
