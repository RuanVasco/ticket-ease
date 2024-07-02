"use client";

import { useEffect } from "react";
import Header from "../../components/header/header";
import Table from "../../components/tables/tables";
import axios from "axios";
import { useState } from 'react';

const Users = () => {
    const [data, setData] = useState([]);

    const columns = [
        { label: 'Nome', value: 'name' },
        { label: 'Email', value: 'email' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8080/users/');
                if (res.status === 200) {
                    setData(res.data);
                } else {
                    console.error('Erro ao enviar formulário:', res.status);
                }
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <main>
            <Header pageName="Gerenciar Usuários" />
            <div className="container">
                <Table columns={columns} data={data} />
            </div>
        </main>
    );
}

export default Users;
