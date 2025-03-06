import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import getUserData from "./getUserData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const WebSocketContext = createContext<Client | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
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

        const client = new Client({
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
                        client.connectHeaders = {
                            Authorization: `Bearer ${token}`,
                        };
                    }
                    resolve();
                });
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client.connected) {
                client.deactivate();
                console.log("WebSocket desconectado.");
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={stompClient} >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const stompClient = useContext(WebSocketContext);
    return stompClient;
};

export default WebSocketProvider;
