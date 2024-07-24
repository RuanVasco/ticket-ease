import styles from "./actionBar.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import axios from 'axios';
import React, { useState } from 'react';

const ActionBar = ({
    modalTargetId,
    delEntityEndPoint,
    onCreate,
    onFilterChange,
    filterText,
    addIcon: AddIcon = FaPlus,
    removeIcon: RemoveIcon = FaMinus
}) => {
    const [items, setItems] = useState([]);

    const handleDelMassiveAction = () => {
        const checkedItems = Array.from(document.querySelectorAll(".massive-actions:checked"));

        if (checkedItems.length <= 0) {
            setItems([]);
            return;
        }

        setItems(checkedItems.map(item => item.value));
    };

    const deleteItem = async (itemID) => {
        console.log(itemID);

        try {
            await axios.delete(`${delEntityEndPoint}/${itemID}`);
        } catch (error) {
            console.log(error);
        }
    };

    const submitMassiveActions = (e) => {
        e.preventDefault();
        
        items.forEach(item => {
            deleteItem(item);
        });

        window.location.reload();
    };

    return (
        <div className={`d-flex justify-content-center mt-4 mb-3 ${styles.actionBar}`}>
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
            <div>
                <input
                    className="form-control"
                    placeholder="Filtrar"
                    value={filterText}
                    onChange={onFilterChange}
                />
            </div>
            <div className="modal fade" id="modalDelete" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={submitMassiveActions}>
                            <div className="modal-body">
                                {items.length > 0 ? (
                                    <>Deseja realmente excluir {items.length} items?</>
                                ) : (
                                    <>Selecione pelo menos um item para excluir!</>
                                )}
                            </div>
                            <div className="modal-footer">
                                {items.length > 0 && (
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                    >
                                        Excluir
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    {items.length > 0 ? (
                                        <>Cancelar</>
                                    ) : (
                                        <>Fechar</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionBar;
