"use client";

import { useEffect } from "react";
import Header from "../../components/header/header";
import Table from "../../components/table/table";
import axios from "axios";
import { useState } from 'react';

const Units = () => {
    const [data, setData] = useState([]);

    const columns = [
        { label: 'Nome', value: 'name' },
        { label: 'Endereço', value: 'endereco' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8080/units/');
                if (res.status === 200) {
                    console.log(res.data);
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
            <Header pageName="Gerenciar Unidades" />
            <div className="container">
                <Table columns={columns} data={data} entity="Unit" />
            </div>
        </main>
    );
}

export default Units;
