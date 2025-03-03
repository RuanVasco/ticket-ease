package com.chamados.api.Components.Config;

import com.chamados.api.Components.WebSocketAuthInterceptor;
import com.chamados.api.Components.WebSocketMessageInterceptor;
import com.chamados.api.Services.TokenService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final TokenService tokenService;
    private final WebSocketMessageInterceptor webSocketMessageInterceptor;

    public WebSocketConfig(TokenService tokenService, WebSocketMessageInterceptor webSocketMessageInterceptor) {
        this.tokenService = tokenService;
        this.webSocketMessageInterceptor = webSocketMessageInterceptor;
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