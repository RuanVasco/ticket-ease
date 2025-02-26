import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Message {
    content: string;
}

const webSocketConnection = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const router: AppRouterInstance = useRouter();

    useEffect(() => {
        const userToken: string = localStorage.getItem("token") ?? "";

        if (userToken === "") {
            router.push('/auth/login');
        }

        const socket = new WebSocket(`ws://${API_BASE_URL}/ws?userToken=${userToken}`);

        socket.onopen = () => {
            console.log("Conectado ao WebSocket");
        };

        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prev) => [...prev, newMessage]);
        };

        socket.onclose = () => {
            console.log("WebSocket desconectado");
        };

        return () => {
            socket.close();
        };
    }, []);

    return messages;
};

export default webSocketConnection;
