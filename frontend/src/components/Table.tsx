import { FaEye, FaPencil, FaCircleXmark } from "react-icons/fa6";
import "../assets/styles/table.css";

interface Column {
    value: string;
    label: string;
}

interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
    modalID: string;
    mode?: "admin" | "readonly";
    handleModalOpen: (action: string, mode: string, id: string) => void;
    filterText: string;
}

const Table: React.FC<TableProps> = ({
    columns,
    data,
    modalID,
    mode = "admin",
    handleModalOpen,
    filterText,
}) => {
    const filteredData = data.filter((row) =>
        columns.some((column) => {
            const cellValue = row[column.value];
            return (
                cellValue &&
                typeof cellValue === "string" &&
                cellValue.toLowerCase().includes(filterText.toLowerCase())
            );
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
                            <th key={index} scope="col">
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="col-auto-width">
                                <input type="checkbox" className="massive-actions" value={row.id} />
                            </td>
                            <td className="col-auto-width">
                                <button
                                    className="btn btn-warning me-1"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${modalID}`}
                                    onClick={() =>
                                        handleModalOpen("Visualizar", "readonly", row.id)
                                    }
                                >
                                    <FaEye />
                                </button>
                                {mode !== "readonly" && (
                                    <>
                                        <button
                                            className="btn btn-secondary me-1"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#${modalID}`}
                                            onClick={() =>
                                                handleModalOpen("Editar", "update", row.id)
                                            }
                                        >
                                            <FaPencil />
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#${modalID}`}
                                            onClick={() =>
                                                handleModalOpen("Excluir", "delete", row.id)
                                            }
                                        >
                                            <FaCircleXmark />
                                        </button>
                                    </>
                                )}
                            </td>
                            {columns.map((column, colIndex) => {
                                const keys = column.value.split(".");
                                let value: any = row;
                                for (const key of keys) {
                                    value = value?.[key];
                                }
                                const displayValue =
                                    value === null || value === undefined ? "-" : value.toString();

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
