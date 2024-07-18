import { FaEye, FaPencil, FaCircleXmark } from "react-icons/fa6";
import styles from "./table.css";
import { useState } from "react";

const Table = ({
    columns,
    data,
    modalID,
    mode = "admin",
    handleModalOpen,
    filterText
}) => {
    const filteredData = data.filter(row =>
        columns.some(column => {
            const cellValue = row[column.value];
            return cellValue && cellValue.toLowerCase().includes(filterText.toLowerCase());
        })
    );

    return (
        <div>
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
                                <button
                                    className="btn btn-warning me-1"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${modalID}`}
                                    onClick={() => handleModalOpen("Visualizar", "readonly", row)}
                                >
                                    <FaEye />
                                </button>
                                {mode !== "readonly" && (
                                    <>
                                        <button
                                            className="btn btn-secondary me-1"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#${modalID}`}
                                            onClick={() => handleModalOpen("Editar", "update", row)}
                                        >
                                            <FaPencil />
                                        </button>
                                        <button className="btn btn-danger">
                                            <FaCircleXmark />
                                        </button>
                                    </>
                                )}
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
        </div>
    );
};

export default Table;
