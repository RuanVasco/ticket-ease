import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "./webSocketContext";
import getUserData from "./getUserData";

interface Message {
    content: string;
}

const useWebSocketConnection = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [tickets, setTickets] = useState<number[]>([]);
    const { stompClient } = useWebSocket();
    const router = useRouter();

    useEffect(() => {
        if (stompClient && tickets.length > 0) {
            console.log("Tickets atualizados:", tickets);

            tickets.forEach((ticketId) => {
                stompClient.subscribe(`/topic/ticket/${ticketId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                    console.log("Mensagem recebida no tópico /topic/ticket/" + ticketId, newMessage);
                });
            });
        }
    }, [tickets, stompClient]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        const userData = getUserData();
        if (!userData) {
            console.error("Dados do usuário não encontrados no token.");
            return;
        }

        const userId = userData.id;
        if (!userId) {
            console.error("userId não encontrado no token.");
            return;
        }

		if (!stompClient || !stompClient.connected) {
			console.error("STOMP client não conectado.");
			return;
   		 }
    

        stompClient.subscribe(`/queue/user/${userId}/tickets`, (message) => {
            const tickets = JSON.parse(message.body);
            setTickets(tickets);
            console.log("Tickets recebidos:", tickets);
        });

        stompClient.publish({
            destination: `/app/user/${userId}/tickets`,
            body: JSON.stringify({}),
        });
    }, [stompClient]);

    return messages;
};

export default useWebSocketConnection;