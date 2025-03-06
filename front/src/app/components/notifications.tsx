import { useEffect } from "react";
import useWebSocketConnection from "./webSocketConnection";

const Notifications = () => {
    const messages = useWebSocketConnection();

    useEffect(() => {
        if (messages.length > 0) {
            console.log("Nova notificação:", messages[messages.length - 1]);
        }
    }, [messages]);    
};

export default Notifications;
