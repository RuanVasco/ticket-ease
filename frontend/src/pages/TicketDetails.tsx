import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { BsSendCheck, BsSend } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa6";
import { useParams } from "react-router-dom";

import axiosInstance from "../components/AxiosConfig";
import DateFormatter from "../components/Util/DateFormatter";
import getUserData from "../components/GetUserData";
import { usePermissions } from "../context/PermissionsContext";
import { useWebSocket } from "../context/WebSocketContext";
import "../assets/styles/ticket_details.css";
import { Ticket } from "../types/Ticket";
import { Message } from "../types/Message";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { ticketMessages, sendMessage } = useWebSocket();
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const userData = getUserData();
    const [ticket, setTicket] = useState<Ticket>({} as Ticket);
    const [oldMessages, setOldMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<{ text: string; closeTicket: boolean }>({
        text: "",
        closeTicket: false,
    });
    const [loading, setLoading] = useState(true);
    const [isManager, setIsManager] = useState(false);

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;

    const getFirstName = (fullName: string) => fullName.split(" ")[0];
    const { hasPermission } = usePermissions();

    const loadOlderMessages = async () => {
        if (!hasMore) return;

        try {
            const response = await axiosInstance.get(
                `${API_BASE_URL}/messages/ticket/${id}?page=${page}&size=${pageSize}&sort=sentAt`
            );

            if (response.status === 200 || response.status === 201) {
                setOldMessages((prevMessages) => [...response.data.content, ...prevMessages]);
                setPage((prevPage) => prevPage + 1);
                setHasMore(!response.data.last);
            }
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop === 0 && hasMore) {
            loadOlderMessages();
        }
    };

    useEffect(() => {
        const allIncomingMessages = Array.isArray(ticketMessages)
            ? ticketMessages
            : Object.values(ticketMessages).flat();

        const currentTicketMessages = allIncomingMessages.filter(
            (message) => Number(message.ticket.id) === Number(id)
        );

        const combinedMessages = [...oldMessages, ...currentTicketMessages];

        const deduplicatedMessages = Array.from(
            new Map(combinedMessages.map((msg) => [msg.id, msg])).values()
        );

        deduplicatedMessages.sort(
            (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );

        setAllMessages(deduplicatedMessages);
    }, [oldMessages, ticketMessages, id]);

    useEffect(() => {
        const checkUserPermission = async () => {
            const isManager = hasPermission("MANAGE_TICKET");
            setIsManager(isManager);
        };

        checkUserPermission();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/ticket/${id}`);
                setTicket(response.data);
            } catch (error: any) {
                if (error.response?.status === 403) {
                    toast.error("Sem permissão para acessar esse ticket.")
                    window.location.href = "../../";
                } else {
                    console.error("Erro ao buscar dados:", error);
                }
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
            if (!id) {
                console.error("ticketId não está definido.");
                return;
            }

            try {
                setOldMessages([]);
                setPage(0);
                setHasMore(true);
                loadOlderMessages();
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            }
        };

        fetchMessages();
        return () => { };
    }, [id]);

    useEffect(() => {
        if (allMessages.length === 0) return;

        const chatContainer = chatEndRef.current?.parentNode as HTMLDivElement;
        if (!chatContainer) return;

        const isAtBottom =
            chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;

        if (!isAtBottom) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setMessage((prevMessage) => ({
            ...prevMessage,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.text.trim() === "" || !id) return;

        const submitEvent = e.nativeEvent as SubmitEvent;
        const submitter = submitEvent.submitter as HTMLButtonElement;
        const close = submitter?.name === "close";

        sendMessage(message.text, close, id);
        setMessage({ ...message, text: "" });
    };

    if (loading) {
        return <></>;
    }

    return (
        <main>
            <div className="container">
                <div className="row mt-3">
                    <div className="col-9">
                        <div className="d-flex flex-column">
                            <div className="box_description p-2 rounded mb-2 d-flex">
                                <div className="fw-semibold">
                                    Ticket {ticket.id} - {ticket.form.title || ""}
                                </div>
                                {/* {data?.filePaths && data.filePaths.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn-clean ms-auto"
                                        data-bs-toggle="modal"
                                        data-bs-target="#attachmentsModal"
                                    >
                                        Anexos <FaPaperclip />
                                    </button>
                                )} */}
                            </div>
                            <div className="chat_content rounded px-2 pb-3" onScroll={handleScroll}>
                                {allMessages.length > 0 ? (
                                    allMessages.map((msg) =>
                                        Number(msg.user.id) === Number(userData?.id) ? (
                                            <div key={msg.id} className="mt-3 message-box-sent">
                                                <div className="message-bubble">
                                                    <div className="box_message_details mb-2">
                                                        {getFirstName(msg.user.name)}
                                                        <span> - </span>
                                                        {DateFormatter(msg.sentAt)}
                                                    </div>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={msg.id} className="mt-3 message-box-received">
                                                <div className="message-bubble">
                                                    <div className="box_message_details mb-2">
                                                        {getFirstName(msg.user.name)}
                                                        <span> - </span>
                                                        {DateFormatter(msg.sentAt)}
                                                    </div>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : isManager ? (
                                    <p>Envie uma mensagem para iniciar o chamado.</p>
                                ) : null}
                                <div ref={chatEndRef} />
                            </div>
                            {ticket.properties.status !== "Fechado" && (
                                <form className="mt-3 input-group" onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        className="input-text form-control"
                                        name="text"
                                        value={message.text}
                                        onChange={handleInputChange}
                                        placeholder="Digite sua mensagem..."
                                    />
                                    <button type="submit" className="btn_send_message">
                                        Enviar
                                        <BsSend className="ms-2" />
                                    </button>
                                    {isManager && (
                                        <div className="dropup">
                                            <button
                                                type="button"
                                                className="btn_send_message_dropdown_togle dropdown-toggle dropdown-toggle-split"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            ></button>
                                            <ul className="dropdown-menu dropdown_options_message dropdown-menu-end ">
                                                <li>
                                                    <button
                                                        className="dropdown-item"
                                                        type="submit"
                                                        name="close"
                                                    >
                                                        Enviar e finalizar chamado
                                                        <BsSendCheck className="ms-2" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                    <div className="col col_ticket_info">
                        <span>Por </span>
                        <br />
                        <div className="box_user_identity rounded p-2 mt-2">
                            <span>{ticket.properties.user.name || ""}</span> <br />
                            <span className="fw-lighter">{ticket.properties.user.cargo?.name || ""}</span>{" "}
                            <br />
                        </div>
                        {/* <label htmlFor="user" className="col-form-label">
                            Setor
                        </label>
                        <input
                            id="user"
                            className="input-text"
                            type="text"
                            value={data?.user?.department?.name || ""}
                            readOnly
                        /> */}
                        <label htmlFor="department" className="col-form-label">
                            Categoria
                        </label>
                        <input
                            id="department"
                            className="input-text"
                            type="text"
                            value={ticket.form.ticketCategory.name || ""}
                            readOnly
                        />
                        <label htmlFor="created_at" className="col-form-label">
                            Data de Abertura
                        </label>
                        <input
                            id="created_at"
                            className="input-text"
                            type="text"
                            value={ticket.properties.createdAt ? DateFormatter(ticket.properties.createdAt) : ""}
                            readOnly
                        />
                        <label htmlFor="urgency" className="col-form-label">
                            Urgência
                        </label>
                        <input
                            id="urgency"
                            className="input-text"
                            type="text"
                            value={ticket.properties.urgency || ""}
                            readOnly
                        />
                        <label htmlFor="status" className="col-form-label">
                            Status
                        </label>
                        <input
                            id="status"
                            className="input-text"
                            type="text"
                            value={ticket.properties.status || ""}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TicketDetails;
