package com.chamados.api.Components;

import com.chamados.api.DTO.MessageDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;

<<<<<<< HEAD:API/src/main/java/com/chamados/api/Components/WebSocketTicketHandler.java
=======
import java.io.IOException;
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3:API/src/main/java/com/chamados/api/Components/WebSocketMessageHandler.java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketMessageHandler implements WebSocketHandler {

<<<<<<< HEAD:API/src/main/java/com/chamados/api/Components/WebSocketTicketHandler.java
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = extractUserId(session);
        WebSocketSessionManager.addSession(userId, session);
=======
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        sendMessageToClients("Usuário " + session.getId() + " Conectou");
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3:API/src/main/java/com/chamados/api/Components/WebSocketMessageHandler.java
    }

    @Override
    public void handleMessage(WebSocketSession session, org.springframework.web.socket.WebSocketMessage<?> message) throws Exception {
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        session.close(CloseStatus.SERVER_ERROR);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

<<<<<<< HEAD:API/src/main/java/com/chamados/api/Components/WebSocketTicketHandler.java
    public static void sendMessageToUser(Long userId, MessageDTO message) throws Exception {
        WebSocketSession session = WebSocketSessionManager.getSession(String.valueOf(userId));
        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(message.toString()));
        }
    }

    private String extractUserId(WebSocketSession session) {
        System.out.println(session.getUri());
        return session.getUri().getQuery().split("=")[1];
    }
}
=======
    public void sendMessageToClients(String message) throws IOException {
        for (Map.Entry<String, WebSocketSession> entry : sessions.entrySet()) {
            WebSocketSession session = entry.getValue();
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }
}
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3:API/src/main/java/com/chamados/api/Components/WebSocketMessageHandler.java
