import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Client } from "@stomp/stompjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Message {
    content: string;
}

const useWebSocketConnection = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const userToken = localStorage.getItem("token") ?? "";

        if (!userToken) {
            router.push('/auth/login');
            return;
        }

        const stompClient = new Client({
            brokerURL: `ws://${API_BASE_URL?.replace(/^http/, "ws")}/ws`, 
            connectHeaders: { Authorization: `Bearer ${userToken}` },
            debug: (str) => console.log(str),
            reconnectDelay: 5000, 
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = (frame) => {
            console.log("Conectado: ", frame);

            stompClient.subscribe('/topic/messages', (message) => {
                const newMessage: Message = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        };

        stompClient.onStompError = (frame) => {
            console.error("Erro na conexão STOMP: ", frame.headers.message);
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [router]);

    return messages;
};

export default useWebSocketConnection;
