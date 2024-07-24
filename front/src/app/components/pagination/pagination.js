import style from "./pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()];

    return (
        <div className="d-flex flex-column align-items-center justify-content-end">
            <ul className="pagination">
                <li className="page-item">
                    <button
                        className="page-link"
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                    >
                        Anterior
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active-page' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(page)}
                        >
                            {page + 1} 
                        </button>
                    </li>
                ))}
                <li className="page-item">
                    <button
                        className="page-link"
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        Próximo
                    </button>
                </li>
            </ul>            
        </div>
    );
}

export default Pagination;
