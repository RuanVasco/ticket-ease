"use client"

import React, { useState, useEffect } from 'react';
import Header from "../../components/header/header";
import axios from 'axios';
import styles from "./ticket_style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ChamadoDetalhes = ({ params: { id } }) => {
    const [data, setData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState({
        text: "",
        user_id: 1,
        ticket_id: parseInt(id, 10),
    });
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true
            try {
                const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
                setData(response.data);
            } catch (error) {
                setError('Erro ao buscar dados.');
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true); // Set loading to true
            try {
                const response = await axios.get(`${API_BASE_URL}/messages/${id}`);

                if (response.status === 200 || response.status === 201) {
                    setMessages(response.data);
                } else {
                    console.error('Error', response.status);
                }
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
            } finally {
                setLoading(false); // Set loading to false after messages are fetched
            }
        };

        fetchMessages();
    }, [message]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMessage({ ...message, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_BASE_URL}/messages/`, { text: message.text, user_id: message.user_id, ticket_id: message.ticket_id });

            if (res.status === 200 || res.status === 201) {
                setMessage({ ...message, text: "" });
            } else {
                console.error('Error', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <main>
            <Header pageName={`Chamado ${data?.id || ''} - ${data?.name || ''}`} />
            <div className="container">
                <div className="row">
                    <div className="col-9">
                        <div className="d-flex flex-column">
                            <div className="border p-2 rounded mb-2 bg-secondary fw-semibold">
                                {data?.description || ''}
                            </div>
                            <div className="chat_content px-2">
                                {messages && messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="card mt-3">
                                            <div className="card-body">
                                                <p className="card-text">{msg.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Envie uma mensagem para iniciar o chamado.</p>
                                )}
                            </div>
                            <form className="mt-3 input-group" onSubmit={handleSubmit}>
                                <input type="text" className="input-text form-control" name="text" value={message.text} onChange={handleInputChange}></input>
                                <button type="submit" className="btn btn-primary">Responder</button>
                            </form>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="department" className="col-form-label">Categoria</label>
                        <input id="department" className="input-text" type="text" value={`${data.ticketCategory.path}`} readOnly />
                        <label htmlFor="department" className="col-form-label">Setor</label>
                        <input id="department" className="input-text" type="text" value="TI" readOnly />
                        <label htmlFor="created_at" className="col-form-label">Data de Abertura</label>
                        <input id="created_at" className="input-text" type="text" value={`${data?.created_at || ''}`} readOnly />
                        <label htmlFor="observation" className="col-form-label">Observação</label>
                        <textarea id="observation" className="input-text" value={`${data?.observation || ''}`} readOnly />
                        <label htmlFor="observation" className="col-form-label">Status</label>
                        <input id="observation" className="input-text" type="text" value={`${data?.status || ''}`} readOnly />
                        <label htmlFor="urgency" className="col-form-label">Urgência</label>
                        <input id="urgency" className="input-text" type="text" value={`${data?.urgency || ''}`} readOnly />
                    </div>
                </div>
            </div>
        </main >
    );
};

export default ChamadoDetalhes;
