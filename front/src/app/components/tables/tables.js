import { FaUserPlus, FaUserMinus, FaEye } from "react-icons/fa";
import { FaPencil, FaCircleXmark } from "react-icons/fa6";
import styles from "./tables.css";

const Table = ({ columns, data }) => {
    return (
        <div className="mt-4">
            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-go-back me-2"><FaUserPlus /></button>
                <button className="btn btn-go-back me-2"><FaUserMinus /></button>
                <div>
                    <input className="form-control" placeholder="Filtrar"></input>
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
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} scope="row" valign="middle">
                            <td className="col-auto-width">
                                <input type="checkbox" className="massive-actions" />
                            </td>
                            <td className="col-auto-width">
                                <button className="btn btn-warning me-1"><FaEye /></button>
                                <button className="btn btn-secondary me-1"><FaPencil /></button>
                                <button className="btn btn-danger"><FaCircleXmark /></button>
                            </td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}><span>{row[column.value]}</span></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
