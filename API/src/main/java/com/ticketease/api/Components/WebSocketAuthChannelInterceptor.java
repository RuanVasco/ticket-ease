package com.ticketease.api.Components;

import com.nimbusds.jose.JOSEException;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Services.TokenService;
import java.text.ParseException;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

  private final TokenService tokenService;

  public WebSocketAuthChannelInterceptor(TokenService tokenService) {
    this.tokenService = tokenService;
  }

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor =
        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor.getCommand() != null && accessor.getCommand().equals(StompCommand.CONNECT)) {
      String token = accessor.getFirstNativeHeader("Authorization");

      if (token == null || !isValidToken(token)) {
        throw new IllegalArgumentException("Token inválido ou ausente");
      }

      User user;
      try {
        user = tokenService.getUserFromToken(token);
        accessor.setUser(
            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
      } catch (ParseException | JOSEException e) {
        throw new RuntimeException(e);
      }
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
