import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}

		const stompClient = new Client({
			brokerURL: `${API_BASE_URL?.replace(/^http/, "ws")}/ws`,
			connectHeaders: {
				Authorization: `Bearer ${token}`,
			},
			debug: (str) => console.log(str),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			beforeConnect: () => {
				return new Promise<void>((resolve) => {
					if (token) {
						stompClient.connectHeaders = {
							Authorization: `Bearer ${token}`,
						};
					}
					resolve();
				});
			},
		});

		stompClient.onConnect = function (frame) {
			console.log("Conectado ao WebSocket!");

			stompClient.subscribe("/topic/tickets", function (message) {
				console.log("Tickets recebidos:", JSON.parse(message.body));
			});
		};

		stompClient.onStompError = function (frame) {
			console.error("Erro no STOMP: " + frame.headers["message"]);
			console.error("Detalhes: " + frame.body);
		};

		stompClient.activate();

		return () => {
			if (stompClient.connected) {
				stompClient.deactivate();
				console.log("WebSocket desconectado.");
			}
		};
	}, [router]);

	return messages;
};

export default useWebSocketConnection;
