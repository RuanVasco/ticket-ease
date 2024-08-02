"use client"

import React, { useState, useEffect } from 'react';
import Header from "../../../components/header/header";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ChamadoDetalhes = ({ params: { id } }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
                setData(response.data);
            } catch (error) {
                setError('Erro ao buscar dados.');
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <main>
            <Header pageName="Visualizar Chamados" />
            <div className="container">
                <h4 className="text-center border-bottom pb-2">{data?.id || ''} - {data?.name || ''}</h4>
                <div className="row">
                    <div className="col-9 border rounded">
                        <div>
                            {data?.description || ''}
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="department" className="col-form-label">Setor</label>
                        <input id="department" className="form-control" type="text" value="TI" readOnly />
                        <label htmlFor="created_at" className="col-form-label">Data de Abertura</label>
                        <input id="created_at" className="form-control" type="text" value={`${data?.created_at || ''}`} readOnly />
                        <label htmlFor="observation" className="col-form-label">Observação</label>
                        <textarea id="observation" className="form-control" value={`${data?.observation || ''}`} readOnly />
                        <label htmlFor="observation" className="col-form-label">Status</label>
                        <input id="observation" className="form-control" type="text" value={`${data?.status || ''}`} readOnly />
                        <label htmlFor="urgency" className="col-form-label">Urgência</label>
                        <input id="urgency" className="form-control" type="text" value={`${data?.urgency || ''}`} readOnly />
                    </div>
                </div>
            </div>
        </main >
    );
};

export default ChamadoDetalhes;
