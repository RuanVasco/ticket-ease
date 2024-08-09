import React, { useState, useEffect } from 'react';
import Pagination from './pagination/pagination';
import ItemsPerPage from './pagination/itemsPerPage';
import axios from "axios";
import { format } from 'date-fns';
import styles from "./table/table.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TableTicket = ({ viewMode = 'readonly' }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const columns = [
        { label: 'ID', value: 'id'},
        { label: 'Assunto', value: 'name' },
        { label: 'Status', value: 'status' },
        { label: 'Data de Criação', value: 'created_at' },
        { label: 'Última Atualização', value: 'updated_at' },
        { label: 'Urgência', value: 'urgency' }
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

    const handlePageChange = (page) => setCurrentPage(page);

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <ItemsPerPage
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                />
            </div>
            <table className='w-100 table table-custom'>
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>

    );
};

export default TableTicket;
