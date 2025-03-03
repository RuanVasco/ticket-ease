package com.chamados.api.Components.Config;

import com.chamados.api.Authorizations.GenericAuthorizationManager;
import com.chamados.api.Authorizations.TicketAuthorizationManager;
import com.chamados.api.Components.SecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.messaging.Message;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableWebSocketSecurity
public class SecurityConfig {

	@Autowired
	SecurityFilter securityFilter;

	@Autowired
	private GenericAuthorizationManager departmentAuthorizationManager;

	@Autowired
	private GenericAuthorizationManager unitAuthorizationManager;

	@Autowired
	private GenericAuthorizationManager ticketCategoryAuthorizationManager;

	@Autowired
	private GenericAuthorizationManager userAuthorizationManager;

	@Autowired
	private GenericAuthorizationManager cargoAuthorizationManager;

	@Autowired
	private GenericAuthorizationManager roleAuthorizationManager;

	@Autowired
	private GenericAuthorizationManager messageAuthorizationManager;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers
						.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
				)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/error").permitAll()
						.requestMatchers("/ws/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
						.requestMatchers("/ws/**").permitAll()
						.requestMatchers("/ws").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/validate").permitAll()
						.requestMatchers(HttpMethod.GET, "/permissions/has-permission").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.requestMatchers("/units/**").access(unitAuthorizationManager) //adicionar mensagem de retorno personalizada
						.requestMatchers("/departments/**").access(departmentAuthorizationManager)
						.requestMatchers("/tickets-category/**").access(ticketCategoryAuthorizationManager)
						.requestMatchers("/users/**").access(userAuthorizationManager)
						.requestMatchers("/tickets/**").access(new TicketAuthorizationManager())
						.requestMatchers("/messages/**").access(messageAuthorizationManager)
						.requestMatchers("/cargos/**").access(cargoAuthorizationManager)
						.requestMatchers("/profiles/**").access(roleAuthorizationManager)
						.anyRequest().authenticated()
				)
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	AuthorizationManager<Message<?>> websocketAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
		messages.simpDestMatchers("/**").permitAll();
		return messages.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:3000"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
