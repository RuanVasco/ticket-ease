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
	clearNotifications: (ticketId: number) => void;
	notifications: Record<number, Message[]>;
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
	const [notifications, setNotifications] = useState<Record<number, Message[]>>({});

	useEffect(() => {
		if (!userData?.id || !stompClient || !isConnected) return;
		const subscriptions: any[] = [];

		ticketsId.forEach((ticketId) => {
			const sub = stompClient.subscribe(
				`/topic/ticket/${ticketId}`,
				(message: any) => {
					const newMessage: Message = JSON.parse(message.body);
					const ticketId = newMessage.ticket.id;

					setMessages((prev) => ({
						...prev,
						[ticketId]: [...(prev[ticketId] || []), newMessage],
					}));	
					
					setNotifications((prev) => ({
						...prev,
						[ticketId]: [...(prev[ticketId] || []), newMessage],
					}));					
				}
			);
			subscriptions.push(sub);
		});

		return () => {
			subscriptions.forEach((sub) => sub.unsubscribe());
		};
		
	}, [ticketsId])

	useEffect(() => {
		if (!userData?.id || !stompClient || !isConnected) return;

		const subscriptions: any[] = [];

		const checkConnection = () => {
			if (!stompClient || !isConnected) {
				return;
			}

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
				destination: `/app/user/${userData?.id}/tickets`,
				body: JSON.stringify({}),
			});			

			clearInterval(interval);
		};

		const interval = setInterval(checkConnection, 500);

		return () => {
			clearInterval(interval);
			subscriptions.forEach((sub) => sub.unsubscribe());
		};
	}, [stompClient, isConnected, userData?.id]);

	const sendMessage = (text: string, close: boolean, ticketId: number) => {
		if (stompClient && stompClient.connected) {
			const messageData = { text, closeTicket: close };

			stompClient.publish({
				destination: `/app/ticket/${ticketId}`,
				body: JSON.stringify(messageData),
			});			
		}
	};

	const clearNotifications = (ticketId: number) => {
		setNotifications((prev) => {
			const newNotifications = { ...prev };
			delete newNotifications[ticketId];
			return newNotifications;
		});
	};


	return (
		<MessagesContext.Provider value={{ messages, sendMessage, notifications, clearNotifications }}>
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
