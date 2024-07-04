import { FaUserPlus, FaUserMinus, FaEye } from "react-icons/fa";
import { FaPencil, FaCircleXmark } from "react-icons/fa6";
import FormSchemaBased from "../forms/schemaBasedForm";
import styles from "./tables.css";
import { useState } from "react";

const Table = ({ columns, data, entity, mode = "admin", hiddenInputs }) => {
    const [modalTitle, setModalTitle] = useState('');
    const [filterText, setFilterText] = useState('');
    const [modeModal, setModeModal] = useState('');

    const handleModalOpen = (action, mode) => {
        setModeModal(mode);
        setModalTitle(`${capitalizeFirstLetter(action)} ${entity}`);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredData = data.filter(row =>
        columns.some(column => row[column.value].toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
        <div>
            <div className="d-flex justify-content-center mt-4 mb-3">
                {mode !== "readonly" && (
                    <>
                        <button className="btn btn-go-back me-2" data-bs-toggle="modal" data-bs-target="#modal" onClick={() => handleModalOpen("Criar", "")}><FaUserPlus /></button>
                        <button className="btn btn-go-back me-2"><FaUserMinus /></button>
                    </>
                )}
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
                        {columns.map((column, index) => (
                            <th key={index} scope="col">{column.label}</th>
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
                                <button className="btn btn-warning me-1" data-bs-toggle="modal" data-bs-target="#modal" onClick={() => handleModalOpen("Visualizar", "readonly")}><FaEye /></button>
                                {mode !== "readonly" && (
                                    <>
                                        <button className="btn btn-secondary me-1" data-bs-toggle="modal" data-bs-target="#modal" onClick={() => handleModalOpen("Editar", "")}><FaPencil /></button>
                                        <button className="btn btn-danger"><FaCircleXmark /></button>
                                    </>
                                )}
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
                            <h1 className="modal-title fs-5" id="title_modal">{modalTitle}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <FormSchemaBased entity={entity} hiddenInputs={hiddenInputs} mode={modeModal} />
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
