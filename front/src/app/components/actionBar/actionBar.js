import styles from "./actionBar.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const ActionBar = ({ 
    modalTargetId,
    onCreate, 
    onDelete, 
    onFilterChange, 
    filterText, 
    addIcon: AddIcon = FaPlus, 
    removeIcon: RemoveIcon = FaMinus 
}) => {
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
            <button className="btn btn-massive-actions me-2" onClick={onDelete}>
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
        </div>
    );
};

export default ActionBar;
