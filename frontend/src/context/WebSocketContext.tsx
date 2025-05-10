import { Client, IMessage } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState, useRef, ReactNode, useMemo } from "react";

import GetUserData from "../components/GetUserData";
import { Notification } from "../types/Notification";

import { useAuth } from "./AuthContext";
import axiosInstance from "../components/AxiosConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const WS_URL = import.meta.env.VITE_WS_URL as string;

interface WebSocketContextType {
    sendMessage: (text: string, close: boolean, ticketId: string) => void;
    ticketMessages: Record<string, any[]>;
    notifications: Notification[];
    unreadNotifications: number;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userData = GetUserData();
    const userId = userData?.id;
    const { checkAuth } = useAuth();

    const [ticketMessages, setTicketMessages] = useState<Record<string, any[]>>({});
    const [rawNotifications, setRawNotifications] = useState<Notification[]>([]);

    const stompClient = useRef<Client | null>(null);
    const subscribedTickets = useRef(new Set<string>());
    const isConnected = useRef(false);
    const isConnecting = useRef(false);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

    const notifications = useMemo(() => {
        return [...rawNotifications].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [rawNotifications]);

    useEffect(() => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        setUnreadNotifications(unreadCount);
    }, [notifications]);

    useEffect(() => {
        if (!userId || isConnected.current || isConnecting.current) return;

        isConnecting.current = true;
        let client: Client;

        const fetchOldNotifications = async () => {
            try {
                const res = await axiosInstance.get(
                    `${API_BASE_URL}/notifications`
                );

                if (res.status === 200) {
                    setRawNotifications(res.data.map((n: any) =>
                        new Notification(
                            n.id,
                            n.message,
                            n.read,
                            n.type,
                            n.referenceId,
                            new Date(n.createdAt)
                        )
                    ));
                }
            } catch (err) {
                console.error("Erro ao buscar notificações antigas:", err);
            }
        };

        const connectWebSocket = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated || isConnected.current) return;

            const token = localStorage.getItem("token");
            if (!token) return;

            client = new Client({
                brokerURL: WS_URL,
                connectHeaders: { Authorization: `Bearer ${token}` },
                reconnectDelay: 5000,
                heartbeatIncoming: 10000,
                heartbeatOutgoing: 10000,
                onConnect: () => {
                    isConnected.current = true;
                    isConnecting.current = false;

                    client.subscribe("/user/queue/tickets", (message: IMessage) => {
                        const ticketIds: string[] = JSON.parse(message.body);

                        ticketIds.forEach((ticketId) => {
                            if (!subscribedTickets.current.has(ticketId)) {
                                subscribedTickets.current.add(ticketId);
                                client.subscribe(
                                    `/topic/ticket/${ticketId}`,
                                    (ticketMessage: IMessage) => {
                                        const newMessage = JSON.parse(ticketMessage.body);
                                        setTicketMessages((prev) => ({
                                            ...prev,
                                            [ticketId]: [...(prev[ticketId] || []), newMessage],
                                        }));
                                    }
                                );
                            }
                        });
                    });

                    client.subscribe("/user/queue/notifications", (message: IMessage) => {
                        const notification = JSON.parse(message.body);
                        setRawNotifications((prev) => [
                            ...prev,
                            new Notification(
                                notification.id,
                                notification.message,
                                notification.read,
                                notification.type,
                                notification.referenceId,
                                new Date(notification.createdAt)
                            ),
                        ]);
                    });

                    client.publish({ destination: "/app/user/tickets" });
                },
                onDisconnect: () => {
                    isConnected.current = false;
                    isConnecting.current = false;
                    subscribedTickets.current.clear();
                    console.warn("WebSocket desconectado.");

                    setTimeout(() => connectWebSocket(), 1000);
                },
                onStompError: (error) => {
                    isConnected.current = false;
                    isConnecting.current = false;
                    console.error("Erro STOMP:", error);
                },
            });

            stompClient.current = client;
            client.activate();
        };

        fetchOldNotifications();
        connectWebSocket();

        return () => {
            if (stompClient.current?.connected) {
                stompClient.current.deactivate().then(() => {
                    isConnected.current = false;
                    subscribedTickets.current.clear();
                });
            }
        };
    }, [userId, checkAuth]);

    const sendMessage = (text: string, close: boolean, ticketId: string) => {
        if (stompClient.current?.connected) {
            const messageData = { text, closeTicket: close };
            stompClient.current.publish({
                destination: `/app/ticket/${ticketId}`,
                body: JSON.stringify(messageData),
            });
        } else {
            console.error("WebSocket não conectado.");
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await axiosInstance.patch(`${API_BASE_URL}/notifications/${id}/read`);
            setRawNotifications((prev) =>
                prev.map((n) => (Number(n.id) === Number(id) ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Erro ao marcar notificação como lida:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.patch(`${API_BASE_URL}/notifications/mark-all-read`);
            setRawNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error("Erro ao marcar todas como lidas:", err);
        }
    };

    return (
        <WebSocketContext.Provider value={{
            sendMessage, ticketMessages, notifications, unreadNotifications, markAsRead, markAllAsRead
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket deve ser usado dentro de um WebSocketProvider");
    }
    return context;
};
