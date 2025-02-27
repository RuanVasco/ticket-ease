package com.chamados.api.Components;

import com.chamados.api.DTO.MessageDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketTicketHandler implements WebSocketHandler {

    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = extractUserId(session);
        WebSocketSessionManager.addSession(userId, session);
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
        sessions.remove(session);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

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