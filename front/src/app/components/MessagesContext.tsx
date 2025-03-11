import { useEffect, useState, useContext, createContext } from "react";
import { useWebSocket } from "./webSocketContext";
import getUserData from "./getUserData";

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

interface MessagesContextType {
	messages: Record<number, Message[]>;
	sendMessage: (text: string, close: boolean, ticketId: number) => void;
}
const MessagesContext = createContext<MessagesContextType | undefined>(
	undefined
);

export const MessagesProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { stompClient, isConnected } = useWebSocket();
	const userData = getUserData();
	const [ticketsId, setTicketsId] = useState<number[]>([]);
	const [messages, setMessages] = useState<Record<number, Message[]>>({});

	useEffect(() => {
		if (!userData?.id) return;

		const subscriptions: any[] = [];

		const checkConnection = () => {
			if (!stompClient || !isConnected) {
				console.log("Esperando conexão STOMP...");
				return;
			}

			console.log("WebSocket conectado! Inscrevendo-se nos tópicos...");

			Object.keys(messages).forEach((ticketId) => {
				const sub = stompClient.subscribe(
					`/topic/ticket/${ticketId}`,
					(message: any) => {
						const newMessage: Message = JSON.parse(message.body);
						const ticketId = newMessage.ticket.id;

						setMessages((prev) => ({
							...prev,
							[ticketId]: [...(prev[ticketId] || []), newMessage],
						}));

						new Notification("Nova mensagem", {
							body: `${newMessage.user.name}: ${newMessage.text}`,
						});
					}
				);
				subscriptions.push(sub);
			});

			stompClient.subscribe(
				`/queue/user/${userData?.id}/tickets`,
				(message: any) => {
					const parsedMessage = JSON.parse(message.body);
					if (Array.isArray(parsedMessage)) {
						setTicketsId((prev) => [
							...Array.from(new Set([...prev, ...parsedMessage])),
						]);
					}
				}
			);

			stompClient.publish({
				destination: `/user/${userData?.id}/tickets`,
				body: JSON.stringify({}),
			});

			clearInterval(interval);
		};

		const interval = setInterval(checkConnection, 500);

		return () => {
			clearInterval(interval);
			subscriptions.forEach((sub) => sub.unsubscribe());
			console.log("Desinscrito de todos os tópicos.");
		};
	}, [stompClient, isConnected, userData?.id]);

	const sendMessage = (text: string, close: boolean, ticketId: number) => {
		if (stompClient && stompClient.connected) {
			const messageData = { text, closeTicket: close };

			stompClient.publish({
				destination: `/app/ticket/${ticketId}`,
				body: JSON.stringify(messageData),
			});

			setMessages((prev) => ({
				...prev,
				[ticketId]: [
					...(prev[ticketId] || []),
					{
						...messageData,
						id: Date.now(),
						ticket: { id: ticketId, name: "Ticket" },
						user: {
							id: 1,
							name: "Você",
							phone: "",
							email: "",
							cargo: "",
						},
						sentAt: new Date(),
					},
				],
			}));
		}
	};

	return (
		<MessagesContext.Provider value={{ messages, sendMessage }}>
			{children}
		</MessagesContext.Provider>
	);
};

export const useMessages = () => {
	const context = useContext(MessagesContext);
	if (!context) {
		throw new Error(
			"useMessages deve ser usado dentro de MessagesProvider"
		);
	}
	return context;
};
