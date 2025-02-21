package com.chamados.api;

import com.chamados.api.Services.CustomPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.chamados.api.Components.SecurityFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	SecurityFilter securityFilter;

	@Autowired
	private CustomPermissionService customPermissionService;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers
						.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
				)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/validate").permitAll()
						.requestMatchers(HttpMethod.GET, "/permissions/has-permission").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/departments/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_DEPARTMENT')"))
						.requestMatchers(HttpMethod.POST, "/tickets-category/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_TICKET_CATEGORY')"))
						.requestMatchers(HttpMethod.POST, "/units/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_UNIT')"))
						.requestMatchers(HttpMethod.POST, "/tickets/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_TICKET')"))
						.requestMatchers(HttpMethod.POST, "/messages/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_MESSAGE')"))
						.requestMatchers(HttpMethod.POST, "/users/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_USER')"))
						.requestMatchers(HttpMethod.POST, "/cargos/**").access(new WebExpressionAuthorizationManager("hasAuthority('CREATE_CARGO')"))
						.requestMatchers(HttpMethod.PUT, "/cargos/**").access(new WebExpressionAuthorizationManager("hasAuthority('UPDATE_CARGO')"))
						.requestMatchers(HttpMethod.PUT, "/users/**").access(new WebExpressionAuthorizationManager("hasAuthority('UPDATE_USER')"))
						.requestMatchers(HttpMethod.PUT, "/units/**").access(new WebExpressionAuthorizationManager("hasAuthority('UPDATE_UNIT')"))
						.requestMatchers(HttpMethod.DELETE, "/cargos/**").access(new WebExpressionAuthorizationManager("hasAuthority('DELETE_CARGO')"))
						.requestMatchers(HttpMethod.DELETE, "/units/**").access(new WebExpressionAuthorizationManager("hasAuthority('DELETE_UNIT')"))
						.requestMatchers(HttpMethod.DELETE, "/users/**").access(new WebExpressionAuthorizationManager("hasAuthority('DELETE_USER')"))
						.requestMatchers(HttpMethod.GET, "/cargos/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_CARGO')"))
						.requestMatchers(HttpMethod.GET, "/departments/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_DEPARTMENT')"))
						.requestMatchers(HttpMethod.GET, "/units/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_UNIT')"))
						.requestMatchers(HttpMethod.GET, "/tickets-category/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_TICKET_CATEGORY')"))
						.requestMatchers(HttpMethod.GET, "/tickets/user").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_TICKET')"))
						.requestMatchers(HttpMethod.GET, "/tickets/pageable").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_TICKET')"))
						.requestMatchers(HttpMethod.GET, "/messages/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_MESSAGE')"))
						.requestMatchers(HttpMethod.GET, "/users/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_USER')"))
						.requestMatchers(HttpMethod.GET, "/profiles/**").access(new WebExpressionAuthorizationManager("hasAuthority('VIEW_PROFILE')"))
						.requestMatchers(HttpMethod.GET, "/images/**").permitAll()
						.anyRequest().authenticated()
				)
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
