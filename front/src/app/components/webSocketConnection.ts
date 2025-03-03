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

		const userToken = localStorage.getItem("token") ?? "";

		if (!userToken) {
			return;
		}

		const stompClient = new Client({
			brokerURL: `${API_BASE_URL?.replace(/^http/, "ws")}/ws`,
			connectHeaders: {
				Authorization: `Bearer ${userToken}`,
			},
			debug: (str) => console.log(str),
			reconnectDelay: 2000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		(stompClient.beforeConnect = () => {
			const token = localStorage.getItem("token");

			if (token) {
				stompClient.connectHeaders = {
					Authorization: `Bearer ${token}`,
				};
			}
			console.log("Tentando conectar com o token JWT...");
			return new Promise<void>((resolve) => {
				resolve();
			});
		}),
			(stompClient.onConnect = (frame) => {
				console.log("Conectado: ", frame);
			});

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
