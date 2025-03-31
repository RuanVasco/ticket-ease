import { FaEye, FaPencil, FaCircleXmark } from "react-icons/fa6";
import "../assets/styles/table.css";

interface Column {
    value: string;
    label: string;
}

interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
    modalID?: string;
    mode?: "admin" | "readonly";
    handleModalOpen?: (action: string, mode: string, id: string) => void;
    filterText: string;
    canEdit?: boolean;
    canDelete?: boolean;
    showView?: boolean;
    onEditClick?: (row: any) => void;
    onDeleteClick?: (row: any) => void;
}

const Table: React.FC<TableProps> = ({
    columns,
    data,
    modalID = "",
    mode = "admin",
    handleModalOpen = null,
    filterText,
    canDelete = false,
    canEdit = false,
    showView = true,
    onEditClick,
    onDeleteClick,
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
                                {showView && (
                                    <button
                                        className="btn btn-warning me-1"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#${modalID}`}
                                        onClick={handleModalOpen ? () => handleModalOpen("Visualizar", "readonly", row.id) : undefined}
                                    >
                                        <FaEye />
                                    </button>
                                )}
                                {mode !== "readonly" && (
                                    <>
                                        {canEdit && (
                                            <button
                                                className="btn btn-secondary me-1"
                                                {...(modalID && !onEditClick
                                                    ? {
                                                        "data-bs-toggle": "modal",
                                                        "data-bs-target": `#${modalID}`,
                                                    }
                                                    : {})}
                                                onClick={() =>
                                                    onEditClick
                                                        ? onEditClick(row)
                                                        : handleModalOpen?.("Editar", "update", row.id)
                                                }
                                            >
                                                <FaPencil />
                                            </button>
                                        )}

                                        {canDelete && (
                                            <button
                                                className="btn btn-danger"
                                                {...(modalID && !onDeleteClick
                                                    ? {
                                                        "data-bs-toggle": "modal",
                                                        "data-bs-target": `#${modalID}`,
                                                    }
                                                    : {})}
                                                onClick={() => {
                                                    if (onDeleteClick) {
                                                        onDeleteClick(row);
                                                        const modalElement = document.getElementById(modalID!);
                                                        if (modalElement) {
                                                            const modal = new (window as any).bootstrap.Modal(modalElement);
                                                            modal.show();
                                                        }
                                                    } else {
                                                        handleModalOpen?.("Excluir", "delete", row.id);
                                                    }
                                                }}
                                            >
                                                <FaCircleXmark />
                                            </button>
                                        )}
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
