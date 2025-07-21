import "../assets/styles/components/_pagination.scss";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()];

    return (
        <div className="d-flex justify-content-center align-items-center">
            <ul className="nav_pagination">
                <li>
                    <button
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                    >
                        Anterior
                    </button>
                </li>
                {pages.map((page) => (
                    <li
                        key={page}
                        className={`${page === currentPage ? "active_page" : ""}`}
                    >
                        <button onClick={() => onPageChange(page)}>
                            {page + 1}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        Próximo
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
