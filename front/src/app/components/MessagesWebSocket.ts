import { useEffect, useState } from "react";
import { useWebSocket } from "./webSocketContext";

interface Message {
    id: number;
    text: string;
    user: {
        id: number;
        name: string;
        phone: string;
        email: string;
        cargo: string;
    };
    ticket: {
        id: number;
        name: string;
    };
    sentAt: Date;
}

export const useWebSocketMessages = (ticketId: number) => {
    const { stompClient } = useWebSocket();
    const [messagesWebSocket, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!stompClient || !ticketId) return;

        if (!stompClient.connected) {
            console.log("STOMP client não está conectado.");
            return;
        }

        const subscription = stompClient.subscribe(`/topic/ticket/${ticketId}`, (message) => {
            const newMessage: Message = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
            console.log("Mensagem recebida no tópico:", `/topic/ticket/${ticketId}`, newMessage);
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log("Desinscrito do tópico:", `/topic/ticket/${ticketId}`);
            }
        };
    }, [stompClient, ticketId]);

    const sendMessage = (text: string, close: boolean, ticketId: number) => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/ticket/${ticketId}`,
                body: JSON.stringify({
                    text: text,
                    closeTicket: close,
                }),
            });
        }
    };

    return { messagesWebSocket, sendMessage };
}