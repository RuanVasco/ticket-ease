package com.chamados.api.Components.Config;

import com.chamados.api.Components.WebSocketAuthInterceptor;
import com.chamados.api.Services.TokenService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;
    private final TokenService tokenService;

    public WebSocketConfig(WebSocketHandler webSocketHandler, TokenService tokenService) {
        this.webSocketHandler = webSocketHandler;
        this.tokenService = tokenService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws")
                .addInterceptors(new WebSocketAuthInterceptor(tokenService))
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }
}
