package com.chamados.api.Components;


import com.chamados.api.Services.TokenService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    public final TokenService tokenService;

    public WebSocketAuthInterceptor(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
<<<<<<< HEAD
    public boolean beforeHandshake(
            org.springframework.http.server.ServerHttpRequest request,
            org.springframework.http.server.ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
//        if (request instanceof ServletServerHttpRequest servletRequest) {
//            HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
//            String token = httpServletRequest.getParameter("userToken");
//
//            if (token == null || !isValidToken(token)) {
//                return false;
//            }
//
//            attributes.put("userToken", token);
//        }
=======
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3
        return true;
    }

    @Override
    public void afterHandshake(
            org.springframework.http.server.ServerHttpRequest request,
            org.springframework.http.server.ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }
}