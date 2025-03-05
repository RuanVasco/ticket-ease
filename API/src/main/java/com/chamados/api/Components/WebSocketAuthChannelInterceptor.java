package com.chamados.api.Components;

import com.chamados.api.Entities.User;
import com.chamados.api.Services.TicketService;
import com.chamados.api.Services.TokenService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.List;

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final TokenService tokenService;
    private final SimpMessagingTemplate messagingTemplate;
    private final TicketService ticketService;

    public WebSocketAuthChannelInterceptor(TokenService tokenService,
                                           @Qualifier("customMessagingTemplate") SimpMessagingTemplate messagingTemplate,
                                           TicketService ticketService) {
        this.tokenService = tokenService;
        this.messagingTemplate = messagingTemplate;
        this.ticketService = ticketService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor.getCommand() != null && accessor.getCommand().equals(StompCommand.CONNECT)) {
            String token = accessor.getFirstNativeHeader("Authorization");

            if (token == null || !isValidToken(token)) {
                throw new IllegalArgumentException("Token inválido ou ausente");
            }

            User user = null;
            try {
                user = tokenService.getUserFromToken(token);
            } catch (ParseException | JOSEException e) {
                throw new RuntimeException(e);
            }

            accessor.setUser(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
        }

        return message;
    }

    private boolean isValidToken(String token) {
        try {
            String isValid = tokenService.validateToken(token.replace("Bearer ", ""));
            if (isValid != null) {
                return true;
            }
        } catch (Exception e) {
            return false;
        }

        return false;
    }
}