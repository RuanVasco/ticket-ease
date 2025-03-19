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
						.requestMatchers(HttpMethod.POST, "/units/**").hasAuthority("CREATE_UNIT")
						.requestMatchers(HttpMethod.PUT, "/units/**").hasAuthority("EDIT_UNIT")
						.requestMatchers(HttpMethod.DELETE, "/units/**").hasAuthority("DELETE_UNIT")

						// DEPARTMENTS
						.requestMatchers(HttpMethod.GET, "/departments/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/departments/**").hasAuthority("CREATE_DEPARTMENT")
						.requestMatchers(HttpMethod.PUT, "/departments/**").hasAuthority("EDIT_DEPARTMENT")
						.requestMatchers(HttpMethod.DELETE, "/departments/**").hasAuthority("DELETE_DEPARTMENT")

						// TICKETS CATEGORY
						.requestMatchers(HttpMethod.GET, "/tickets-category/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/tickets-category/**").hasAuthority("CREATE_TICKET_CATEGORY")
						.requestMatchers(HttpMethod.PUT, "/tickets-category/**").hasAuthority("EDIT_TICKET_CATEGORY")
						.requestMatchers(HttpMethod.DELETE, "/tickets-category/**").hasAuthority("DELETE_TICKET_CATEGORY")

						// USERS
						.requestMatchers(HttpMethod.GET, "/users/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/users/**").hasAuthority("CREATE_USER")
						.requestMatchers(HttpMethod.PUT, "/users/**").hasAuthority("EDIT_USER")
						.requestMatchers(HttpMethod.DELETE, "/users/**").hasAuthority("DELETE_USER")

						// TICKETS
						.requestMatchers(HttpMethod.GET, "/tickets/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/tickets/**").hasAuthority("CREATE_TICKET")
						.requestMatchers(HttpMethod.PUT, "/tickets/**").hasAuthority("EDIT_TICKET")
						.requestMatchers(HttpMethod.DELETE, "/tickets/**").hasAuthority("DELETE_TICKET")

						// MESSAGES
						.requestMatchers(HttpMethod.GET, "/messages/ticket/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/messages/**").hasAuthority("CREATE_MESSAGE")

						// CARGOS (Posições/Cargos)
						.requestMatchers(HttpMethod.GET, "/cargos/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/cargos/**").hasAuthority("CREATE_CARGO")
						.requestMatchers(HttpMethod.PUT, "/cargos/**").hasAuthority("EDIT_CARGO")
						.requestMatchers(HttpMethod.DELETE, "/cargos/**").hasAuthority("DELETE_CARGO")

						// PROFILES (Perfis de Usuário)
						.requestMatchers(HttpMethod.GET, "/profiles/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/profiles/**").hasAuthority("CREATE_PROFILE")
						.requestMatchers(HttpMethod.PUT, "/profiles/**").hasAuthority("EDIT_PROFILE")
						.requestMatchers(HttpMethod.DELETE, "/profiles/**").hasAuthority("DELETE_PROFILE")
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
