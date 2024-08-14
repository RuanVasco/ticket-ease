import React, { useState, useEffect, useRef } from 'react';
import { FaPaperclip } from "react-icons/fa6";
import Header from "../../components/header/header";
import axiosInstance from "../axiosConfig";
import getUserData from "../getUserData";
import styles from "./ticket_style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TicketDetails = ({ id, mode }) => {
    const userData = getUserData();
    const [data, setData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState({
        text: "",
        user_id: userData ? userData.id : null,
        ticket_id: parseInt(id, 10),
    });
    const [loading, setLoading] = useState(true);

    const chatEndRef = useRef(null); 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/tickets/${id}`);
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

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/messages/${id}`);

                if (response.status === 200 || response.status === 201) {
                    setMessages(response.data);
                } else {
                    console.error('Error', response.status);
                }
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
            }
        };

        fetchMessages();
    }, [message]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMessage({ ...message, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (message.text.trim() === "") {
            return;
        }

        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/messages/`, { text: message.text, user_id: message.user_id, ticket_id: message.ticket_id });

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
                <div className="row mt-3">
                    <div className="col-9">
                        <div className="d-flex flex-column">
                            <div className="box_description p-2 rounded mb-2 d-flex">
                                <div className="fw-semibold">{data?.description || ''}</div>
                                {data.filePaths && data.filePaths.length > 0 ? (
                                    <button type="button" className="btn-clean ms-auto" data-bs-toggle="modal" data-bs-target="#attachmentsModal">Anexos <FaPaperclip /></button>
                                ) : (<></>)}
                            </div>
                            <div className="chat_content px-2 pb-3">
                                {messages && messages.length > 0 ? (
                                    messages.map((msg) => (
                                        msg.user.id === userData.id ? (
                                            <div key={msg.id} className="mt-3 message-box-sent">
                                                <div className="message-bubble">
                                                    <div className="border-bottom mb-2">
                                                        {msg.user.name}
                                                        <span> - </span>
                                                        {new Date(msg.sent_at).toLocaleDateString('pt-BR')}
                                                    </div>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={msg.id} className="mt-3 message-box-received">
                                                <div className="message-bubble">
                                                    <div className="border-bottom mb-2">
                                                        {msg.user.name}
                                                        <span> - </span>
                                                        {new Date(msg.sent_at).toLocaleDateString('pt-BR')}
                                                    </div>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )
                                    ))
                                ) : (
                                    <p>Envie uma mensagem para iniciar o chamado.</p>
                                )}
                                <div ref={chatEndRef} /> {/* This div is used to scroll to the bottom */}
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
                        <input id="created_at" className="input-text" type="text" value={`${new Date(data?.createdAt).toLocaleDateString('pt-BR') || ''}`} readOnly />
                        <label htmlFor="observation" className="col-form-label">Observação</label>
                        <textarea id="observation" className="input-text" value={`${data?.observation || ''}`} readOnly />
                        <label htmlFor="status" className="col-form-label">Status</label>
                        <input id="status" className="input-text" type="text" value={`${data?.status || ''}`} readOnly />
                        <label htmlFor="urgency" className="col-form-label">Urgência</label>
                        <input id="urgency" className="input-text" type="text" value={`${data?.urgency || ''}`} readOnly />
                    </div>
                </div>
            </div>
            <div className="modal fade" id="attachmentsModal" tabIndex="-1">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id="carouselExample" className="carousel slide">
                                <div className="carousel-inner">
                                    {data.filePaths && data.filePaths.length > 0 ? (
                                        data.filePaths.map((file, index) => (
                                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                                <img src={`${API_BASE_URL}/images/${file}`} className="d-block w-100" />
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhum anexo encontrado.</p>
                                    )}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default TicketDetails;
