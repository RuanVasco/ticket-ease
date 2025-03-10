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
	const { stompClient, isConnected } = useWebSocket();
	const [messagesWebSocket, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (!ticketId) return;

		let subscription: any = null;

		const checkConnection = () => {
			if (stompClient && isConnected) {
				console.log("WebSocket conectado! Inscrevendo-se no tópico...");

				subscription = stompClient.subscribe(
					`/topic/ticket/${ticketId}`,
					(message) => {
						const newMessage: Message = JSON.parse(message.body);
						setMessages((prev) => [...prev, newMessage]);
						console.log(
							"Mensagem recebida no tópico:",
							`/topic/ticket/${ticketId}`,
							newMessage
						);
					}
				);

				console.log(`Inscrito no tópico: /topic/ticket/${ticketId}`);
				clearInterval(interval);
			}
		};

		const interval = setInterval(checkConnection, 500);

		return () => {
			clearInterval(interval);
			if (subscription) {
				subscription.unsubscribe();
				console.log(
					"Desinscrito do tópico:",
					`/topic/ticket/${ticketId}`
				);
			}
		};
	}, [stompClient, isConnected, ticketId]);

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
};
