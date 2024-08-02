import React, { useState, useEffect } from 'react';
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TableTicket = ({ viewMode = 'readonly' }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = [
        { label: 'Nome', value: 'form.name' },
        { label: 'Email', value: 'status' }
    ];

    const getValue = (item, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], item);
    };

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
                    setData(res.data);
                } else {
                    console.error('Erro:', res.status);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();
    }, [currentPage, pageSize, viewMode]);

    return (
        <div className="container">
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>{getValue(item, column.value)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableTicket;