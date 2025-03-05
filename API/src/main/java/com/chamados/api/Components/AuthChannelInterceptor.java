package com.chamados.api.Components;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (accessor.getCommand() != null && accessor.getCommand().equals(StompCommand.CONNECT)) {
            String token = accessor.getFirstNativeHeader("Authorization");

            if (token == null || !isValidToken(token)) {
                throw new IllegalArgumentException("Token inválido ou ausente");
            }
        }

        return message;
    }

    private boolean isValidToken(String token) {
        try {
            token = token.replace("Bearer ", "");

            return token.length() > 10;
        } catch (Exception e) {
            return false;
        }
    }
}