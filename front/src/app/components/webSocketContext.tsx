import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { Client } from "@stomp/stompjs";
import getUserData from "./getUserData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface WebSocketContextType {
	stompClient: Client | null;
	isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
	stompClient: null,
	isConnected: false,
});

interface WebSocketProviderProps {
	children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const [stompClient, setStompClient] = useState<Client | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.error("Token não encontrado no localStorage.");
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

		const client = new Client({
			brokerURL: `${API_BASE_URL?.replace(/^http/, "ws")}/ws`,
			connectHeaders: {
				Authorization: `Bearer ${token}`,
			},
			debug: (str) => console.log(str),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		client.onConnect = function (frame) {
			console.log("Conectado ao WebSocket!");
			setIsConnected(true);
		};

		client.onStompError = function (frame) {
			console.error("Erro no STOMP: " + frame.headers["message"]);
			console.error("Detalhes: " + frame.body);
		};

		client.activate();
		setStompClient(client);

		return () => {
			if (client.connected) {
				client.deactivate();
				setIsConnected(false);
				console.log("WebSocket desconectado.");
			}
		};
	}, []);

	return (
		<WebSocketContext.Provider value={{ stompClient, isConnected }}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error(
			"useWebSocket deve ser usado dentro de um WebSocketProvider"
		);
	}
	return context;
};
