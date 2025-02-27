import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Message {
    content: string;
}

const useWebSocketConnection = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const router: AppRouterInstance = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const userToken: string = localStorage.getItem("token") ?? "";

        if (!userToken) {
            router.push('/auth/login');
            return;
        }

        const socket = new SockJS(`${API_BASE_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
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