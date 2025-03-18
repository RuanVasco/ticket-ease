import { Client, IMessage } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import GetUserData from "../components/GetUserData";
import { useAuth } from "./AuthContext";

const WS_URL = import.meta.env.VITE_WS_URL as string;

interface WebSocketContextType {
    sendMessage: (text: string, close: boolean, ticketId: string) => void;
    ticketMessages: Record<string, any[]>;
    ticketNotifications: string[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userData = GetUserData();
    const userId = userData?.id;
    const { checkAuth } = useAuth();
    const [ticketMessages, setTicketMessages] = useState<Record<string, any[]>>({});
    const [ticketNotifications, setTicketNotifications] = useState<string[]>([]);
    const stompClient = useRef<Client | null>(null);
    const subscribedTickets = useRef(new Set<string>());
    const isConnected = useRef(false);

    useEffect(() => {
        const connectWebSocket = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated || !userId) return;

            if (isConnected.current && stompClient.current?.connected) return;
            isConnected.current = true;

            const token = localStorage.getItem("token");
            if (!token) return;

            const client = new Client({
                brokerURL: WS_URL,
                connectHeaders: { Authorization: `Bearer ${token}` },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log("✅ Conectado ao WebSocket!");

                    client.subscribe(`/queue/user/${userId}/tickets`, (message: IMessage) => {
                        const ticketIds: string[] = JSON.parse(message.body);
                        setTicketNotifications(ticketIds);

                        ticketIds.forEach((ticketId) => {
                            if (!subscribedTickets.current.has(ticketId)) {
                                subscribedTickets.current.add(ticketId);
                                client.subscribe(`/topic/ticket/${ticketId}`, (ticketMessage: IMessage) => {
                                    const newMessage = JSON.parse(ticketMessage.body);
                                    setTicketMessages((prev) => ({
                                        ...prev,
                                        [ticketId]: [...(prev[ticketId] || []), newMessage],
                                    }));
                                });
                            }
                        });
                    });

                    client.publish({
                        destination: `/app/user/${userId}/tickets`,
                        body: JSON.stringify({ userId }),
                    });

                    client.subscribe(`/user/queue/notifications`, (notification: IMessage) => {
                        console.log(notification);
                    });
                },
                onDisconnect: () => {
                    isConnected.current = false;
                    console.warn("⚠️ WebSocket desconectado. Tentando reconectar...");
                },
                onStompError: (error) => {
                    console.error("❌ Erro WebSocket:", error);
                    isConnected.current = false;
                },
            });

            stompClient.current = client;
            client.activate();

            return () => {
                if (stompClient.current) {
                    stompClient.current.deactivate().then(() => {
                        isConnected.current = false;
                    }).catch((err) => {
                        console.error("❌ Erro ao fechar WebSocket:", err);
                    });
                }
            };
        };

        connectWebSocket();
    }, [userId, checkAuth]);

    const sendMessage = (text: string, close: boolean, ticketId: string) => {
        if (stompClient.current?.connected) {
            const messageData = { text, closeTicket: close };
            stompClient.current.publish({
                destination: `/app/ticket/${ticketId}`,
                body: JSON.stringify(messageData),
            });
        } else {
            console.error("⚠️ WebSocket não conectado.");
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, ticketMessages, ticketNotifications }}>
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
