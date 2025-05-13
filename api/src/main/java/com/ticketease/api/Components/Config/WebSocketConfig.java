package com.ticketease.api.Components.Config;

import com.ticketease.api.Components.WebSocketAuthChannelInterceptor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final WebSocketAuthChannelInterceptor webSocketAuthChannelInterceptor;

	@Value("${cors.allowed-origins:http://localhost:5173}")
	private String corsOrigins;

	public WebSocketConfig(WebSocketAuthChannelInterceptor webSocketAuthChannelInterceptor) {
		this.webSocketAuthChannelInterceptor = webSocketAuthChannelInterceptor;
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		String[] origins = corsOrigins.split(",");
		registry.addEndpoint("/ws").setAllowedOrigins(origins);
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/topic", "/queue");
		registry.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(webSocketAuthChannelInterceptor);
	}

	@Bean
	AuthorizationManager<Message<?>> webSocketMessageAuthorizationManager() {
		return MessageMatcherDelegatingAuthorizationManager.builder()
				.simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.DISCONNECT, SimpMessageType.OTHER)
				.permitAll().simpDestMatchers("/topic/**", "/queue/**", "/app/**").permitAll().anyMessage()
				.authenticated().build();
	}

	@Bean
	public ChannelInterceptor csrfChannelInterceptor() {
		return new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				if (SimpMessageType.CONNECT.equals(StompHeaderAccessor.wrap(message).getMessageType())) {
					return message;
				}
				return message;
			}
		};
	}
}
