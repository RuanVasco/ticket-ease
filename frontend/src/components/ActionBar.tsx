import "../assets/styles/action_bar.css";
import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

import ItemsPerPage from "./ItemsPerPage";

interface ActionBarProps {
    modalTargetId: string;
    delEntityEndPoint: string;
    onCreate: () => void;
    onFilterChange: (event: ChangeEvent<HTMLInputElement>) => void;
    filterText: string;
    addIcon?: React.ElementType;
    removeIcon?: React.ElementType;
    onPageSizeChange: (size: number) => void;
    pageSize: number;
}

const ActionBar: React.FC<ActionBarProps> = ({
    modalTargetId,
    delEntityEndPoint,
    onCreate,
    onFilterChange,
    filterText,
    addIcon: AddIcon = FaPlus,
    removeIcon: RemoveIcon = FaMinus,
    onPageSizeChange,
    pageSize,
}) => {
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleDelMassiveAction = () => {
        const checkedItems = Array.from(
            document.querySelectorAll<HTMLInputElement>(".massive-actions:checked")
        );

        if (checkedItems.length <= 0) {
            setItems([]);
            return;
        }

        setItems(checkedItems.map((item) => item.value));
    };

    const deleteItem = async (itemID: string) => {
        try {
            await axios.delete(`${delEntityEndPoint}/${itemID}`);
        } catch (error) {
            console.error(`Error deleting item ${itemID}:`, error);
        }
    };

    const submitMassiveActions = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        await Promise.all(items.map((item) => deleteItem(item)));

        setLoading(false);
        window.location.reload();
    };

    return (
        <div>
            <div className="mt-4 mb-3 row">
                <div className="col"></div>
                <div className="d-flex justify-content-center col">
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-massive-actions me-2"
                            data-bs-toggle="modal"
                            data-bs-target={`#${modalTargetId}`}
                            onClick={onCreate}
                        >
                            <AddIcon />
                        </button>
                        <button
                            className="btn btn-massive-actions me-2"
                            onClick={handleDelMassiveAction}
                            data-bs-toggle="modal"
                            data-bs-target="#modalDelete"
                        >
                            <RemoveIcon />
                        </button>
                        <input
                            className="form-control"
                            placeholder="Filtrar"
                            value={filterText}
                            onChange={onFilterChange}
                        />
                    </div>
                </div>
                <div className="col text-end mt-auto">
                    <ItemsPerPage onPageSizeChange={onPageSizeChange} pageSize={pageSize} />
                </div>
            </div>

            <div className="modal fade" id="modalDelete" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={submitMassiveActions}>
                            <div className="modal-body">
                                {items.length > 0 ? (
                                    <>Deseja realmente excluir {items.length} itens?</>
                                ) : (
                                    <>Selecione pelo menos um item para excluir!</>
                                )}
                            </div>
                            <div className="modal-footer">
                                {items.length > 0 && !loading && (
                                    <button type="submit" className="btn btn-danger">
                                        Excluir
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    {items.length > 0 && !loading ? <>Cancelar</> : <>Fechar</>}
                                </button>
                                {loading && (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionBar;
