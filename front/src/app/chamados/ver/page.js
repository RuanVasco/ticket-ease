"use client"

import Table from "../../components/tables/tables";
import Header from "../../components/header/header";
import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function VerChamados() {
    const [data, setData] = useState([]);
    const userID = 1;

    const columns = [
        { label: 'Nome', value: 'name' },
        { label: 'Email', value: 'email' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/tickets/open/user/${userID}`);
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
            <Header pageName="Visualizar Chamados" />            
            <div className="container">                
                <Table columns={columns} data={data} entity="Ticket" mode="readonly" />
            </div>
        </main>
    );
}