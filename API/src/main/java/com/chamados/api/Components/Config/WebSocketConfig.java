package com.chamados.api.Components.Config;

import com.chamados.api.Components.WebSocketAuthInterceptor;
<<<<<<< HEAD
import com.chamados.api.Components.WebSocketTicketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
=======
import com.chamados.api.Components.WebSocketMessageInterceptor;
import com.chamados.api.Services.TokenService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

<<<<<<< HEAD
    private final WebSocketTicketHandler webSocketHandler;

    public WebSocketConfig(WebSocketTicketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
=======
    private final TokenService tokenService;
    private final WebSocketMessageInterceptor webSocketMessageInterceptor;

    public WebSocketConfig(TokenService tokenService, WebSocketMessageInterceptor webSocketMessageInterceptor) {
        this.tokenService = tokenService;
        this.webSocketMessageInterceptor = webSocketMessageInterceptor;
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .addInterceptors(new WebSocketAuthInterceptor(tokenService))
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketMessageInterceptor);
    }
}