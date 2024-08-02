import React, { useState, useEffect } from 'react';
import axios from "axios";
import { format } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TableTicket = ({ viewMode = 'readonly' }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const pages = [...Array(totalPages).keys()];

    const columns = [
        { label: 'Formulário', value: 'form.name' },
        { label: 'Assunto', value: 'name' },
        { label: 'Status', value: 'status' },
        { label: 'Data de Criação', value: 'created_at' },
        { label: 'Última Atualização', value: 'updated_at' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = '';
                switch (viewMode) {
                    case "readonly":
                        res = await axios.get(`${API_BASE_URL}/tickets/pageable?page=${currentPage}&size=${pageSize}`);
                        break;
                    default:
                        break;
                }

                if (res.status === 200) {
                    setData(res.data.content);
                    setTotalPages(res.data.totalPages);
                } else {
                    console.error('Erro:', res.status);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();
    }, [currentPage, pageSize, viewMode]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(0); // Reset to first page
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <label htmlFor="pageSize">Itens por página: </label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="ms-2"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
            <table className='w-100 table border text-center'>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.value === 'name' ? (
                                        <a href={`ver/${item.id}`}>
                                            {getNestedValue(item, column.value)}
                                        </a>
                                    ) : column.value.includes('created_at') ||
                                        column.value.includes('updated_at') ||
                                        column.value.includes('closed_at') ? (
                                        formatDate(item[column.value])
                                    ) : (
                                        getNestedValue(item, column.value) || 'N/A'
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination d-flex justify-content-between align-items-center mt-3">
                <button
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 0}
                    className="btn btn-secondary"
                >
                    Anterior
                </button>
                <span>Página {currentPage + 1} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages - 1}
                    className="btn btn-secondary"
                >
                    Próximo
                </button>
            </div>
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
                            onClick={() => {setCurrentPage(page)}}
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
        </div>
        
    );
};

export default TableTicket;
