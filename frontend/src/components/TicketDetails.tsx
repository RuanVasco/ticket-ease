import { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Ticket } from "../types/Ticket";
import axiosInstance from "./AxiosConfig";
import { toast } from "react-toastify";
import DateFormatter from "./Util/DateFormatter";
import getUserData from "../components/GetUserData";
import "../assets/styles/pages/_ticketdetails.scss";
import { StatusEnum, StatusLabels } from "../enums/StatusEnum";
import { BsSend, BsSendCheck } from "react-icons/bs";
import { Message } from "../types/Message";
import { useWebSocket } from "../context/WebSocketContext";
import { usePermissions } from "../context/PermissionsContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface TicketDetailProps {
    selectedTicketId: Number;
    setSelectedTicket: (ticketId: Number | null) => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({
    selectedTicketId,
    setSelectedTicket
}) => {
    const { ticketMessages, sendMessage } = useWebSocket();
    const { hasPermission } = usePermissions();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [currentTab, setCurrentTab] = useState<string>("details");
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;
    const userData = getUserData();
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isManager, setIsManager] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [attachments, setAttachments] = useState<{
        fieldId: number;
        label: string;
        attachmentsNames: string[];
    }[]>([]);

    const getFirstName = (fullName: string) => fullName.split(" ")[0];

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/ticket/${selectedTicketId}`);
            setTicket(response.data);
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error("Sem permissão para acessar esse ticket.");
                window.location.href = "../../";
            } else {
                console.error("Erro ao buscar dados:", error);
            }
        }
    };

    const checkUserPermission = async () => {
        const isManager = hasPermission("MANAGE_TICKET");
        setIsManager(isManager);
    };

    const collectAttachments = () => {
        if (!ticket) return;

        if (ticket.responses) {
            const fileResponses = ticket.responses.filter(
                (resp) => resp.field.type === "FILE" || resp.field.type === "FILE_MULTIPLE"
            );

            const fieldsMap: {
                [fieldId: number]: {
                    fieldId: number;
                    label: string;
                    attachmentsNames: string[];
                };
            } = {};

            fileResponses.forEach((resp) => {
                const fieldId = Number(resp.field.id);
                if (!fieldsMap[fieldId]) {
                    fieldsMap[fieldId] = {
                        fieldId,
                        label: resp.field.label,
                        attachmentsNames: [],
                    };
                }
                fieldsMap[fieldId].attachmentsNames.push(resp.value);
            });

            const formattedFiles = Object.values(fieldsMap);
            setAttachments(formattedFiles);
        }
    }

    const scrollToEnd = (behavior: ScrollBehavior = "smooth") => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior });
        }, 100);
    };

    const getMessages = async (prepend: boolean = false) => {
        if (!ticket) return;
        if (!hasMore) return;

        try {
            const response = await axiosInstance.get(
                `${API_BASE_URL}/messages/ticket/${selectedTicketId}?page=${page}&size=${pageSize}&sort=sentAt,desc`
            );

            if (response.status === 200 || response.status === 201) {
                const newMessages = response.data.content.reverse();
                setMessages(prevMessages => {
                    const allMessages = prepend
                        ? [...newMessages, ...prevMessages]
                        : [...prevMessages, ...newMessages];

                    const deduplicated = Array.from(
                        new Map(allMessages.map((msg) => [msg.id, msg])).values()
                    );

                    deduplicated.sort(
                        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
                    );

                    return deduplicated;
                });
                setPage(prevPage => prevPage + 1);
                setHasMore(!response.data.last);
            }
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchData();
        checkUserPermission();
    }, [selectedTicketId]);

    useEffect(() => {
        if (ticket) {
            collectAttachments();
            getMessages().then(() => {
                scrollToEnd();
            });
        }
    }, [ticket?.responses]);

    useEffect(() => {
        if (!ticketMessages) return;

        const allIncomingMessages = Array.isArray(ticketMessages)
            ? ticketMessages
            : Object.values(ticketMessages).flat();

        const currentTicketMessages = allIncomingMessages.filter(
            (message) => Number(message.ticket.id) === Number(selectedTicketId)
        );

        setMessages((prevMessages) => {
            const combinedMessages = [...prevMessages, ...currentTicketMessages];

            const deduplicatedMessages = Array.from(
                new Map(combinedMessages.map((msg) => [msg.id, msg])).values()
            );

            deduplicatedMessages.sort(
                (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            return deduplicatedMessages;
        });
    }, [ticketMessages, selectedTicketId]);

    const handleSubmit = (action: string | null) => {
        if (!ticket) {
            return
        }

        if (message.trim() === "") {
            return;
        }

        if (ticket?.properties.status !== undefined &&
            [StatusEnum.CLOSED, StatusEnum.CANCELED].includes(ticket.properties.status)) {
            toast.error("Chamado fechado ou cancelado. Não é possível enviar mensagens.");
            return;
        }

        let closeTicket = false;
        if (action === "close") {
            closeTicket = true;
        }

        sendMessage(message, closeTicket, selectedTicketId.toString());
        setMessage("");

        if (ticket.properties.status === StatusEnum.RESOLVED) {
            ticket.properties.status = StatusEnum.IN_PROGRESS;
        }

        if (closeTicket) {
            ticket.properties.status = StatusEnum.RESOLVED;
        }

        if (ticket.properties.status === StatusEnum.NEW) {
            ticket.properties.status = StatusEnum.IN_PROGRESS;
        }

        scrollToEnd();
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop === 0 && hasMore) {
            const previousScrollHeight = chatBoxRef.current?.scrollHeight || 0;
            const previousScrollTop = chatBoxRef.current?.scrollTop || 0;

            getMessages(true).then(() => {
                setTimeout(() => {
                    const newScrollHeight = chatBoxRef.current?.scrollHeight || 0;
                    const heightDiff = newScrollHeight - previousScrollHeight;

                    if (chatBoxRef.current) {
                        chatBoxRef.current.scrollTop = previousScrollTop + heightDiff;
                    }
                }, 0);
            });
        }
    };

    if (!ticket) {
        return <></>
    }

    return (
        <main className="container-fluid">
            <div className="d-flex align-items-center justify-content-between mt-3 mb-4 floating-box ticket_header">
                <div style={{ width: "120px" }}>
                    <button className="btn_primary" onClick={() => setSelectedTicket(null)}>
                        <FaArrowLeft />
                        <span className="ms-2">Voltar</span>
                    </button>
                </div>

                <div className="text-center flex-grow-1">
                    <span className="fw-bold ticket_title">
                        Ticket #{ticket.id} - {ticket.form.title}
                    </span>
                </div>

                <div style={{ width: "120px" }}></div>
            </div>

            <section className="row g-3">
                <div className="col-8">
                    <div className="floating-box p-4">
                        {ticket.properties.status === StatusEnum.RESOLVED && (
                            <div className="hint">
                                Chamado resolvido. Envie uma mensagem para recusar a resolução.
                            </div>
                        )}
                        {isManager && messages.length === 0 && !loadingMessages && (
                            <div className="hint">
                                Envie uma mensagem para iniciar o chamado.
                            </div>
                        )}
                        <div ref={chatBoxRef} className="chat_box d-flex flex-column gap-3" onScroll={handleScroll}>
                            {loadingMessages && (
                                <></>
                            )}
                            {messages.length > 0 ? (
                                messages.map((msg) =>
                                    Number(msg.user.id) === Number(userData?.id) ? (
                                        <div key={msg.id} className="message-box sent">
                                            {msg.id}
                                            <div className="message-bubble">
                                                <div className="mb-2 message-header">
                                                    {getFirstName(msg.user.name)}
                                                    <span> - </span>
                                                    {DateFormatter(msg.sentAt)}
                                                </div>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={msg.id} className="message-box received">
                                            {msg.id}
                                            <div className="message-bubble">
                                                <div className="mb-2 message-header">
                                                    {getFirstName(msg.user.name)}
                                                    <span> - </span>
                                                    {DateFormatter(msg.sentAt)}
                                                </div>
                                                {msg.text}
                                            </div>
                                        </div>
                                    )
                                )
                            ) : (<></>)}
                            <div ref={chatEndRef} />
                        </div>
                        {ticket.properties.status !== undefined && (
                            <>
                                {![StatusEnum.CLOSED, StatusEnum.CANCELED].includes(ticket.properties.status) && (
                                    <div className="mt-3 py-2 chat_input">
                                        <textarea
                                            className="input_text"
                                            name="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Digite sua mensagem..."
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmit(null);
                                                }
                                            }}
                                        />
                                        {ticket.properties.status === StatusEnum.RESOLVED ? (
                                            <button className="btn_send_reopen" onClick={() => handleSubmit("reopen")}>
                                                Recusar solução
                                                <BsSend className="ms-2" />
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn_send_message btn_send" onClick={() => handleSubmit(null)}>
                                                    Enviar
                                                    <BsSend className="ms-2" />
                                                </button>
                                                {isManager && (
                                                    <div className="dropup">
                                                        <button
                                                            type="button"
                                                            className="btn_send_message_dropdown_togle dropdown-toggle dropdown-toggle-split btn_toggle"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        ></button>
                                                        <ul className="dropdown-menu dropdown_options_message dropdown-menu-end">
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    name="close"
                                                                    onClick={() => handleSubmit("close")}
                                                                >
                                                                    Enviar e solucionar chamado
                                                                    <BsSendCheck className="ms-2" />
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                    </div>
                                )}
                            </>
                        )}

                        {/**
                             * TODO: Show message if ticket is closed or canceled and if the ticket is resolved, two buttons to reopen or accept the solution.
                             */}
                    </div>
                </div>
                <div className="col-4">
                    <div className="h-100">
                        <ul className="ticket_tabs">
                            <li>
                                <button
                                    className={`${currentTab === "details" ? "active" : ""}`}
                                    onClick={() => setCurrentTab("details")}
                                >
                                    Detalhes
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`${currentTab === "responses" ? "active" : ""}`}
                                    onClick={() => setCurrentTab("responses")}
                                >
                                    Respostas
                                </button>
                            </li>
                        </ul>
                        <div className="floating-box tab_content pt-3">
                            {currentTab === "details" ? (
                                <table className="ticket_details_table">
                                    <tbody>
                                        <tr>
                                            <td>Requisitante</td>
                                            <td>{ticket.properties.user?.name}</td>
                                        </tr>
                                        {ticket.properties.observers.length > 0 && (
                                            <tr>
                                                <td>Observadores</td>
                                                <td className="d-flex flex-column ps-3">
                                                    {ticket.properties.observers.map((observer, index) => (
                                                        <span key={index}>- {observer.name || ""}</span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td>Abertura</td>
                                            <td>{ticket.properties.createdAt
                                                ? DateFormatter(ticket.properties.createdAt)
                                                : ""}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Última atualização</td>
                                            <td>{ticket.properties.updatedAt
                                                ? DateFormatter(ticket.properties.updatedAt)
                                                : ""}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>{ticket.properties.status ? StatusLabels[ticket.properties.status] : "Status desconhecido"}</td>
                                        </tr>
                                        <tr>
                                            <td>Urgência</td>
                                            <td>{ticket.properties.urgency}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <table className="ticket_details_table">
                                    {ticket.responses?.length > 0 ? (
                                        <tbody>
                                            {ticket.responses.map((resp, index) => (
                                                resp.field.type != "FILE" && resp.field.type != "FILE_MULTIPLE" && (
                                                    <tr key={index}>
                                                        <td>{resp.field.label}</td>
                                                        <td>{resp.value}</td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    ) : (
                                        <span>Nenhuma resposta preenchida.</span>
                                    )}
                                    {attachments.length > 0 && (
                                        <tbody>
                                            {attachments.map((field) => (
                                                <tr key={field.fieldId}>
                                                    <td>{field.label}</td>
                                                    <td>
                                                        <ul>
                                                            {field.attachmentsNames.map((fileName, i) => (
                                                                <li key={i}>
                                                                    <a href={`${API_BASE_URL}/ticket/${ticket.id}/attachments/${fileName}`} target="_blank" rel="noreferrer">
                                                                        {fileName}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TicketDetail;
