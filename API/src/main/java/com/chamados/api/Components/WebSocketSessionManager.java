package com.chamados.api.Components;

import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebSocketSessionManager {
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public static void addSession(String userId, WebSocketSession session) {
        sessions.put(userId, session);
    }

    public static void removeSession(String userId) {
        sessions.remove(userId);
    }

    public static WebSocketSession getSession(String userId) {
        return sessions.get(userId);
    }

    public static Map<String, WebSocketSession> getAllSessions() {
        return sessions;
    }
}
