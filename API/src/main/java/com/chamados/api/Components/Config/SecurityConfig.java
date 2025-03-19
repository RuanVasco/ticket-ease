package com.chamados.api.Components.Config;

import com.chamados.api.Components.SecurityFilter;
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
		return httpSecurity
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
						.requestMatchers("/h2-console/**").permitAll()

						// UNITS
						.requestMatchers(HttpMethod.GET, "/units/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/units/**").hasAnyAuthority("CREATE_UNIT", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/units/**").hasAnyAuthority("EDIT_UNIT", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/units/**").hasAnyAuthority("DELETE_UNIT", "FULL_ACCESS")

						// DEPARTMENTS
						.requestMatchers(HttpMethod.GET, "/departments/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/departments/**").hasAnyAuthority("CREATE_DEPARTMENT", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/departments/**").hasAnyAuthority("EDIT_DEPARTMENT", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/departments/**").hasAnyAuthority("DELETE_DEPARTMENT", "FULL_ACCESS")

						// TICKETS CATEGORY
						.requestMatchers(HttpMethod.GET, "/tickets-category/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/tickets-category/**").hasAnyAuthority("CREATE_TICKET_CATEGORY", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/tickets-category/**").hasAnyAuthority("EDIT_TICKET_CATEGORY", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/tickets-category/**").hasAnyAuthority("DELETE_TICKET_CATEGORY", "FULL_ACCESS")

						// USERS
						.requestMatchers(HttpMethod.GET, "/users/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/users/**").hasAnyAuthority("CREATE_USER", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/users/**").hasAnyAuthority("EDIT_USER", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/users/**").hasAnyAuthority("DELETE_USER", "FULL_ACCESS")

						// TICKETS
						.requestMatchers(HttpMethod.GET, "/tickets/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/tickets/**").hasAnyAuthority("CREATE_TICKET", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/tickets/**").hasAnyAuthority("EDIT_TICKET", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/tickets/**").hasAnyAuthority("DELETE_TICKET", "FULL_ACCESS")

						// MESSAGES
						.requestMatchers(HttpMethod.GET, "/messages/ticket/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/messages/**").hasAnyAuthority("CREATE_MESSAGE", "FULL_ACCESS")

						// CARGOS (Posições/Cargos)
						.requestMatchers(HttpMethod.GET, "/cargos/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/cargos/**").hasAnyAuthority("CREATE_CARGO", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/cargos/**").hasAnyAuthority("EDIT_CARGO", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/cargos/**").hasAnyAuthority("DELETE_CARGO", "FULL_ACCESS")

						// PROFILES (Perfis de Usuário)
						.requestMatchers(HttpMethod.GET, "/profiles/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/profiles/**").hasAnyAuthority("CREATE_PROFILE", "FULL_ACCESS")
						.requestMatchers(HttpMethod.PUT, "/profiles/**").hasAnyAuthority("EDIT_PROFILE", "FULL_ACCESS")
						.requestMatchers(HttpMethod.DELETE, "/profiles/**").hasAnyAuthority("DELETE_PROFILE", "FULL_ACCESS")

						// PERMISSIONS
						.requestMatchers(HttpMethod.GET, "/permissions/**").permitAll()

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
