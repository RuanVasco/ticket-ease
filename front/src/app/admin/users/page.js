"use client"

import { FaEye } from "react-icons/fa";
import { FaUserMinus, FaUserPlus, FaPencil, FaCircleXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";
import styles from "../../components/tables/tables.css";
import Header from "../../components/header/header";

const User = () => {
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/users/`);

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

    const handleModalOpen = (action, mode) => {
        setModeModal(mode);
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredData = data.filter(row =>
        columns.some(column => row[column.value].toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
        <main>
            <Header pageName="Gerenciar Usuários" />
            <div className="container">
                <div className="d-flex justify-content-center mt-4 mb-3">
                    <button className="btn btn-massive-actions me-2" data-bs-toggle="modal" data-bs-target="#modal" onClick={() => handleModalOpen("Criar", "")}><FaUserPlus /></button>
                    <button className="btn btn-massive-actions me-2"><FaUserMinus /></button>
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
                            <th scope="col">Nome</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Setor</th>
                            <th scope="col">Função</th>
                            <th scope="col">Perfil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, rowIndex) => (
                            <tr key={rowIndex} scope="row" valign="middle">
                                <td className="col-auto-width">
                                    <input type="checkbox" className="massive-actions" />
                                </td>
                                <td className="col-auto-width">
                                    <button className="btn btn-warning me-1" data-bs-toggle="modal" data-bs-target="#modal" onClick={() => handleModalOpen("Visualizar", "readonly")}><FaEye /></button>
                                        <button className="btn btn-secondary me-1" data-bs-toggle="modal" data-bs-target="#modal" onClick={() => handleModalOpen("Editar", "")}><FaPencil /></button>
                                        <button className="btn btn-danger"><FaCircleXmark /></button>
                                </td>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}><span>{row[column.value]}</span></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="modal fade" id="modal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="title_modal">Criar Usuário</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default User;
