package com.ticketease.api.Components.Config;

import com.ticketease.api.Components.SecurityFilter;
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
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableWebSocketSecurity
public class SecurityConfig {

	@Autowired
	SecurityFilter securityFilter;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		DefaultSecurityFilterChain build = httpSecurity.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize.requestMatchers("/error").permitAll()
						.requestMatchers("/ws/**").permitAll().requestMatchers(HttpMethod.POST, "/auth/login")
						.permitAll().requestMatchers("/ws/**").permitAll().requestMatchers("/ws").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/validate").permitAll()
						.requestMatchers("/h2-console/**").permitAll()

						// UNITS
						.requestMatchers(HttpMethod.POST, "/units/**").hasAnyAuthority("CREATE_UNIT")
						.requestMatchers(HttpMethod.PUT, "/units/**").hasAnyAuthority("EDIT_UNIT")
						.requestMatchers(HttpMethod.DELETE, "/units/**").hasAnyAuthority("DELETE_UNIT")

						// DEPARTMENTS
						.requestMatchers(HttpMethod.POST, "/departments/**").hasAnyAuthority("CREATE_DEPARTMENT")
						.requestMatchers(HttpMethod.PUT, "/departments/**").hasAnyAuthority("EDIT_DEPARTMENT")
						.requestMatchers(HttpMethod.DELETE, "/departments/**").hasAnyAuthority("DELETE_DEPARTMENT")

						// TICKETS CATEGORY
						.requestMatchers(HttpMethod.GET, "/tickets-category/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/tickets-category/**")
						.hasAnyAuthority("MANAGE_TICKET_CATEGORY")
						.requestMatchers(HttpMethod.PUT, "/tickets-category/**")
						.hasAnyAuthority("MANAGE_TICKET_CATEGORY")
						.requestMatchers(HttpMethod.DELETE, "/tickets-category/**")
						.hasAnyAuthority("MANAGE_TICKET_CATEGORY")

						// USERS
						.requestMatchers(HttpMethod.POST, "/users/**").hasAnyAuthority("CREATE_USER")
						.requestMatchers(HttpMethod.PUT, "/users/**").hasAnyAuthority("EDIT_USER")
						.requestMatchers(HttpMethod.DELETE, "/users/**").hasAnyAuthority("DELETE_USER")

						// TICKETS
						.requestMatchers(HttpMethod.POST, "/ticket/**").hasAnyAuthority("CREATE_TICKET")
						.requestMatchers(HttpMethod.PUT, "/ticket/**").hasAnyAuthority("EDIT_TICKET")
						.requestMatchers(HttpMethod.DELETE, "/ticket/**").hasAnyAuthority("DELETE_TICKET")
						.requestMatchers(HttpMethod.GET, "/ticket/*/attachments/**").permitAll()

						// MESSAGES
						.requestMatchers(HttpMethod.POST, "/messages/**").hasAnyAuthority("CREATE_MESSAGE")

						// CARGOS (Posições/Cargos)
						.requestMatchers(HttpMethod.POST, "/cargos/**").hasAnyAuthority("CREATE_CARGO")
						.requestMatchers(HttpMethod.PUT, "/cargos/**").hasAnyAuthority("EDIT_CARGO")
						.requestMatchers(HttpMethod.DELETE, "/cargos/**").hasAnyAuthority("DELETE_CARGO")

						// PROFILES (Perfis de Usuário)
						.requestMatchers(HttpMethod.POST, "/profiles/**").hasAnyAuthority("CREATE_PROFILE")
						.requestMatchers(HttpMethod.PUT, "/profiles/**").hasAnyAuthority("EDIT_PROFILE")
						.requestMatchers(HttpMethod.DELETE, "/profiles/**").hasAnyAuthority("DELETE_PROFILE")
						.requestMatchers(HttpMethod.POST, "/forms/**").hasAnyAuthority("MANAGE_FORM")
						.requestMatchers(HttpMethod.PUT, "/forms/**").hasAnyAuthority("MANAGE_FORM")
						.requestMatchers(HttpMethod.DELETE, "/forms/**").hasAnyAuthority("MANAGE_FORM").anyRequest()
						.authenticated())
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class).build();
		return build;
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
